from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from ..models.models import Submission, EvaluationResult, Leaderboard, Agent, Task
from ..models.enums import SubmissionStatus, EvaluationStatus
import random
import uuid
from uuid import UUID
from ..schemas.submission_schema import LeaderboardResponse
from datetime import datetime
import time

class SubmissionService:
    def __init__(self, db: Session):
        self._db = db

    def create_submission(self, user_id: uuid.UUID, agent_id: uuid.UUID, task_id: uuid.UUID) -> Submission:
        try:
            submission = Submission(userId=user_id, agentId=agent_id, taskId=task_id, status=SubmissionStatus.QUEUED, submittedAt=datetime.utcnow())
            self._db.add(submission)
            self._db.commit()
            self._db.refresh(submission)
            return submission
        except Exception as e:
            self._db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    def process_submission(self, submission_id: uuid.UUID, taskId: uuid.UUID):
        try:
            submission = self._db.query(Submission).filter(Submission.id == submission_id).with_for_update().first()
            task = self._db.query(Task).filter(Task.id == taskId).first()
            
            if not submission:
                raise HTTPException(status_code=404, detail="Submission not found")
            
            if not task:
                raise HTTPException(status_code=404, detail="Task not found")
                
            web_arena_config = task.environmentConfig
            submission.status = SubmissionStatus.PROCESSING
            self._db.commit()
            difficulty_multiplier = web_arena_config.get("difficultyMultiplier", 1.0)
            time_factor = web_arena_config.get("timeFactor", 1.0)
            processing_time = random.uniform(1, 3) * difficulty_multiplier * time_factor
            time.sleep(processing_time)
            accuracy_boost = web_arena_config.get("accuracyBoost", 1.0)
            base_score = random.uniform(60, 90)
            score = min(100, base_score * accuracy_boost)            
            time_taken = random.uniform(1, 8) * time_factor            
            accuracy = random.uniform(0.7, 0.95) * accuracy_boost
            max_steps = web_arena_config.get("maxSteps", 15)
            evaluation = EvaluationResult(
                submissionId=submission.id,
                score=score,
                timeTaken=time_taken,
                accuracy=accuracy,
                completedAt=datetime.utcnow(),
                status=EvaluationStatus.SUCCESS,
                resultDetails=self._generate_result_details(max_steps, web_arena_config)
            )
            self._db.add(evaluation)
            
            leaderboard = Leaderboard(
                taskId=submission.taskId,
                agentId=submission.agentId,
                submissionId=submission.id,
                score=score,
                timeTaken=time_taken,
                accuracy=accuracy,
                rank=0
            )
            self._db.add(leaderboard)
            self._db.commit()
            
            self._update_ranks(submission.taskId)
            submission.status = SubmissionStatus.COMPLETED
            self._db.commit()
            
            return self._get_full_submission(submission.id)
        except Exception as e:
            self._db.rollback()
            submission.status = SubmissionStatus.FAILED
            self._db.commit()
            raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    def _generate_result_details(self, max_steps=15, web_arena_config=None):
        web_arena_environment = web_arena_config.get("webArenaEnvironment", "Simulation") if web_arena_config else "Simulation"
        
        result = {
            "task_completion": random.uniform(0.8, 1.0),
            "navigation_efficiency": random.uniform(0.7, 1.0),
            "error_rate": random.uniform(0, 0.2),
            "steps_taken": random.randint(max(5, int(max_steps * 0.5)), max_steps),
            "web_interactions": {
                "clicks": random.randint(3, 10),
                "form_fills": random.randint(1, 5),
                "navigation_steps": random.randint(2, 8)
            }
        }
        
        if web_arena_environment == "Shopping":
            result["environment_metrics"] = {
                "product_comparison_score": random.uniform(0.7, 1.0),
                "checkout_efficiency": random.uniform(0.6, 1.0),
                "optimal_choice_accuracy": random.uniform(0.8, 1.0),
                "budget_adherence": True if web_arena_config.get("budget", 0) > 0 else False
            }
        elif web_arena_environment == "Booking":
            result["environment_metrics"] = {
                "criteria_satisfaction": random.uniform(0.8, 1.0),
                "filter_usage_efficiency": random.uniform(0.7, 0.95),
                "value_optimization_score": random.uniform(0.6, 1.0),
                "constraints_met": random.randint(2, 4) if web_arena_config.get("filterRequirements") else 2
            }
        elif web_arena_environment == "Banking":
            result["environment_metrics"] = {
                "security_navigation_score": random.uniform(0.7, 1.0),
                "transaction_accuracy": random.uniform(0.9, 1.0),
                "authentication_success": True,
                "security_alerts_triggered": random.randint(0, 1) if web_arena_config.get("securityLevel") == "high" else 0
            }
        elif web_arena_environment == "Simulation":
            if web_arena_config.get("platforms"):
                result["environment_metrics"] = {
                    "content_quality_score": random.uniform(0.7, 0.95),
                    "platform_adherence": random.uniform(0.8, 1.0),
                    "scheduling_optimization": random.uniform(0.6, 0.9),
                    "platforms_utilized": len(web_arena_config.get("platforms", [])),
                    "content_types_used": len(web_arena_config.get("contentTypes", []))
                }
            else:
                result["environment_metrics"] = {
                    "information_accuracy": random.uniform(0.8, 0.95),
                    "source_diversity": random.uniform(0.7, 1.0),
                    "summary_coherence": random.uniform(0.75, 0.95),
                    "sources_utilized": random.randint(2, web_arena_config.get("informationSources", 4))
                }
        return result
        
    def get_user_submissions(self, user_id: uuid.UUID, skip: int = 0, limit: int = 20) -> dict[str, any]:
        try:
            total = self._db.query(Submission).filter(Submission.userId == user_id).count()
            submissions = self._db.query(Submission).options(joinedload(Submission.evaluation), joinedload(Submission.leaderboard_entry)).filter(Submission.userId == user_id).order_by(Submission.submittedAt.desc()).offset(skip).limit(limit).all()
            return {"items": submissions, "total": total}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def _get_full_submission(self, submission_id: uuid.UUID):
        return (
            self._db.query(Submission)
            .options(joinedload(Submission.evaluation), joinedload(Submission.leaderboard_entry))
            .filter(Submission.id == submission_id)
            .first()
        )

    def _update_ranks(self, task_id: uuid.UUID):
        entries = (
            self._db.query(Leaderboard)
            .filter(Leaderboard.taskId == task_id)
            .order_by(Leaderboard.score.desc())
            .all()
        )
        for index, entry in enumerate(entries, 1):
            entry.rank = index
        self._db.commit()

    def get_leaderboard(self, task_id: UUID) -> list[LeaderboardResponse]:
        try:
            leaderboard_entries = self._db.query(Leaderboard, Agent.name)\
                .join(Agent, Leaderboard.agentId == Agent.id)\
                .filter(Leaderboard.taskId == task_id)\
                .order_by(Leaderboard.rank.asc())\
                .all()
            leaderboard_response = [
                LeaderboardResponse(
                    rank=entry.Leaderboard.rank,
                    score=entry.Leaderboard.score,
                    timeTaken=entry.Leaderboard.timeTaken,
                    accuracy=entry.Leaderboard.accuracy,
                    submissionId=entry.Leaderboard.submissionId,
                    agentId=entry.Leaderboard.agentId,
                    taskId=entry.Leaderboard.taskId,
                    agentName=entry.name  
                )
                for entry in leaderboard_entries
            ]

            return leaderboard_response
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_user_submissions_by_task(self, user_id: uuid.UUID, task_id: uuid.UUID, skip: int = 0, limit: int = 20):
        try:
            query = self._db.query(Submission).filter(Submission.userId == user_id, Submission.taskId == task_id)
            total = query.count()
            submission_ids = query.order_by(Submission.submittedAt.desc()).offset(skip).limit(limit).with_entities(Submission.id).all()
            submissions = self._db.query(Submission).filter(Submission.id.in_([sub.id for sub in submission_ids])).options(
                joinedload(Submission.evaluation), joinedload(Submission.leaderboard_entry)
            ).all()
            return {"items": submissions, "total": total}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))