import json
import logging
import time
import os
import argparse
import random
import pandas as pd
from datetime import datetime
from anthropic_operator_agent import AnthropicOperatorAgent

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(os.path.join("results", "logs", "mind2web_run.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_tasks(file_path):
    """Load tasks from a JSON file"""
    try:
        if file_path.endswith('.jsonl'):
            tasks = []
            with open(file_path, 'r') as f:
                for line in f:
                    try:
                        task = json.loads(line.strip())
                        tasks.append(task)
                    except json.JSONDecodeError as e:
                        logger.error(f"Error parsing JSONL line: {str(e)}")
        else:
            with open(file_path, 'r') as f:
                tasks = json.load(f)
        
        logger.info(f"Loaded {len(tasks)} tasks from {file_path}")
        return tasks
    except Exception as e:
        logger.error(f"Error loading tasks: {str(e)}")
        return []

def save_results(results, timestamp):
    """Save results to JSON and CSV files"""
    try:
        json_path = os.path.join("results", f"mind2web_detailed_{timestamp}.json")
        with open(json_path, 'w') as f:
            json.dump(results, f, indent=2)
        logger.info(f"Saved detailed results to {json_path}")
        
        csv_path = os.path.join("results", f"mind2web_summary_{timestamp}.csv")
        summary_data = []
        
        for result in results:
            summary_data.append({
                "task_id": result["task_id"],
                "success": result["success"],
                "time_taken": result["time_taken"],
                "error": result.get("error", "")
            })
        
        df = pd.DataFrame(summary_data)
        df.to_csv(csv_path, index=False)
        logger.info(f"Saved summary results to {csv_path}")
        
        intermediate_json_path = os.path.join("results", f"mind2web_intermediate_detailed_{timestamp}.json")
        with open(intermediate_json_path, 'w') as f:
            json.dump(results, f, indent=2)
        
        intermediate_csv_path = os.path.join("results", f"mind2web_intermediate_summary_{timestamp}.csv")
        df.to_csv(intermediate_csv_path, index=False)
        
    except Exception as e:
        logger.error(f"Error saving results: {str(e)}")

def execute_task(agent, task, max_retries=1):
    """Execute a task using the operator agent"""
    task_id = task.get("task_id", task.get("id", "unknown"))
    
    start_time = time.time()
    success = False
    error_message = ""
    
    try:
        for attempt in range(max_retries + 1):
            try:
                logger.info(f"Executing task {task_id}, attempt {attempt + 1}/{max_retries + 1}")
                
                result = agent.execute_task(task=task)
                
                success = result.get("success", False)
                if success:
                    logger.info(f"Task {task_id} completed successfully")
                    break
                else:
                    error_message = result.get("error", "Unknown error")
                    logger.warning(f"Task {task_id} failed: {error_message}")
                    
                    if attempt < max_retries:
                        logger.info(f"Retrying task {task_id}...")
                        time.sleep(2)  # Wait before retrying
            
            except Exception as e:
                error_message = str(e)
                logger.error(f"Error executing task {task_id}: {error_message}")
                
                if attempt < max_retries:
                    logger.info(f"Retry {attempt + 1}/{max_retries} for task {task_id}")
                    time.sleep(2)  # Wait before retrying
    
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error setting up task {task_id}: {error_message}")
    
    end_time = time.time()
    time_taken = end_time - start_time
    
    return {
        "task_id": task_id,
        "success": success,
        "time_taken": time_taken,
        "error": error_message
    }

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Evaluate Mind2Web tasks")
    parser.add_argument("--headless", action="store_true", help="Run in headless mode")
    parser.add_argument("--max-retries", type=int, default=1, help="Maximum number of retries for failed tasks")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    os.makedirs("results", exist_ok=True)
    os.makedirs(os.path.join("results", "logs"), exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    file_paths = [
        "data/mind2web.jsonl",
        "data/mind2web.json",
        "data/mind2web_tasks.json",
        "../attachments/6ae7fbd0-c4d6-4c1e-b383-931cdfda9cf4/mind2web_tasks.json",
        "../attachments/eb9a1bd5-b7a1-457e-abb9-f0b68bff21ca/mind2web-1.jsonl"
    ]
    
    tasks = []
    for file_path in file_paths:
        if os.path.exists(file_path):
            logger.info(f"Found Mind2Web dataset at {file_path}")
            tasks = load_tasks(file_path)
            if tasks:
                break
    
    if not tasks:
        logger.error("No Mind2Web tasks loaded, exiting")
        return
    
    agent = AnthropicOperatorAgent(headless=args.headless)
    
    results = []
    success_count = 0
    
    for i, task in enumerate(tasks):
        logger.info(f"Processing task {i + 1}/{len(tasks)}: {task.get('task_id', task.get('id', 'unknown'))}")
        
        result = execute_task(agent, task, max_retries=args.max_retries)
        results.append(result)
        
        if result["success"]:
            success_count += 1
        
        success_rate = (success_count / (i + 1)) * 100
        logger.info(f"Success rate so far: {success_rate:.2f}%")
        
        if (i + 1) % 10 == 0 or (i + 1) == len(tasks):
            save_results(results, timestamp)
    
    save_results(results, timestamp)
    
    final_success_rate = (success_count / len(tasks)) * 100
    logger.info(f"Evaluation complete. Final success rate: {final_success_rate:.2f}%")
    
    agent.close()

if __name__ == "__main__":
    main()
