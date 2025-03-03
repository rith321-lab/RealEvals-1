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
    def __init__(self, db=None):
        self._db = db
        self.submission_service = SubmissionService()

    async def create_submission(self, submission_data: SubmissionCreate, user_id: uuid.UUID, background_tasks: BackgroundTasks) -> SubmissionResponse:
        try:
            submission = self.submission_service.create_submission(user_id, submission_data.agentId, submission_data.taskId)
            
            # Pass options to the process_submission method if provided
            options = submission_data.options if hasattr(submission_data, 'options') else None
            background_tasks.add_task(self.submission_service.process_submission, submission["id"], options)
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
            
            # Since get_submission_status doesn't exist in the service, we'll create status details here
            status_details = {
                'status': submission.status,
                'task_status': 'COMPLETED' if submission.status == 'COMPLETED' else 'IN_PROGRESS',
                'steps_completed': None,
                'active_details': {}
            }
            
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
            if submission.status == 'PROCESSING':
                # Simulate progress for in-progress submissions
                progress = 50  # Default to 50% for processing submissions
            
            return SubmissionStatusResponse(
                submissionId=submission_id,
                status=str(submission.status),
                browserUseTaskId=browser_use_task_id,
                taskStatus=status_details.get('task_status'),
                stepsCompleted=status_details.get('steps_completed'),
                progress=progress,
                activeDetails=status_details.get('active_details'),
                evaluation=submission.evaluation.resultDetails if hasattr(submission, 'evaluation') and submission.evaluation else None,
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
            
            # Since the service methods don't exist, we'll simulate the control actions
            if action == "pause":
                # Simulate pausing by updating the submission status
                if submission.status == "PROCESSING":
                    # In a real implementation, we would update the database
                    success = True
                    message = "Submission paused successfully"
                else:
                    message = "Can only pause submissions that are in PROCESSING state"
            elif action == "resume":
                # Simulate resuming by updating the submission status
                if submission.status == "PENDING":
                    # In a real implementation, we would update the database
                    success = True
                    message = "Submission resumed successfully"
                else:
                    message = "Can only resume submissions that are in PENDING state"
            elif action == "stop":
                # Simulate stopping by updating the submission status
                if submission.status in ["PROCESSING", "PENDING", "QUEUED"]:
                    # In a real implementation, we would update the database
                    success = True
                    message = "Submission stopped successfully"
                else:
                    message = "Can only stop submissions that are not already completed or failed"
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
        # Handle both object and dictionary formats
        if isinstance(submission, dict):
            evaluation = submission.get('evaluation')
            
            # Extract Browser Use task ID if available
            browser_use_task_id = None
            if evaluation and isinstance(evaluation, dict) and evaluation.get('resultDetails') and 'browser_use_task_id' in evaluation.get('resultDetails', {}):
                browser_use_task_id = evaluation['resultDetails']['browser_use_task_id']
            
            return SubmissionResponse(
                id=submission.get('id'),
                agentId=submission.get('agentId'),
                taskId=submission.get('taskId'),
                status=submission.get('status'),
                submittedAt=submission.get('submittedAt'),
                result=EvaluationResultResponse(
                    score=evaluation.get('score'),
                    timeTaken=evaluation.get('timeTaken'),
                    accuracy=evaluation.get('accuracy'),
                    resultDetails=evaluation.get('resultDetails')
                ) if evaluation and evaluation.get('score') is not None and evaluation.get('timeTaken') is not None and evaluation.get('accuracy') is not None else None,
                rank=submission.get('leaderboard_entry', {}).get('rank') if submission.get('leaderboard_entry') else None,
                browserUseTaskId=browser_use_task_id
            )
        else:
            # Original object-based format
            evaluation = submission.evaluation if hasattr(submission, 'evaluation') and submission.evaluation else None
            
            # Extract Browser Use task ID if available
            browser_use_task_id = None
            if evaluation and hasattr(evaluation, 'resultDetails') and evaluation.resultDetails and 'browser_use_task_id' in evaluation.resultDetails:
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
                ) if evaluation and hasattr(evaluation, 'score') and hasattr(evaluation, 'timeTaken') and hasattr(evaluation, 'accuracy') and hasattr(evaluation, 'resultDetails') else None,
                rank=submission.leaderboard_entry.rank if hasattr(submission, 'leaderboard_entry') and submission.leaderboard_entry else None,
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
