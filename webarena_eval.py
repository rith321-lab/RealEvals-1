import os
import json
import time
import logging
import argparse
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv
from anthropic_operator_agent import AnthropicOperatorAgent

load_dotenv()

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
log_dir = os.path.join("results", "logs")
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, f"webarena_evaluation_{timestamp}.log")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def load_tasks(file_path):
    """Load tasks from a JSON file"""
    tasks = []
    try:
        with open(file_path, 'r') as f:
            try:
                tasks = json.load(f)
                logger.info(f"Loaded {len(tasks)} tasks from {file_path}")
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing JSON file {file_path}: {str(e)}")
    except Exception as e:
        logger.error(f"Error loading tasks from {file_path}: {str(e)}")
    
    return tasks

def save_results(results, dataset_name):
    """Save results to JSON and CSV files"""
    os.makedirs("results", exist_ok=True)
    
    json_file = os.path.join("results", f"{dataset_name}_detailed_{timestamp}.json")
    with open(json_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    logger.info(f"Saved detailed results to {json_file}")
    
    csv_data = []
    for result in results:
        csv_data.append({
            "task_id": result["task_id"],
            "success": result["success"],
            "time_taken": result["time_taken"],
            "error": result.get("error", "")
        })
    
    df = pd.DataFrame(csv_data)
    csv_file = os.path.join("results", f"{dataset_name}_summary_{timestamp}.csv")
    df.to_csv(csv_file, index=False)
    
    logger.info(f"Saved summary results to {csv_file}")
    
    success_rate = df["success"].mean() * 100
    avg_time = df["time_taken"].mean()
    
    logger.info(f"Evaluation complete for {dataset_name}")
    logger.info(f"Success rate: {success_rate:.2f}%")
    logger.info(f"Average time per task: {avg_time:.2f} seconds")
    
    return json_file, csv_file

def evaluate_tasks(tasks, headless=False, max_retries=2):
    """Evaluate tasks using the AnthropicOperatorAgent"""
    results = []
    agent = AnthropicOperatorAgent(headless=headless)
    
    try:
        total_tasks = len(tasks)
        for i, task in enumerate(tasks):
            if 'task_id' not in task:
                task['task_id'] = f"task_{i+1}"
                logger.warning(f"Task {i+1} missing task_id, assigned: {task['task_id']}")
            
            logger.info(f"Processing task {i+1}/{total_tasks}: {task['task_id']}")
            
            retry_count = 0
            success = False
            result = None
            
            while not success and retry_count <= max_retries:
                try:
                    if retry_count > 0:
                        logger.info(f"Retry {retry_count}/{max_retries} for task {task['task_id']}")
                    
                    result = agent.execute_task(task)
                    
                    if result["success"]:
                        success = True
                        logger.info(f"Task {task['task_id']} completed successfully")
                    else:
                        logger.warning(f"Task {task['task_id']} failed: {result.get('error', 'Unknown error')}")
                        retry_count += 1
                        
                        if retry_count <= max_retries:
                            time.sleep(2)
                
                except Exception as e:
                    logger.error(f"Error executing task {task['task_id']}: {str(e)}")
                    result = {
                        "task_id": task["task_id"],
                        "success": False,
                        "answer": "",
                        "expected_answer": task.get("Final answer", ""),
                        "time_taken": 0,
                        "error": str(e)
                    }
                    retry_count += 1
                    
                    if retry_count <= max_retries:
                        time.sleep(2)
            
            if result:
                results.append(result)
            
            if (i + 1) % 5 == 0 or (i + 1) == total_tasks:
                save_results(results, "webarena_intermediate")
                
            success_count = sum(1 for r in results if r["success"])
            logger.info(f"Progress: {i+1}/{total_tasks} tasks completed")
            logger.info(f"Success rate so far: {success_count/(i+1)*100:.2f}%")
            
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")
    finally:
        agent.close()
    
    return results

def main():
    parser = argparse.ArgumentParser(description="Evaluate WebArena dataset")
    parser.add_argument("--headless", action="store_true", help="Run in headless mode")
    parser.add_argument("--max-retries", type=int, default=2, help="Maximum number of retries for failed tasks")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of tasks to evaluate (0 for all)")
    args = parser.parse_args()
    
    logger.info("Starting WebArena evaluation")
    logger.info(f"Headless mode: {args.headless}")
    logger.info(f"Max retries: {args.max_retries}")
    
    tasks = load_tasks("data/webarena.json")
    
    if args.limit > 0 and args.limit < len(tasks):
        logger.info(f"Limiting evaluation to {args.limit} tasks")
        tasks = tasks[:args.limit]
    
    start_time = time.time()
    results = evaluate_tasks(tasks, headless=args.headless, max_retries=args.max_retries)
    total_time = time.time() - start_time
    
    json_file, csv_file = save_results(results, "webarena")
    
    success_count = sum(1 for r in results if r["success"])
    success_rate = (success_count / len(results)) * 100 if results else 0
    
    logger.info(f"Evaluation completed in {total_time:.2f} seconds")
    logger.info(f"Total tasks: {len(tasks)}")
    logger.info(f"Successful tasks: {success_count}")
    logger.info(f"Success rate: {success_rate:.2f}%")
    logger.info(f"Results saved to {json_file} and {csv_file}")

if __name__ == "__main__":
    main()
