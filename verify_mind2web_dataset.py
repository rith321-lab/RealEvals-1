import json
import logging
import sys
from mind2web_eval import load_tasks

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

def verify_dataset():
    """Verify that the Mind2Web dataset contains 1000 tasks"""
    try:
        with open("data/mind2web.jsonl", 'r') as f:
            direct_tasks = json.load(f)
            logger.info(f"Direct JSON loading: Found {len(direct_tasks)} tasks")
        
        tasks = load_tasks("data/mind2web.jsonl")
        logger.info(f"Using load_tasks function: Found {len(tasks)} tasks")
        
        if tasks:
            sample_task = tasks[0]
            logger.info(f"Sample task structure: {json.dumps(sample_task, indent=2)}")
            
            required_fields = ["task_id", "website", "instruction", "url"]
            missing_fields = [field for field in required_fields if field not in sample_task]
            
            if missing_fields:
                logger.error(f"Sample task is missing required fields: {missing_fields}")
            else:
                logger.info("Sample task contains all required fields")
        
        valid_tasks = 0
        for i, task in enumerate(tasks):
            if all(field in task for field in required_fields):
                valid_tasks += 1
        
        logger.info(f"Valid tasks with all required fields: {valid_tasks}/{len(tasks)}")
        
        return len(tasks) == 1000 and valid_tasks == 1000
    
    except Exception as e:
        logger.error(f"Error verifying dataset: {str(e)}")
        return False

if __name__ == "__main__":
    success = verify_dataset()
    
    if success:
        logger.info("✅ Mind2Web dataset verification successful: 1000 valid tasks found")
        sys.exit(0)
    else:
        logger.error("❌ Mind2Web dataset verification failed")
        sys.exit(1)
