from fastapi import HTTPException
from ..services.submission_service import SubmissionService
from ..schemas.submission_schema import (
    SubmissionCreate, 
    SubmissionResponse, 
    SubmissionListResponse, 
    EvaluationResultResponse, 
    LeaderboardResponse,
    SubmissionStatusResponse,
    SubmissionControlRequest,
    SubmissionControlResponse
)
from sqlalchemy.orm import Session
import uuid
from fastapi import BackgroundTasks
from typing import Dict, Any, Optional

class SubmissionController:
    def __init__(self, db: Session):
        self.submission_service = SubmissionService(db)

    async def create_submission(self, submission_data: SubmissionCreate, user_id: uuid.UUID, background_tasks: BackgroundTasks) -> SubmissionResponse:
        try:
            submission = self.submission_service.create_submission(user_id, submission_data.agentId, submission_data.taskId)
            
            # Pass options to the process_submission method if provided
            options = submission_data.options if hasattr(submission_data, 'options') else None
            background_tasks.add_task(self.submission_service.process_submission, submission.id, options)
            
            return self._format_submission_response(submission)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def get_user_submissions(self, user_id: uuid.UUID, skip: int = 0, limit: int = 20) -> SubmissionListResponse:
        result = self.submission_service.get_user_submissions(user_id, skip, limit)
        return SubmissionListResponse(items=[self._format_submission_response(sub) for sub in result["items"]], total=result["total"])
    
    async def get_submission_details(self, submission_id: uuid.UUID, user_id: uuid.UUID) -> SubmissionResponse:
        try:
            submission = self.submission_service._get_full_submission(submission_id)
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
            if submission.userId != user_id:
                raise HTTPException(status_code=403, detail="You do not have permission to access this submission")
            return self._format_submission_response(submission)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def get_submission_status(self, submission_id: uuid.UUID, user_id: uuid.UUID) -> SubmissionStatusResponse:
        """Get detailed status of a submission including Browser Use task progress"""
        try:
            submission = self.submission_service._get_full_submission(submission_id)
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
            if submission.userId != user_id:
                raise HTTPException(status_code=403, detail="You do not have permission to access this submission")
            
            # Get status details from service
            status_details = self.submission_service.get_submission_status(submission_id)
            
            # Extract Browser Use task ID if available
            browser_use_task_id = None
            video_url = None
            screenshots = None
            
            if submission.evaluation and submission.evaluation.resultDetails:
                details = submission.evaluation.resultDetails
                browser_use_task_id = details.get('browser_use_task_id')
                video_url = details.get('video_url')
                screenshots = details.get('screenshots')
            
            # Calculate progress percentage
            progress = None
            if status_details.get('steps_completed') is not None and 'active_details' in status_details:
                active_details = status_details['active_details']
                if 'progress' in active_details and active_details['progress'] > 0:
                    progress = min(100, (active_details['progress'] / max(1, active_details.get('expected_steps', 10))) * 100)
            
            return SubmissionStatusResponse(
                submissionId=submission_id,
                status=status_details.get('status'),
                browserUseTaskId=browser_use_task_id,
                taskStatus=status_details.get('task_status'),
                stepsCompleted=status_details.get('steps_completed'),
                progress=progress,
                activeDetails=status_details.get('active_details'),
                evaluation=status_details.get('evaluation'),
                videoUrl=video_url,
                screenshots=screenshots
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def control_submission(self, submission_id: uuid.UUID, user_id: uuid.UUID, control: SubmissionControlRequest) -> SubmissionControlResponse:
        """Control a submission (pause, resume, stop)"""
        try:
            submission = self.submission_service._get_full_submission(submission_id)
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
            if submission.userId != user_id:
                raise HTTPException(status_code=403, detail="You do not have permission to control this submission")
            
            action = control.action.lower()
            success = False
            message = None
            
            if action == "pause":
                success = self.submission_service.pause_submission(submission_id)
                message = "Submission paused successfully" if success else "Failed to pause submission"
            elif action == "resume":
                success = self.submission_service.resume_submission(submission_id)
                message = "Submission resumed successfully" if success else "Failed to resume submission"
            elif action == "stop":
                # Implement stop functionality in submission service if needed
                if hasattr(self.submission_service, 'stop_submission'):
                    success = self.submission_service.stop_submission(submission_id)
                    message = "Submission stopped successfully" if success else "Failed to stop submission"
                else:
                    message = "Stop action not implemented"
            else:
                raise HTTPException(status_code=400, detail=f"Invalid action: {action}")
            
            return SubmissionControlResponse(
                submissionId=submission_id,
                action=action,
                success=success,
                message=message
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    def _format_submission_response(self, submission):
        evaluation = submission.evaluation if submission.evaluation else None
        
        # Extract Browser Use task ID if available
        browser_use_task_id = None
        if evaluation and evaluation.resultDetails and 'browser_use_task_id' in evaluation.resultDetails:
            browser_use_task_id = evaluation.resultDetails['browser_use_task_id']
        
        return SubmissionResponse(
            id=submission.id,
            agentId=submission.agentId,
            taskId=submission.taskId,
            status=submission.status,
            submittedAt=submission.submittedAt,
            result=EvaluationResultResponse(
                score=evaluation.score,
                timeTaken=evaluation.timeTaken,
                accuracy=evaluation.accuracy,
                resultDetails=evaluation.resultDetails
            ) if evaluation else None,
            rank=submission.leaderboard_entry.rank if submission.leaderboard_entry else None,
            browserUseTaskId=browser_use_task_id
        )
    
    async def get_leaderboard(self, task_id: uuid.UUID) -> list[LeaderboardResponse]:
        try:
            leaderboard_entries = self.submission_service.get_leaderboard(task_id)
            return leaderboard_entries
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    async def get_user_submissions_by_task(self, user_id: uuid.UUID, task_id: uuid.UUID, skip: int = 0, limit: int = 20) -> SubmissionListResponse:
        """Get all submissions of a user for a specific task"""
        try:
            # Implement this method in the submission service
            if hasattr(self.submission_service, 'get_user_submissions_by_task'):
                result = self.submission_service.get_user_submissions_by_task(user_id, task_id, skip, limit)
                return SubmissionListResponse(
                    items=[self._format_submission_response(sub) for sub in result["items"]], 
                    total=result["total"]
                )
            else:
                # Fallback to filtering all user submissions
                all_submissions = self.submission_service.get_user_submissions(user_id, 0, 1000)
                task_submissions = [s for s in all_submissions["items"] if str(s.taskId) == str(task_id)]
                
                # Apply pagination
                paginated = task_submissions[skip:skip+limit]
                return SubmissionListResponse(
                    items=[self._format_submission_response(sub) for sub in paginated], 
                    total=len(task_submissions)
                )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
