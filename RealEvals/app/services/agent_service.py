from fastapi import HTTPException, status
from typing import List, Dict, Any
from ..db.database import get_db
import uuid
from loguru import logger

class AgentService:
    def __init__(self):
        self._db = get_db()

    def create_agent(self, agent_data: dict, user_id: uuid.UUID) -> Dict[str, Any]:
        try:
            logger.info(f"Creating agent for user: {user_id}")
            logger.debug(f"Agent data: {agent_data}")

            agent_data["userId"] = str(user_id)
            response = self._db.table("agents").insert(agent_data).execute()
            
            if response.data:
                return response.data[0]
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create agent")
        except Exception as e:
            logger.error(f"Error creating agent: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def get_user_agents(self, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        response = self._db.table("agents").select("*").eq("userId", str(user_id)).eq("isActive", True).execute()
        return response.data

    def get_agent_by_id(self, agent_id: uuid.UUID, user_id: uuid.UUID) -> Dict[str, Any]:
        response = self._db.table("agents").select("*").eq("id", str(agent_id)).eq("userId", str(user_id)).eq("isActive", True).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Agent not found")
        return response.data