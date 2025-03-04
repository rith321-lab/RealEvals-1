from fastapi import APIRouter, Depends, Query
from ...db.database import get_db
from ...controllers.task_controller import TaskController
from ...schemas.task_schema import TaskCreate, TaskUpdate, TaskResponse, TaskListResponse
from ...core.security import get_current_user, get_current_admin

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("", response_model=TaskResponse)
async def create_task(
    task: TaskCreate,
    current_user = Depends(get_current_admin)
):
    controller = TaskController()
    return await controller.create_task(task, current_user.id)

@router.get("", response_model=TaskListResponse)
async def get_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
):
    controller = TaskController()
    return await controller.get_tasks(skip, limit)

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
):
    controller = TaskController()
    return await controller.get_task(task_id)

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    task: TaskUpdate,
    current_user = Depends(get_current_admin)
):
    controller = TaskController()
    return await controller.update_task(task_id, task)

@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user = Depends(get_current_admin)
):
    controller = TaskController()
    await controller.delete_task(task_id)
    return {"message": "Task deleted successfully"}