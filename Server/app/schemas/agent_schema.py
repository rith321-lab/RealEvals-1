from pydantic import BaseModel
from typing import Optional, Dict , Any
from datetime import datetime
from uuid import UUID

class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    configurationJson: Dict[str, Any]

class AgentResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    configurationJson: Dict
    createdAt: datetime
    updatedAt: Optional[datetime]
    isActive: bool
    userId: UUID

    class Config:
        from_attributes = True