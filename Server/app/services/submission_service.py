from fastapi import HTTPException
from ..models.enums import SubmissionStatus, EvaluationStatus
import random
import uuid
from uuid import UUID
from ..schemas.submission_schema import LeaderboardResponse
from datetime import datetime
import time
from ..db.database import get_db
from loguru import logger

class SubmissionService:
    def __init__(self):
        self._db = get_db()

    def create_submission(self, user_id: uuid.UUID, agent_id: uuid.UUID, task_id: uuid.UUID) -> dict:
        try:
            submission_data = {
                "id": str(uuid.uuid4()),
                "userId": str(user_id),
                "agentId": str(agent_id),
                "taskId": str(task_id),
                "status": SubmissionStatus.QUEUED,
                "submittedAt": datetime.utcnow().isoformat()
            }
            
            response = self._db.table("submissions").insert(submission_data).execute()
            
            if response.data:
                return response.data[0]
            raise HTTPException(status_code=500, detail="Failed to create submission")
        except Exception as e:
            logger.error(f"Error creating submission: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def process_submission(self, submission_id: uuid.UUID, options=None):
        try:
            # Get submission
            submission_response = self._db.table("submissions").select("*").eq("id", str(submission_id)).execute()
            
            if not submission_response.data or len(submission_response.data) == 0:
                raise HTTPException(status_code=404, detail="Submission not found")
            
            submission = submission_response.data[0]
            
            # Get task
            task_response = self._db.table("tasks").select("*").eq("id", submission["taskId"]).execute()
            
            if not task_response.data or len(task_response.data) == 0:
                raise HTTPException(status_code=404, detail="Task not found")
            
            task = task_response.data[0]
            
            # Update submission status to PROCESSING
            self._db.table("submissions").update({"status": SubmissionStatus.PROCESSING}).eq("id", str(submission_id)).execute()
            
            # Extract configuration from task
            web_arena_config = task.get("environmentConfig", {})
            
            # Simulate processing time
            difficulty_multiplier = web_arena_config.get("difficultyMultiplier", 1.0)
            time_factor = web_arena_config.get("timeFactor", 1.0)
            processing_time = random.uniform(1, 3) * difficulty_multiplier * time_factor
            time.sleep(processing_time)
            
            # Generate evaluation metrics
            accuracy_boost = web_arena_config.get("accuracyBoost", 1.0)
            base_score = random.uniform(60, 90)
            score = min(100, base_score * accuracy_boost)            
            time_taken = random.uniform(1, 8) * time_factor            
            accuracy = random.uniform(0.7, 0.95) * accuracy_boost
            max_steps = web_arena_config.get("maxSteps", 15)
            
            # Create evaluation result
            evaluation_data = {
                "id": str(uuid.uuid4()),
                "submissionId": str(submission_id),
                "score": score,
                "timeTaken": time_taken,
                "accuracy": accuracy,
                "completedAt": datetime.utcnow().isoformat(),
                "status": EvaluationStatus.SUCCESS,
                "resultDetails": self._generate_result_details(max_steps, web_arena_config)
            }
            
            evaluation_response = self._db.table("evaluation_results").insert(evaluation_data).execute()
            
            # Create leaderboard entry
            leaderboard_data = {
                "id": str(uuid.uuid4()),
                "taskId": submission["taskId"],
                "agentId": submission["agentId"],
                "submissionId": str(submission_id),
                "score": score,
                "timeTaken": time_taken,
                "accuracy": accuracy,
                "rank": 0
            }
            
            leaderboard_response = self._db.table("leaderboard").insert(leaderboard_data).execute()
            
            # Update ranks
            self._update_ranks(submission["taskId"])
            
            # Update submission status to COMPLETED
            self._db.table("submissions").update({"status": SubmissionStatus.COMPLETED}).eq("id", str(submission_id)).execute()
            
            # Return full submission data
            return self._get_full_submission(submission_id)
        except Exception as e:
            logger.error(f"Error processing submission: {str(e)}")
            # Update submission status to FAILED
            self._db.table("submissions").update({"status": SubmissionStatus.FAILED}).eq("id", str(submission_id)).execute()
            raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    def _generate_result_details(self, max_steps=15, web_arena_config=None):
        if web_arena_config is None:
            web_arena_config = {}
            
        web_arena_environment = web_arena_config.get("webArenaEnvironment", "Simulation")
        
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
        
    def get_user_submissions(self, user_id: uuid.UUID, skip: int = 0, limit: int = 20) -> dict:
        try:
            # Get all submissions for the user
            response = self._db.table("submissions").select("*").eq("userId", str(user_id)).execute()
            
            if not response.data:
                return {"items": [], "total": 0}
            
            # Sort by submittedAt in descending order (in memory)
            sorted_submissions = sorted(
                response.data, 
                key=lambda x: x.get("submittedAt", ""), 
                reverse=True
            )
            
            # Apply pagination in memory
            paginated_submissions = sorted_submissions[skip:skip + limit]
            
            # Get evaluation results and leaderboard entries for each submission
            for submission in paginated_submissions:
                # Get evaluation result
                eval_response = self._db.table("evaluation_results").select("*").eq("submissionId", submission["id"]).execute()
                submission["evaluation"] = eval_response.data[0] if eval_response.data else None
                
                # Get leaderboard entry
                leaderboard_response = self._db.table("leaderboard").select("*").eq("submissionId", submission["id"]).execute()
                submission["leaderboard_entry"] = leaderboard_response.data[0] if leaderboard_response.data else None
            
            return {"items": paginated_submissions, "total": len(response.data)}
        except Exception as e:
            logger.error(f"Error getting user submissions: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def _get_full_submission(self, submission_id: uuid.UUID):
        try:
            # Get submission
            submission_response = self._db.table("submissions").select("*").eq("id", str(submission_id)).execute()
            
            if not submission_response.data or len(submission_response.data) == 0:
                raise HTTPException(status_code=404, detail="Submission not found")
            
            submission = submission_response.data[0]
            
            # Get evaluation result
            eval_response = self._db.table("evaluation_results").select("*").eq("submissionId", str(submission_id)).execute()
            submission["evaluation"] = eval_response.data[0] if eval_response.data else None
            
            # Get leaderboard entry
            leaderboard_response = self._db.table("leaderboard").select("*").eq("submissionId", str(submission_id)).execute()
            submission["leaderboard_entry"] = leaderboard_response.data[0] if leaderboard_response.data else None
            
            return submission
        except Exception as e:
            logger.error(f"Error getting full submission: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def _update_ranks(self, task_id: uuid.UUID):
        try:
            # Get all leaderboard entries for the task
            response = self._db.table("leaderboard").select("*").eq("taskId", str(task_id)).execute()
            
            if not response.data:
                return
            
            # Sort by score in descending order
            sorted_entries = sorted(response.data, key=lambda x: x.get("score", 0), reverse=True)
            
            # Update ranks
            for index, entry in enumerate(sorted_entries, 1):
                self._db.table("leaderboard").update({"rank": index}).eq("id", entry["id"]).execute()
                
        except Exception as e:
            logger.error(f"Error updating ranks: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    def get_leaderboard(self, task_id: UUID) -> list:
        try:
            # Get all leaderboard entries for the task
            leaderboard_response = self._db.table("leaderboard").select("*").eq("taskId", str(task_id)).execute()
            
            if not leaderboard_response.data:
                return []
            
            leaderboard_entries = leaderboard_response.data
            
            # Get agent names
            leaderboard_response_with_names = []
            for entry in leaderboard_entries:
                # Get agent name
                agent_response = self._db.table("agents").select("name").eq("id", entry["agentId"]).execute()
                agent_name = agent_response.data[0]["name"] if agent_response.data else "Unknown Agent"
                
                leaderboard_response_with_names.append(
                    LeaderboardResponse(
                        rank=entry["rank"],
                        score=entry["score"],
                        timeTaken=entry["timeTaken"],
                        accuracy=entry["accuracy"],
                        submissionId=entry["submissionId"],
                        agentId=entry["agentId"],
                        taskId=entry["taskId"],
                        agentName=agent_name
                    )
                )
            
            # Sort by rank
            sorted_entries = sorted(leaderboard_response_with_names, key=lambda x: x.rank)
            
            return sorted_entries
        except Exception as e:
            logger.error(f"Error getting leaderboard: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def get_user_submissions_by_task(self, user_id: uuid.UUID, task_id: uuid.UUID, skip: int = 0, limit: int = 20):
        try:
            # Get all submissions for the user and task
            response = self._db.table("submissions").select("*").eq("userId", str(user_id)).eq("taskId", str(task_id)).execute()
            
            if not response.data:
                return {"items": [], "total": 0}
            
            # Sort by submittedAt in descending order (in memory)
            sorted_submissions = sorted(
                response.data, 
                key=lambda x: x.get("submittedAt", ""), 
                reverse=True
            )
            
            total = len(sorted_submissions)
            
            # Apply pagination in memory
            paginated_submissions = sorted_submissions[skip:skip + limit]
            
            # Get evaluation results and leaderboard entries for each submission
            for submission in paginated_submissions:
                # Get evaluation result
                eval_response = self._db.table("evaluation_results").select("*").eq("submissionId", submission["id"]).execute()
                submission["evaluation"] = eval_response.data[0] if eval_response.data else None
                
                # Get leaderboard entry
                leaderboard_response = self._db.table("leaderboard").select("*").eq("submissionId", submission["id"]).execute()
                submission["leaderboard_entry"] = leaderboard_response.data[0] if leaderboard_response.data else None
            
            return {"items": paginated_submissions, "total": total}
        except Exception as e:
            logger.error(f"Error getting user submissions by task: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
