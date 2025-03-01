from pydantic import BaseModel, field_validator, Field
from typing import Optional, Dict, List, Any
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
    options: Optional[Dict[str, Any]] = Field(
        default=None, 
        description="Optional configuration for the Browser Use API task"
    )

class SubmissionResponse(BaseModel):
    id: UUID
    agentId: UUID
    taskId: UUID
    status: SubmissionStatus
    submittedAt: datetime
    result: Optional[EvaluationResultResponse] = None
    rank: Optional[int] = None
    browserUseTaskId: Optional[str] = None

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

class SubmissionStatusResponse(BaseModel):
    """Detailed status of a submission including Browser Use task progress"""
    submissionId: UUID = Field(..., description="Submission ID")
    status: str = Field(..., description="Current status of the submission")
    browserUseTaskId: Optional[str] = Field(None, description="Browser Use API task ID if available")
    taskStatus: Optional[str] = Field(None, description="Status of the Browser Use task")
    stepsCompleted: Optional[int] = Field(None, description="Number of steps completed in the task")
    progress: Optional[float] = Field(None, description="Progress percentage (0-100)")
    activeDetails: Optional[Dict[str, Any]] = Field(None, description="Active submission details")
    evaluation: Optional[Dict[str, Any]] = Field(None, description="Evaluation results if completed")
    videoUrl: Optional[str] = Field(None, description="URL to the task execution video if available")
    screenshots: Optional[List[str]] = Field(None, description="List of screenshot URLs if available")

class SubmissionControlRequest(BaseModel):
    """Request to control a submission (pause, resume, stop)"""
    action: str = Field(..., description="Action to perform: pause, resume, or stop")

class SubmissionControlResponse(BaseModel):
    """Response for submission control actions"""
    submissionId: UUID = Field(..., description="Submission ID")
    action: str = Field(..., description="Action that was performed")
    success: bool = Field(..., description="Whether the action was successful")
    message: Optional[str] = Field(None, description="Additional information about the action")
