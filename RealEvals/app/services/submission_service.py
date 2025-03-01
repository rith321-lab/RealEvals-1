from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from ..models.models import Submission, EvaluationResult, Leaderboard, Agent, Task
from ..models.enums import SubmissionStatus, EvaluationStatus
import random
import uuid 
from uuid import UUID
from ..schemas.submission_schema import LeaderboardResponse
from ..services.browser_use_service import BrowserUseService
from datetime import datetime
import time
from loguru import logger
import asyncio
from typing import Dict, Any, Optional

class SubmissionService:
    def __init__(self, db: Session):
        self._db = db
        self._browser_use_service = BrowserUseService()
        self._active_submissions = {}  # Track active submissions

    def create_submission(self, user_id: uuid.UUID, agent_id: uuid.UUID, task_id: uuid.UUID) -> Submission:
        try:
            submission = Submission(userId=user_id, agentId=agent_id, taskId=task_id, status=SubmissionStatus.QUEUED, submittedAt=datetime.utcnow())
            self._db.add(submission)
            self._db.commit()
            self._db.refresh(submission)
            return submission
        except Exception as e:
            self._db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    def process_submission(self, submission_id: uuid.UUID):
        try:
            # Get submission with related agent and task data
            submission = self._db.query(Submission)\
                .options(
                    joinedload(Submission.agent),
                    joinedload(Submission.task)
                )\
                .filter(Submission.id == submission_id)\
                .with_for_update()\
                .first()
                
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
                
            # Update submission status to processing
            submission.status = SubmissionStatus.PROCESSING
            self._db.commit()
            
            # Add to active submissions
            self._active_submissions[str(submission_id)] = {
                "submission_id": submission_id,
                "start_time": time.time(),
                "status": "processing",
                "task_id": None,
                "progress": 0
            }
            
            # Execute the task using Browser Use API
            logger.info(f"Processing submission {submission_id} using Browser Use API")
            
            # Define a callback to track progress
            def update_progress(task_details):
                steps = task_details.get('steps', [])
                status = task_details.get('status')
                self._active_submissions[str(submission_id)].update({
                    "progress": len(steps),
                    "status": status,
                    "last_update": time.time()
                })
            
            # Use the Browser Use service to execute the task
            evaluation = self._browser_use_service.execute_agent_task(submission, callback=update_progress)
            
            # Update active submissions
            if str(submission_id) in self._active_submissions:
                self._active_submissions[str(submission_id)]["status"] = "completed"
            
            # Add evaluation result to database
            self._db.add(evaluation)
            
            # Create leaderboard entry
            leaderboard = Leaderboard(
                taskId=submission.taskId,
                agentId=submission.agentId,
                submissionId=submission.id,
                score=evaluation.score,
                timeTaken=evaluation.timeTaken,
                accuracy=evaluation.accuracy,
                rank=0
            )
            self._db.add(leaderboard)
            self._db.commit()
            
            # Update leaderboard rankings
            self._update_ranks(submission.taskId)
            
            # Mark submission as completed
            submission.status = SubmissionStatus.COMPLETED
            self._db.commit()
            
            return self._get_full_submission(submission.id)
        except Exception as e:
            self._db.rollback()
            logger.error(f"Error processing submission {submission_id}: {str(e)}")
            
            # Update active submissions
            if str(submission_id) in self._active_submissions:
                self._active_submissions[str(submission_id)]["status"] = "failed"
                self._active_submissions[str(submission_id)]["error"] = str(e)
            
            # Update submission status to failed
            submission = self._db.query(Submission).filter(Submission.id == submission_id).first()
            if submission:
                submission.status = SubmissionStatus.FAILED
                self._db.commit()
                
            raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    def get_user_submissions(self, user_id: uuid.UUID, skip: int = 0, limit: int = 20) -> dict[str, any]:
        try:
            total = self._db.query(Submission).filter(Submission.userId == user_id).count()
            submissions = self._db.query(Submission).options(joinedload(Submission.evaluation), joinedload(Submission.leaderboard_entry)).filter(Submission.userId == user_id).order_by(Submission.submittedAt.desc()).offset(skip).limit(limit).all()
            return {"items": submissions, "total": total}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def get_submission_status(self, submission_id: uuid.UUID) -> Dict[str, Any]:
        """Get detailed status of a submission including Browser Use task progress"""
        try:
            submission = self._db.query(Submission).filter(Submission.id == submission_id).first()
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
            
            # Get active submission details if available
            active_details = self._active_submissions.get(str(submission_id), {})
            
            # Get evaluation if completed
            evaluation = None
            if submission.status == SubmissionStatus.COMPLETED:
                evaluation = self._db.query(EvaluationResult).filter(EvaluationResult.submissionId == submission_id).first()
                
                # If we have an evaluation with Browser Use task ID, get the latest details
                if evaluation and evaluation.resultDetails and 'browser_use_task_id' in evaluation.resultDetails:
                    task_id = evaluation.resultDetails['browser_use_task_id']
                    try:
                        task_details = self._browser_use_service.get_task_details(task_id)
                        return {
                            "submission_id": str(submission_id),
                            "status": submission.status.value,
                            "browser_use_task_id": task_id,
                            "task_status": task_details.get('status'),
                            "steps_completed": len(task_details.get('steps', [])),
                            "evaluation": {
                                "score": evaluation.score,
                                "accuracy": evaluation.accuracy,
                                "time_taken": evaluation.timeTaken
                            }
                        }
                    except Exception as e:
                        logger.error(f"Error getting Browser Use task details: {str(e)}")
            
            # Return basic status if no active details or evaluation
            return {
                "submission_id": str(submission_id),
                "status": submission.status.value,
                "active_details": active_details,
                "evaluation": evaluation.dict() if evaluation else None
            }
        except Exception as e:
            logger.error(f"Error getting submission status: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def pause_submission(self, submission_id: uuid.UUID) -> bool:
        """Pause a running submission by pausing its Browser Use task"""
        try:
            submission = self._db.query(Submission).filter(Submission.id == submission_id).first()
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
            
            if submission.status != SubmissionStatus.PROCESSING:
                return False
            
            # Get active submission details
            active_details = self._active_submissions.get(str(submission_id))
            if not active_details or not active_details.get("task_id"):
                return False
            
            # Pause the Browser Use task
            task_id = active_details["task_id"]
            result = self._browser_use_service.pause_task(task_id)
            
            if result:
                active_details["status"] = "paused"
            
            return result
        except Exception as e:
            logger.error(f"Error pausing submission: {str(e)}")
            return False

    def resume_submission(self, submission_id: uuid.UUID) -> bool:
        """Resume a paused submission by resuming its Browser Use task"""
        try:
            submission = self._db.query(Submission).filter(Submission.id == submission_id).first()
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
            
            # Get active submission details
            active_details = self._active_submissions.get(str(submission_id))
            if not active_details or not active_details.get("task_id"):
                return False
            
            # Resume the Browser Use task
            task_id = active_details["task_id"]
            result = self._browser_use_service.resume_task(task_id)
            
            if result:
                active_details["status"] = "processing"
            
            return result
        except Exception as e:
            logger.error(f"Error resuming submission: {str(e)}")
            return False

    def _get_full_submission(self, submission_id: uuid.UUID):
        return self._db.query(Submission).options(joinedload(Submission.evaluation), joinedload(Submission.leaderboard_entry)).filter(Submission.id == submission_id).first()

    def _update_ranks(self, task_id: uuid.UUID):
        entries = self._db.query(Leaderboard).filter(Leaderboard.taskId == task_id).order_by(Leaderboard.score.desc()).all()
        for index, entry in enumerate(entries, 1):
            entry.rank = index
        self._db.commit()
    
    def get_leaderboard(self, task_id: UUID) -> list[LeaderboardResponse]:
        try:
            leaderboard_entries = self._db.query(Leaderboard, Agent.name)\
                .join(Agent, Leaderboard.agentId == Agent.id)\
                .filter(Leaderboard.taskId == task_id)\
                .order_by(Leaderboard.rank.asc())\
                .all()
            leaderboard_response = [
                LeaderboardResponse(
                    rank=entry.Leaderboard.rank,
                    score=entry.Leaderboard.score,
                    timeTaken=entry.Leaderboard.timeTaken,
                    accuracy=entry.Leaderboard.accuracy,
                    submissionId=entry.Leaderboard.submissionId,
                    agentId=entry.Leaderboard.agentId,
                    taskId=entry.Leaderboard.taskId,
                    agentName=entry.name  
                )
                for entry in leaderboard_entries
            ]

            return leaderboard_response
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
