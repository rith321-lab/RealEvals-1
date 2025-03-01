from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any
from datetime import datetime
from ..models.enums import TaskDifficulty
import uuid

class BrowserTaskEnvironment(BaseModel):
    """Configuration for a browser-based task environment"""
    startUrl: str = Field(..., description="Starting URL for the task")
    objective: str = Field(..., description="Main objective of the task")
    expectedSteps: Optional[int] = Field(None, description="Expected number of steps to complete the task")
    maxTimeAllowed: Optional[int] = Field(None, description="Maximum time allowed in seconds")
    expectedResults: Optional[Dict[str, Any]] = Field(None, description="Expected results to validate task completion")
    successCriteria: Optional[List[str]] = Field(None, description="Criteria to determine task success")

class TaskCreate(BaseModel):
    title: str
    description: str
    difficulty: TaskDifficulty
    webArenaEnvironment: str
    environmentConfig: Dict[str, Any] = Field(
        ...,
        description="Configuration for the task environment including Browser Use API settings"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Product Search Task",
                "description": "Search for a specific product on an e-commerce website and extract details",
                "difficulty": "MEDIUM",
                "webArenaEnvironment": "e-commerce",
                "environmentConfig": {
                    "startUrl": "https://www.example-shop.com",
                    "objective": "Search for 'wireless headphones' and extract the top 3 results with prices",
                    "expectedSteps": 5,
                    "maxTimeAllowed": 60,
                    "expectedResults": {
                        "resultCount": 3,
                        "dataFields": ["title", "price", "rating"]
                    },
                    "successCriteria": [
                        "Must find at least 3 products",
                        "Must extract price information",
                        "Must complete within time limit"
                    ],
                    "timeWeight": 0.3,
                    "accuracyWeight": 0.7
                }
            }
        }

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