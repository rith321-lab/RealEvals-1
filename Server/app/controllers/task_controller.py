from fastapi import HTTPException
from ..services.task_service import TaskService
from ..schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from ..models.enums import TaskDifficulty
import uuid
import json

class TaskController:
    def __init__(self):
        self.task_service = TaskService()

    async def create_task(self, task_data: TaskCreate, creator_id: uuid.UUID) -> TaskResponse:
        # Convert task data to match the database schema
        task_dict = {
            "id": str(uuid.uuid4()),
            "name": task_data.title,
            "description": task_data.description,
            "environment": task_data.webArenaEnvironment,
            # Store environment config as a string if needed
            "instructions": json.dumps(task_data.environmentConfig) if task_data.environmentConfig else None
        }
        
        # Create the task
        db_task = self.task_service.create_task(task_dict)
        
        # Convert the database task to the TaskResponse format
        response_task = {
            "id": uuid.UUID(db_task["id"]),
            "title": db_task["name"],
            "description": db_task["description"],
            "difficulty": TaskDifficulty.MEDIUM,  # Default to MEDIUM if not available
            "webArenaEnvironment": db_task["environment"],
            "environmentConfig": json.loads(db_task["instructions"]) if db_task.get("instructions") else {},
            "createdAt": db_task["created_at"],
            "updatedAt": db_task.get("updated_at"),
            "createdBy": creator_id
        }
        
        return TaskResponse(**response_task)

    async def get_tasks(self, skip: int = 0, limit: int = 10) -> TaskListResponse:
        db_tasks = self.task_service.get_tasks(skip, limit)
        total = len(db_tasks)
        
        # Convert database tasks to TaskResponse format
        formatted_tasks = []
        for db_task in db_tasks:
            try:
                # Map database fields to schema fields
                task_dict = {
                    "id": uuid.UUID(db_task["id"]),
                    "title": db_task["name"],
                    "description": db_task["description"],
                    "difficulty": TaskDifficulty.MEDIUM,  # Default to MEDIUM if not available
                    "webArenaEnvironment": db_task["environment"],
                    "environmentConfig": json.loads(db_task["instructions"]) if db_task.get("instructions") and db_task["instructions"] not in [None, ""] else {},
                    "createdAt": db_task["created_at"],
                    "updatedAt": db_task.get("updated_at"),
                    "createdBy": uuid.UUID(db_task["id"])  # Placeholder, should be the actual creator ID
                }
                formatted_tasks.append(TaskResponse(**task_dict))
            except Exception as e:
                print(f"Error formatting task {db_task.get('id')}: {str(e)}")
                continue
        
        return TaskListResponse(
            items=formatted_tasks,
            total=total,
            page=skip // limit + 1 if limit > 0 else 1,
            size=limit
        )

    async def get_task(self, task_id: str) -> TaskResponse:
        try:
            task_uuid = uuid.UUID(task_id)
            task = self.task_service.get_task(task_uuid)
            return TaskResponse(**task)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid task ID format")

    async def update_task(self, task_id: str, task_data: TaskUpdate) -> TaskResponse:
        try:
            task_uuid = uuid.UUID(task_id)
            task = self.task_service.update_task(task_uuid, task_data.dict(exclude_unset=True))
            return TaskResponse(**task)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid task ID format")

    async def delete_task(self, task_id: str) -> None:
        try:
            task_uuid = uuid.UUID(task_id)
            self.task_service.delete_task(task_uuid)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid task ID format")
