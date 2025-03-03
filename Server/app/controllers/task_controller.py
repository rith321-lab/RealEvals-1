from fastapi import HTTPException
from ..services.task_service import TaskService
from ..schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
import uuid

class TaskController:
    def __init__(self):
        self.task_service = TaskService()

    async def create_task(self, task_data: TaskCreate, creator_id: uuid.UUID) -> TaskResponse:
        task_dict = task_data.dict() if hasattr(task_data, 'dict') else task_data.model_dump()
        task_dict["createdBy"] = str(creator_id)
        task = self.task_service.create_task(task_dict)
        return TaskResponse(**task)

    async def get_tasks(self, skip: int = 0, limit: int = 10) -> TaskListResponse:
        tasks = self.task_service.get_tasks(skip, limit)
        total = len(tasks)
        
        # Ensure all required fields are present in each task
        formatted_tasks = []
        for task in tasks:
            # Add default values for required fields if they don't exist
            if "title" not in task:
                task["title"] = "Untitled Task"
            if "difficulty" not in task:
                task["difficulty"] = "MEDIUM"
            if "webArenaEnvironment" not in task:
                task["webArenaEnvironment"] = "default"
            if "environmentConfig" not in task:
                task["environmentConfig"] = {}
            if "createdAt" not in task or task["createdAt"] is None:
                from datetime import datetime
                task["createdAt"] = datetime.now()
            if "createdBy" not in task or task["createdBy"] is None:
                import uuid
                task["createdBy"] = uuid.uuid4()
            
            try:
                formatted_tasks.append(TaskResponse(**task))
            except Exception as e:
                print(f"Error formatting task: {e}")
                # Skip this task if it can't be formatted
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
