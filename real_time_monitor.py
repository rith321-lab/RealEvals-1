import os
import json
import glob
import time
import logging
import re
import pandas as pd
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

def get_latest_files(dataset_name):
    """Get the latest result files for a dataset"""
    results_dir = "results"
    
    csv_files = glob.glob(os.path.join(results_dir, f"{dataset_name}_summary_*.csv"))
    
    if not csv_files:
        return None, None
    
    csv_files.sort(reverse=True)
    latest_csv = csv_files[0]
    
    json_file = latest_csv.replace("summary", "detailed").replace(".csv", ".json")
    
    if not os.path.exists(json_file):
        json_file = None
    
    return latest_csv, json_file

def get_log_file(dataset_name):
    """Get the latest log file for a dataset"""
    log_dir = os.path.join("results", "logs")
    
    if dataset_name == "mind2web":
        log_files = glob.glob(os.path.join(log_dir, f"{dataset_name}_run_new.log"))
        if not log_files:
            log_files = glob.glob(os.path.join(log_dir, f"{dataset_name}_run.log"))
    else:
        log_files = glob.glob(os.path.join(log_dir, f"{dataset_name}_run.log"))
    
    if not log_files:
        return None
    
    return log_files[0]

def get_dataset_progress(dataset_name):
    """Get the progress for a dataset from the log file"""
    log_file = get_log_file(dataset_name)
    
    if not log_file:
        log_file = os.path.join("results", "logs", f"{dataset_name}_run.log")
        if not os.path.exists(log_file):
            return 0, 0, 0
    
    try:
        with open(log_file, 'r') as f:
            log_content = f.read()
        
        total_tasks = 0
        if dataset_name == "webvoyager":
            total_match = re.search(r"Processing task \d+/(\d+)", log_content)
            if total_match:
                total_tasks = int(total_match.group(1))
            else:
                total_tasks = 90  # Default for WebVoyager
        elif dataset_name == "mind2web":
            total_match = re.search(r"Processing task \d+/(\d+)", log_content)
            if total_match:
                total_tasks = int(total_match.group(1))
            else:
                total_tasks = 1000  # Updated default for Mind2Web
        elif dataset_name == "webarena":
            total_match = re.search(r"Processing task \d+/(\d+)", log_content)
            if total_match:
                total_tasks = int(total_match.group(1))
            else:
                total_tasks = 812  # Default for WebArena
        
        task_lines = re.findall(r"Processing task (\d+)/\d+", log_content)
        
        if task_lines:
            completed = int(task_lines[-1]) - 1  # Subtract 1 because the latest task is in progress
            if completed < 0:
                completed = 0
        else:
            completed = 0
        
        success_lines = [line for line in log_content.split('\n') if "Success rate so far:" in line]
        
        if success_lines:
            latest_success = success_lines[-1]
            success_match = re.search(r"Success rate so far: ([\d.]+)%", latest_success)
            
            if success_match:
                success_rate = float(success_match.group(1))
                return completed, total_tasks, success_rate
        
        return completed, total_tasks, 0
    except Exception as e:
        logger.error(f"Error reading log file for {dataset_name}: {str(e)}")
    
    return 0, 0, 0

def analyze_dataset(dataset_name):
    """Analyze the results for a dataset"""
    csv_file, json_file = get_latest_files(dataset_name)
    completed, total, success_rate = get_dataset_progress(dataset_name)
    
    if not csv_file:
        return {
            "dataset": dataset_name,
            "completed": completed,
            "total": total,
            "success_rate": success_rate,
            "avg_time": 0,
            "csv_file": None,
            "json_file": None
        }
    
    try:
        df = pd.read_csv(csv_file)
        
        if df.empty:
            return {
                "dataset": dataset_name,
                "completed": completed,
                "total": total,
                "success_rate": success_rate,
                "avg_time": 0,
                "csv_file": csv_file,
                "json_file": json_file
            }
        
        avg_time = df['time_taken'].mean() if 'time_taken' in df.columns else 0
        
    except Exception as e:
        logger.error(f"Error reading CSV file {csv_file}: {str(e)}")
        avg_time = 0
    
    result = {
        "dataset": dataset_name,
        "completed": completed,
        "total": total,
        "success_rate": success_rate,
        "avg_time": avg_time,
        "csv_file": csv_file,
        "json_file": json_file
    }
    
    return result

def print_dashboard(results):
    """Print a dashboard of the results"""
    os.system('clear')  # Clear the terminal
    
    print("\n" + "="*60)
    print("OPERATOR BENCHMARK REAL-TIME MONITORING DASHBOARD")
    print("="*60)
    
    print(f"\nLast updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    total_completed = sum(result['completed'] for result in results)
    total_tasks = sum(result['total'] for result in results)
    
    if total_tasks > 0:
        overall_completion = (total_completed / total_tasks) * 100
    else:
        overall_completion = 0
    
    print(f"\nOVERALL PROGRESS: {total_completed}/{total_tasks} tasks ({overall_completion:.2f}%)")
    
    for result in results:
        dataset = result['dataset'].upper()
        completed = result['completed']
        total = result['total']
        success_rate = result['success_rate']
        avg_time = result['avg_time']
        
        if total > 0:
            completion_rate = (completed / total) * 100
        else:
            completion_rate = 0
        
        print(f"\n{dataset} DATASET:")
        print(f"  Progress: {completed}/{total} tasks ({completion_rate:.2f}%)")
        print(f"  Success Rate: {success_rate:.2f}%")
        print(f"  Average Time: {avg_time:.2f} seconds")
        
        if result['csv_file']:
            print(f"  CSV File: {os.path.basename(result['csv_file'])}")
        if result['json_file']:
            print(f"  JSON File: {os.path.basename(result['json_file'])}")
    
    print("\n" + "="*60)
    print("Press Ctrl+C to quit or 'r' to refresh manually")
    print("="*60)

def main():
    """Main function"""
    datasets = ["webvoyager", "mind2web", "webarena"]
    
    try:
        while True:
            results = []
            
            for dataset in datasets:
                result = analyze_dataset(dataset)
                results.append(result)
            
            print_dashboard(results)
            
            import select
            import sys
            
            i, o, e = select.select([sys.stdin], [], [], 5)
            
            if i:
                key = sys.stdin.readline().strip()
                if key.lower() == 'q':
                    break
            
    except KeyboardInterrupt:
        print("\nExiting real-time monitor...")
    
    print("\nFinal results summary:")
    for dataset in datasets:
        result = analyze_dataset(dataset)
        print(f"{result['dataset'].upper()}: {result['completed']}/{result['total']} tasks, {result['success_rate']:.2f}% success rate")

if __name__ == "__main__":
    main()
