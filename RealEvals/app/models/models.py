from sqlalchemy import Column, String, Enum, Integer, DateTime, Boolean, Float, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID as pgUUID
from sqlalchemy.types import TypeDecorator
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from .enums import UserRole, TaskDifficulty, SubmissionStatus, EvaluationStatus
from ..db.database import Base

# Custom UUID type to make it compatible with both SQLite and PostgreSQL
class UUID(TypeDecorator):
    impl = String
    
    def __init__(self, as_uuid=False, *args, **kwargs):
        # Ignore the as_uuid parameter
        super().__init__(*args, **kwargs)
    
    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            return str(value)
            
    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(value)
            return value

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    firstName = Column(String)
    lastName = Column(String, nullable=True)
    password = Column(String)
    role = Column(Enum(UserRole))
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
    lastLoginAt = Column(DateTime(timezone=True), nullable=True)
    isActive = Column(Boolean, default=True)
    isEmailVerified = Column(Boolean, default=False)
    loginCount = Column(Integer, default=0)
    
    agents = relationship("Agent", back_populates="user")
    created_tasks = relationship("Task", back_populates="creator")
    submissions = relationship("Submission", back_populates="user")

class Agent(Base):
    __tablename__ = "agents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String)
    description = Column(String, nullable=True)
    configurationJson = Column(JSON)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
    isActive = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="agents")
    submissions = relationship("Submission", back_populates="agent")
    leaderboard_entries = relationship("Leaderboard", back_populates="agent")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String)
    description = Column(String)
    difficulty = Column(Enum(TaskDifficulty))
    webArenaEnvironment = Column(String)
    environmentConfig = Column(JSON)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
    createdBy = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    creator = relationship("User", back_populates="created_tasks")
    metrics = relationship("TaskMetrics", back_populates="task")
    submissions = relationship("Submission", back_populates="task")
    leaderboard_entries = relationship("Leaderboard", back_populates="task")

class TaskMetrics(Base):
    __tablename__ = "task_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    taskId = Column(UUID(as_uuid=True), ForeignKey("tasks.id"))
    maxTimeAllowed = Column(Integer)
    minAccuracy = Column(Float)
    expectedSteps = Column(Integer)
    timeWeight = Column(Float)
    accuracyWeight = Column(Float)
    environmentParameters = Column(JSON)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
    
    task = relationship("Task", back_populates="metrics")

class Submission(Base):
    __tablename__ = "submissions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    userId = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    agentId = Column(UUID(as_uuid=True), ForeignKey("agents.id"))
    taskId = Column(UUID(as_uuid=True), ForeignKey("tasks.id"))
    status = Column(Enum(SubmissionStatus))
    submittedAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="submissions")
    agent = relationship("Agent", back_populates="submissions")
    task = relationship("Task", back_populates="submissions")
    evaluation = relationship("EvaluationResult", back_populates="submission", uselist=False)
    leaderboard_entry = relationship("Leaderboard", back_populates="submission", uselist=False)

class EvaluationResult(Base):
    __tablename__ = "evaluation_results"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submissionId = Column(UUID(as_uuid=True), ForeignKey("submissions.id"))
    score = Column(Float)
    timeTaken = Column(Float)
    accuracy = Column(Float)
    completedAt = Column(DateTime(timezone=True))
    resultDetails = Column(JSON)
    status = Column(Enum(EvaluationStatus))
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    
    submission = relationship("Submission", back_populates="evaluation")

class Leaderboard(Base):
    __tablename__ = "leaderboard"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    taskId = Column(UUID(as_uuid=True), ForeignKey("tasks.id"))
    agentId = Column(UUID(as_uuid=True), ForeignKey("agents.id"))
    submissionId = Column(UUID(as_uuid=True), ForeignKey("submissions.id"))
    score = Column(Float)
    rank = Column(Integer)
    timeTaken = Column(Float)
    accuracy = Column(Float)
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
    
    task = relationship("Task", back_populates="leaderboard_entries")
    agent = relationship("Agent", back_populates="leaderboard_entries")
    submission = relationship("Submission", back_populates="leaderboard_entry")