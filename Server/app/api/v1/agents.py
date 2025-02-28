from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...controllers.agent_controller import AgentController
from ...schemas.agent_schema import AgentCreate, AgentResponse
from ...core.security import get_current_user
from ...models.models import User, UserRole
from typing import List
from uuid import UUID

router = APIRouter(prefix="/agents", tags=["Agents"])

@router.post("", response_model=AgentResponse)
async def create_agent(
    agent: AgentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    controller = AgentController(db)
    return await controller.create_agent(agent, current_user.id)

@router.get("", response_model=List[AgentResponse])
async def get_my_agents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    controller = AgentController(db)
    return await controller.get_user_agents(current_user.id)

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    try:
        agent_uuid = UUID(agent_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid agent ID format")

    controller = AgentController(db)
    return await controller.get_agent(agent_uuid, current_user.id)