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
            
            if response.data:
                # Convert to the expected response format
                agent = response.data[0]
                return {
                    "id": agent.get("id"),
                    "name": agent.get("name"),
                    "description": agent.get("description"),
                    "configurationJson": agent.get("configuration", {}),
                    "createdAt": agent.get("created_at"),
                    "updatedAt": agent.get("updated_at"),
                    "isActive": agent.get("is_active", True),
                    "userId": agent.get("user_id")
                }
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create agent")
        except Exception as e:
            logger.error(f"Error creating agent: {str(e)}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    def get_user_agents(self, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        response = self._db.table("agents").select("*").eq("user_id", str(user_id)).eq("is_active", True).execute()
        agents = response.data
        
        # Convert to the expected response format
        formatted_agents = []
        for agent in agents:
            formatted_agents.append({
                "id": agent.get("id"),
                "name": agent.get("name"),
                "description": agent.get("description"),
                "configurationJson": agent.get("configuration", {}),
                "createdAt": agent.get("created_at"),
                "updatedAt": agent.get("updated_at"),
                "isActive": agent.get("is_active", True),
                "userId": agent.get("user_id")
            })
                
        return formatted_agents

   
