from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.models import Task
from ..models.enums import TaskDifficulty
import uuid

class TaskService:
    def __init__(self, db: Session):
        self._db = db
    
    def create_task(self, task_data: dict, creator_id: uuid.UUID) -> Task:
        try:
            task = Task(
                **task_data,
                createdBy=creator_id  # UUID object from model
            )
            self._db.add(task)
            self._db.commit()
            self._db.refresh(task)
            return task
        except Exception as e:
            self._db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    def get_tasks(self, skip: int = 0, limit: int = 10) -> List[Task]:
        return self._db.query(Task).offset(skip).limit(limit).all()

    def get_task_by_id(self, task_id: uuid.UUID) -> Task:
        task = self._db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        return task

    def update_task(self, task_id: uuid.UUID, task_data: dict) -> Task:
        task = self.get_task_by_id(task_id)
        for key, value in task_data.items():
            if value is not None:
                setattr(task, key, value)
        self._db.commit()
        self._db.refresh(task)
        return task
    
    def delete_task(self, task_id: uuid.UUID) -> None:
        task = self.get_task_by_id(task_id)
        self._db.delete(task)
        self._db.commit()