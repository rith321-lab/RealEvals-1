import uuid
from typing import List, Optional, Dict, Any
from fastapi import HTTPException, status
from loguru import logger
from ..db.database import get_db

class TaskService:
    def __init__(self):
        self._db = get_db()

    def get_tasks(self) -> List[Dict[str, Any]]:
        """
        Get all tasks from the database
        """
        try:
            result = self._db.table("tasks").select("*").execute()
            return result.data
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
                
            return result.data[0]
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
            # Generate a UUID if not provided
            if "id" not in task_data:
                task_data["id"] = str(uuid.uuid4())
                
            result = self._db.table("tasks").insert(task_data).execute()
            
            if not result.data or len(result.data) == 0:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create task"
                )
                
            return result.data[0]
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