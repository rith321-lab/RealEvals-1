from fastapi import APIRouter, Depends, HTTPException, status
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
    current_user: User = Depends(get_current_user)
):
    controller = AgentController()
    return await controller.create_agent(agent, current_user.id)

@router.get("", response_model=List[AgentResponse])
async def get_my_agents(
    current_user: User = Depends(get_current_user)
):
    """Get all agents for current user"""
    controller = AgentController()
    return await controller.get_user_agents(current_user.id)

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(
    agent_id: str,
    current_user: User = Depends(get_current_user)
):
    
    try:
        agent_uuid = UUID(agent_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid agent ID format")

    controller = AgentController()
    return await controller.get_agent(agent_uuid, current_user.id)
