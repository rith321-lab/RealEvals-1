from fastapi import HTTPException
from ..services.task_service import TaskService
from ..schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
import uuid

class TaskController:
    def __init__(self):
        self.task_service = TaskService()

    async def create_task(self, task_data: TaskCreate, creator_id: uuid.UUID) -> TaskResponse:
        task = self.task_service.create_task(task_data.dict(), creator_id)
        return TaskResponse(**task)

    async def get_tasks(self, skip: int = 0, limit: int = 10) -> TaskListResponse:
        tasks = self.task_service.get_tasks(skip, limit)
        total = len(tasks)
        return TaskListResponse(
            items=[TaskResponse(**task) for task in tasks],
            total=total,
            page=skip // limit + 1 if limit > 0 else 1,
            size=limit
        )

    async def get_task(self, task_id: str) -> TaskResponse:
        try:
            task_uuid = uuid.UUID(task_id)
            task = self.task_service.get_task_by_id(task_uuid)
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