from fastapi import HTTPException
from ..services.agent_service import AgentService
from ..schemas.agent_schema import AgentCreate, AgentResponse
import uuid

class AgentController:
    def __init__(self):
        self.agent_service = AgentService()

    async def create_agent(self, agent_data: AgentCreate, user_id: uuid.UUID) -> AgentResponse:
        agent = self.agent_service.create_agent(agent_data.dict(), user_id)
        return AgentResponse(**agent)

    async def get_user_agents(self, user_id: uuid.UUID):
        agents = self.agent_service.get_user_agents(user_id)
        return [AgentResponse(**agent) for agent in agents]

    async def get_agent(self, agent_id: uuid.UUID, user_id: uuid.UUID) -> AgentResponse:
        agent = self.agent_service.get_agent_by_id(agent_id, user_id)
        return AgentResponse(**agent)