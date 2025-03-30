import os
import re
import time
from datetime import datetime

def check_log_file(log_file, dataset_name, total_tasks):
    """Check a log file for progress information"""
    if not os.path.exists(log_file):
        return {
            "dataset": dataset_name,
            "completed": 0,
            "total": total_tasks,
            "success_rate": 0.0,
            "latest_task": "Not started"
        }
    
    try:
        with open(log_file, 'r') as f:
            content = f.read()
        
        task_matches = re.findall(r"Processing task (\d+)/\d+", content)
        if task_matches:
            completed = int(task_matches[-1]) - 1  # Subtract 1 because the latest task is in progress
            if completed < 0:
                completed = 0
        else:
            completed = 0
        
        success_matches = re.findall(r"Success rate so far: ([\d.]+)%", content)
        if success_matches:
            success_rate = float(success_matches[-1])
        else:
            success_rate = 0.0
        
        task_id_matches = re.findall(r"Processing task \d+/\d+: (.+)", content)
        if task_id_matches:
            latest_task = task_id_matches[-1]
        else:
            latest_task = "Unknown"
        
        return {
            "dataset": dataset_name,
            "completed": completed,
            "total": total_tasks,
            "success_rate": success_rate,
            "latest_task": latest_task
        }
    
    except Exception as e:
        print(f"Error reading log file {log_file}: {str(e)}")
        return {
            "dataset": dataset_name,
            "completed": 0,
            "total": total_tasks,
            "success_rate": 0.0,
            "latest_task": f"Error: {str(e)}"
        }

def print_progress_bar(completed, total, width=50):
    """Print a progress bar"""
    percent = completed / total if total > 0 else 0
    filled_width = int(width * percent)
    bar = '█' * filled_width + '░' * (width - filled_width)
    return f"[{bar}] {completed}/{total} ({percent:.1%})"

def main():
    """Main function"""
    log_dir = os.path.join("results", "logs")
    
    if not os.path.exists(log_dir):
        os.makedirs(log_dir, exist_ok=True)
    
    webvoyager_log = os.path.join(log_dir, "webvoyager_run.log")
    mind2web_log = os.path.join(log_dir, "mind2web_run.log")
    webarena_log = os.path.join(log_dir, "webarena_run.log")
    
    datasets = [
        {"name": "WebVoyager", "log_file": webvoyager_log, "total": 90},
        {"name": "Mind2Web", "log_file": mind2web_log, "total": 1009},
        {"name": "WebArena", "log_file": webarena_log, "total": 812}
    ]
    
    try:
        while True:
            os.system('clear')  # Clear the terminal
            
            print("\n" + "="*70)
            print("OPERATOR BENCHMARK PROGRESS REPORT")
            print("="*70)
            
            print(f"\nLast updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            total_completed = 0
            total_tasks = 0
            
            for dataset in datasets:
                result = check_log_file(dataset["log_file"], dataset["name"], dataset["total"])
                total_completed += result["completed"]
                total_tasks += result["total"]
                
                print(f"\n{result['dataset']} DATASET:")
                print(f"  Progress: {print_progress_bar(result['completed'], result['total'])}")
                print(f"  Success Rate: {result['success_rate']:.2f}%")
                print(f"  Latest Task: {result['latest_task']}")
            
            overall_percent = total_completed / total_tasks if total_tasks > 0 else 0
            print("\n" + "="*70)
            print(f"OVERALL PROGRESS: {print_progress_bar(total_completed, total_tasks)}")
            print("="*70)
            
            print("\nPress Ctrl+C to exit")
            time.sleep(10)  # Update every 10 seconds
    
    except KeyboardInterrupt:
        print("\nExiting...")

if __name__ == "__main__":
    main()
