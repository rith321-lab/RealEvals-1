from fastapi import HTTPException
from ..services.submission_service import SubmissionService
from ..schemas.submission_schema import SubmissionCreate, SubmissionResponse, SubmissionListResponse, EvaluationResultResponse , LeaderboardResponse
from sqlalchemy.orm import Session
import uuid
from fastapi import BackgroundTasks

class SubmissionController:
    def __init__(self, db: Session):
        self.submission_service = SubmissionService(db)

    async def create_submission(self, submission_data: SubmissionCreate, user_id: uuid.UUID, background_tasks: BackgroundTasks) -> SubmissionResponse:
        try:
            submission = self.submission_service.create_submission(user_id, submission_data.agentId, submission_data.taskId)
            background_tasks.add_task(self.submission_service.process_submission, submission.id)
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

    
    def _format_submission_response(self, submission):
        evaluation = submission.evaluation if submission.evaluation else None
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
            rank=submission.leaderboard_entry.rank if submission.leaderboard_entry else None
        )
    
    async def get_leaderboard(self, task_id: uuid.UUID) -> list[LeaderboardResponse]:
        try:
            leaderboard_entries = self.submission_service.get_leaderboard(task_id)
            return leaderboard_entries
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
