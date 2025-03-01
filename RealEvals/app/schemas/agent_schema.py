from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from uuid import UUID

class BrowserAction(BaseModel):
    """Represents a browser action for the agent to perform"""
    type: str = Field(..., description="Type of action (click, input, select, wait)")
    target: Optional[str] = Field(None, description="Target element or selector")
    value: Optional[str] = Field(None, description="Value for input or select actions")
    duration: Optional[int] = Field(None, description="Duration for wait actions in seconds")

class AgentConfiguration(BaseModel):
    """Configuration for an agent using Browser Use API"""
    actions: Optional[List[BrowserAction]] = Field([], description="List of predefined actions for the agent")
    prompts: Optional[Dict[str, str]] = Field({}, description="Prompts for different scenarios")
    capabilities: Optional[List[str]] = Field([], description="Agent capabilities")
    settings: Optional[Dict[str, Any]] = Field({}, description="Additional settings for the agent")

class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    configurationJson: Dict[str, Any] = Field(
        ..., 
        description="Agent configuration including actions, prompts, and settings"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Search Agent",
                "description": "An agent that can search for information on the web",
                "configurationJson": {
                    "actions": [
                        {"type": "input", "target": "search_box", "value": "{query}"},
                        {"type": "click", "target": "search_button"},
                        {"type": "wait", "duration": 2}
                    ],
                    "prompts": {
                        "default": "Search for {query} and extract relevant information"
                    },
                    "capabilities": ["search", "extract_data"],
                    "settings": {
                        "timeout": 30,
                        "max_retries": 3
                    }
                }
            }
        }

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