from pydantic import BaseModel
from typing import Optional, Dict, List
from datetime import datetime
from ..models.enums import TaskDifficulty
import uuid

class TaskCreate(BaseModel):
    title: str
    description: str
    difficulty: TaskDifficulty
    webArenaEnvironment: str
    environmentConfig: Dict

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[TaskDifficulty] = None
    webArenaEnvironment: Optional[str] = None
    environmentConfig: Optional[Dict] = None

class TaskResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    difficulty: TaskDifficulty
    webArenaEnvironment: str
    environmentConfig: Dict
    createdAt: datetime
    updatedAt: Optional[datetime] = None  # Make updatedAt optional
    createdBy: uuid.UUID

    class Config:
        from_attributes = True

class TaskListResponse(BaseModel):
    items: List[TaskResponse]
    total: int
    page: int
    size: int