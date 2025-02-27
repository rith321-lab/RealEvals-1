from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from ..models.models import Submission, EvaluationResult, Leaderboard , Agent
from ..models.enums import SubmissionStatus, EvaluationStatus
import random
import uuid 
from uuid import UUID
from ..schemas.submission_schema import LeaderboardResponse

from datetime import datetime
import time

class SubmissionService:
    def __init__(self, db: Session):
        self._db = db

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
            submission = self._db.query(Submission).filter(Submission.id == submission_id).with_for_update().first()
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
            submission.status = SubmissionStatus.PROCESSING
            self._db.commit()
            time.sleep(random.uniform(1, 3))
            score = random.uniform(60, 100)
            time_taken = random.uniform(1, 10)
            accuracy = random.uniform(0.7, 1.0)
            evaluation = EvaluationResult(
                submissionId=submission.id,
                score=score,
                timeTaken=time_taken,
                accuracy=accuracy,
                completedAt=datetime.utcnow(),
                status=EvaluationStatus.SUCCESS,
                resultDetails=self._generate_result_details()
            )
            self._db.add(evaluation)
            leaderboard = Leaderboard(
                taskId=submission.taskId,
                agentId=submission.agentId,
                submissionId=submission.id,
                score=score,
                timeTaken=time_taken,
                accuracy=accuracy,
                rank=0
            )
            self._db.add(leaderboard)
            self._db.commit()
            self._update_ranks(submission.taskId)
            submission.status = SubmissionStatus.COMPLETED
            self._db.commit()
            return self._get_full_submission(submission.id)
        except Exception as e:
            self._db.rollback()
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

    def _generate_result_details(self):
        return {
            "task_completion": random.uniform(0.8, 1.0),
            "navigation_efficiency": random.uniform(0.7, 1.0),
            "error_rate": random.uniform(0, 0.2),
            "steps_taken": random.randint(5, 15),
            "web_interactions": {
                "clicks": random.randint(3, 10),
                "form_fills": random.randint(1, 5),
                "navigation_steps": random.randint(2, 8)
            }
        }

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

