from pydantic import BaseModel, field_validator
from typing import Optional, Dict, List
from datetime import datetime
from uuid import UUID
from ..models.enums import SubmissionStatus

class EvaluationResultResponse(BaseModel):
    score: float
    timeTaken: float
    accuracy: float
    resultDetails: Dict

    @field_validator('score')
    def validate_score(cls, v):
        if not (0 <= v <= 100):
            raise ValueError("Score must be between 0 and 100")
        return v

    class Config:
        from_attributes = True

class SubmissionCreate(BaseModel):
    agentId: UUID
    taskId: UUID

class SubmissionResponse(BaseModel):
    id: UUID
    agentId: UUID
    taskId: UUID
    status: SubmissionStatus
    submittedAt: datetime
    result: Optional[EvaluationResultResponse] = None
    rank: Optional[int] = None

    class Config:
        from_attributes = True

class SubmissionListResponse(BaseModel):
    items: List[SubmissionResponse]
    total: int

class LeaderboardResponse(BaseModel):
    rank: int
    score: float
    timeTaken: float
    accuracy: float
    submissionId: UUID
    agentId: UUID
    taskId: UUID
    agentName: str

    class Config:
        from_attributes = True
