from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..models.models import Agent
import uuid

class AgentService:
    def __init__(self, db: Session):
        self._db = db

    def create_agent(self, agent_data: dict, user_id: uuid.UUID) -> Agent:
        try:
            print("Creating agent for user:", user_id)
            print("Agent data:", agent_data)

            agent = Agent(
                **agent_data,
                userId=user_id
            )
            print(agent)
            self._db.add(agent)
            self._db.commit()
            self._db.refresh(agent)
            return agent
        except Exception as e:
            self._db.rollback()
            print("Error creating agent:", str(e))
            raise HTTPException(status_code=500, detail=str(e))

    def get_user_agents(self, user_id: uuid.UUID):
        return self._db.query(Agent).filter(
            Agent.userId == user_id,
            Agent.isActive == True
        ).all()

    def get_agent_by_id(self, agent_id: uuid.UUID, user_id: uuid.UUID) -> Agent:
        agent = self._db.query(Agent).filter(
            Agent.id == agent_id,
            Agent.userId == user_id,
            Agent.isActive == True
        ).first()
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        return agent