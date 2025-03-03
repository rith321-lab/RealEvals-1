import uuid
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from loguru import logger
from ..db.database import get_db

class TaskService:
    def __init__(self):
        self._db = get_db()

    def get_tasks(self, skip: int = 0, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get all tasks from the database with pagination
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records to return
        """
        try:
            result = self._db.table("tasks").select("*").execute()
            
            # Apply pagination in memory since Supabase doesn't support it directly
            paginated_data = result.data[skip:skip + limit] if result.data else []
            
            # Convert the database records to the expected format
            formatted_tasks = []
            for db_task in paginated_data:
                # Try to parse environment as JSON if it's a string
                environment_config = {}
                environment_type = "default"
                if db_task.get("environment"):
                    try:
                        import json
                        env_data = json.loads(db_task.get("environment"))
                        if isinstance(env_data, dict):
                            environment_type = env_data.get("type", "default")
                            environment_config = env_data.get("config", {})
                    except:
                        # If parsing fails, use the raw value
                        environment_type = db_task.get("environment")
                
                formatted_tasks.append({
                    "id": db_task.get("id"),
                    "title": db_task.get("name"),
                    "description": db_task.get("description"),
                    "instructions": db_task.get("instructions"),
                    "webArenaEnvironment": environment_type,
                    "environmentConfig": environment_config,
                    "createdAt": db_task.get("created_at"),
                    "updatedAt": db_task.get("updated_at")
                })
            
            return formatted_tasks
        except Exception as e:
            logger.error(f"Error getting tasks: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving tasks: {str(e)}"
            )

    def get_task(self, task_id: uuid.UUID) -> Dict[str, Any]:
        """
        Get a task by ID
        """
        try:
            result = self._db.table("tasks").select("*").eq("id", str(task_id)).execute()
            
            if not result.data or len(result.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Task with ID {task_id} not found"
                )
            
            # Convert the database record to the expected format
            db_task = result.data[0]
            
            # Try to parse environment as JSON if it's a string
            environment_config = {}
            environment_type = "default"
            if db_task.get("environment"):
                try:
                    import json
                    env_data = json.loads(db_task.get("environment"))
                    if isinstance(env_data, dict):
                        environment_type = env_data.get("type", "default")
                        environment_config = env_data.get("config", {})
                except:
                    # If parsing fails, use the raw value
                    environment_type = db_task.get("environment")
            
            return {
                "id": db_task.get("id"),
                "title": db_task.get("name"),
                "description": db_task.get("description"),
                "instructions": db_task.get("instructions"),
                "webArenaEnvironment": environment_type,
                "environmentConfig": environment_config,
                "createdAt": db_task.get("created_at"),
                "updatedAt": db_task.get("updated_at")
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error getting task {task_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error retrieving task: {str(e)}"
            )

    def create_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new task
        """
        try:
            # Map the task data to the actual database schema
            new_task = {
                "id": str(uuid.uuid4()),
                "name": task_data.get("title", "Untitled Task"),
                "description": task_data.get("description", ""),
                "instructions": task_data.get("instructions", ""),
                "environment": task_data.get("webArenaEnvironment", "default"),
                # Let the database set created_at and updated_at
            }
            
            # Store the full task data as JSON in the environment field if needed
            if "environmentConfig" in task_data:
                import json
                new_task["environment"] = json.dumps({
                    "type": task_data.get("webArenaEnvironment", "default"),
                    "config": task_data.get("environmentConfig", {})
                })
                
            result = self._db.table("tasks").insert(new_task).execute()
            
            if not result.data or len(result.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create task"
                )
            
            # Convert the database record back to the expected format
            db_task = result.data[0]
            
            # Parse environment as JSON if it's a string
            environment_config = {}
            environment_type = "default"
            if db_task.get("environment"):
                try:
                    import json
                    env_data = json.loads(db_task.get("environment"))
                    if isinstance(env_data, dict):
                        environment_type = env_data.get("type", "default")
                        environment_config = env_data.get("config", {})
                except:
                    # If parsing fails, use the raw value
                    environment_type = db_task.get("environment")
            
            # Ensure all required fields are present
            return {
                "id": db_task.get("id"),
                "title": db_task.get("name"),
                "description": db_task.get("description"),
                "difficulty": task_data.get("difficulty", "MEDIUM"),  # Add difficulty
                "webArenaEnvironment": environment_type,
                "environmentConfig": environment_config,  # Add environmentConfig
                "createdAt": db_task.get("created_at"),
                "updatedAt": db_task.get("updated_at"),
                "createdBy": task_data.get("createdBy")  # Add createdBy
            }
        except Exception as e:
            logger.error(f"Error creating task: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating task: {str(e)}"
            )

    def update_task(self, task_id: uuid.UUID, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update an existing task
        """
        try:
            # Check if task exists
            existing = self._db.table("tasks").select("*").eq("id", str(task_id)).execute()
            
            if not existing.data or len(existing.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Task with ID {task_id} not found"
                )
            
            # Update the task
            result = self._db.table("tasks").update(task_data).eq("id", str(task_id)).execute()
            
            if not result.data or len(result.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update task"
                )
                
            return result.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating task {task_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating task: {str(e)}"
            )

    def delete_task(self, task_id: uuid.UUID) -> Dict[str, Any]:
        """
        Delete a task by ID
        """
        try:
            # Check if task exists
            existing = self._db.table("tasks").select("*").eq("id", str(task_id)).execute()
            
            if not existing.data or len(existing.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Task with ID {task_id} not found"
                )
            
            # Delete the task
            result = self._db.table("tasks").delete().eq("id", str(task_id)).execute()
            
            return {"message": f"Task with ID {task_id} deleted successfully"}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting task {task_id}: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting task: {str(e)}"
            )
