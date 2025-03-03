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
