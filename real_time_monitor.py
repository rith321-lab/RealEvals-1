import os
import json
import time
import curses
import argparse
import pandas as pd
from datetime import datetime

def get_latest_files(dataset_name):
    """Get the latest result files for a dataset"""
    results_dir = "results"
    
    json_files = [f for f in os.listdir(results_dir) if f.startswith(f"{dataset_name}_detailed_") and f.endswith(".json")]
    
    if not json_files:
        return None, None
    
    json_files.sort(reverse=True)
    latest_json = os.path.join(results_dir, json_files[0])
    
    csv_file = json_files[0].replace("detailed", "summary").replace(".json", ".csv")
    latest_csv = os.path.join(results_dir, csv_file)
    
    if not os.path.exists(latest_csv):
        latest_csv = None
    
    return latest_json, latest_csv

def get_log_file(dataset_name):
    """Get the latest log file for a dataset"""
    log_dir = os.path.join("results", "logs")
    
    log_files = [f for f in os.listdir(log_dir) if f.startswith(f"{dataset_name}_evaluation_") and f.endswith(".log")]
    
    if not log_files:
        return None
    
    log_files.sort(reverse=True)
    return os.path.join(log_dir, log_files[0])

def get_progress(dataset_name):
    """Get the progress of a dataset evaluation"""
    json_file, csv_file = get_latest_files(dataset_name)
    
    if not json_file:
        return {
            "dataset": dataset_name,
            "completed": 0,
            "total": 0,
            "success_rate": 0,
            "avg_time": 0,
            "status": "Not started"
        }
    
    try:
        with open(json_file, 'r') as f:
            results = json.load(f)
        
        if dataset_name == "webvoyager":
            total_tasks = 90
        elif dataset_name == "mind2web":
            total_tasks = 1010
        elif dataset_name == "webarena":
            total_tasks = 808
        else:
            total_tasks = 0
        
        completed = len(results)
        success_count = sum(1 for r in results if r["success"])
        success_rate = (success_count / completed) * 100 if completed > 0 else 0
        avg_time = sum(r["time_taken"] for r in results) / completed if completed > 0 else 0
        
        status = "Running" if completed < total_tasks else "Completed"
        
        return {
            "dataset": dataset_name,
            "completed": completed,
            "total": total_tasks,
            "success_rate": success_rate,
            "avg_time": avg_time,
            "status": status
        }
    
    except Exception as e:
        return {
            "dataset": dataset_name,
            "completed": 0,
            "total": 0,
            "success_rate": 0,
            "avg_time": 0,
            "status": f"Error: {str(e)}"
        }

def draw_progress_bar(stdscr, y, x, width, percentage):
    """Draw a progress bar"""
    filled_width = int(width * percentage / 100)
    stdscr.addstr(y, x, "[" + "#" * filled_width + " " * (width - filled_width) + "]")

def monitor_dashboard(stdscr):
    """Display a real-time monitoring dashboard"""
    curses.curs_set(0)  # Hide cursor
    stdscr.clear()
    
    datasets = ["webvoyager", "mind2web", "webarena"]
    
    while True:
        stdscr.clear()
        
        progress_data = [get_progress(dataset) for dataset in datasets]
        
        total_completed = sum(p["completed"] for p in progress_data)
        total_tasks = sum(p["total"] for p in progress_data)
        overall_percentage = (total_completed / total_tasks) * 100 if total_tasks > 0 else 0
        
        stdscr.addstr(0, 0, "OPERATOR BENCHMARK EVALUATION DASHBOARD", curses.A_BOLD)
        stdscr.addstr(1, 0, f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        stdscr.addstr(2, 0, f"Overall progress: {total_completed}/{total_tasks} tasks ({overall_percentage:.2f}%)")
        
        draw_progress_bar(stdscr, 3, 0, 50, overall_percentage)
        
        stdscr.addstr(5, 0, "DATASET PROGRESS", curses.A_BOLD)
        stdscr.addstr(6, 0, "Dataset".ljust(15) + "Progress".ljust(20) + "Success Rate".ljust(15) + "Avg Time".ljust(15) + "Status")
        
        for i, progress in enumerate(progress_data):
            y = 7 + i
            dataset = progress["dataset"].ljust(15)
            percentage = (progress['completed']/progress['total']*100) if progress['total'] > 0 else 0
            progress_str = f"{progress['completed']}/{progress['total']} ({percentage:.2f}%)".ljust(20)
            success_rate = f"{progress['success_rate']:.2f}%".ljust(15)
            avg_time = f"{progress['avg_time']:.2f}s".ljust(15)
            status = progress["status"]
            
            stdscr.addstr(y, 0, dataset)
            stdscr.addstr(y, 15, progress_str)
            stdscr.addstr(y, 35, success_rate)
            stdscr.addstr(y, 50, avg_time)
            stdscr.addstr(y, 65, status)
            
            percentage = (progress["completed"] / progress["total"]) * 100 if progress["total"] > 0 else 0
            draw_progress_bar(stdscr, y + 1, 0, 50, percentage)
        
        if total_completed > 0:
            avg_time_per_task = sum(p["avg_time"] * p["completed"] for p in progress_data) / total_completed
            remaining_tasks = total_tasks - total_completed
            estimated_time = remaining_tasks * avg_time_per_task
            
            hours = int(estimated_time / 3600)
            minutes = int((estimated_time % 3600) / 60)
            seconds = int(estimated_time % 60)
            
            stdscr.addstr(12, 0, f"Estimated time remaining: {hours}h {minutes}m {seconds}s")
        
        stdscr.addstr(14, 0, "Press 'q' to quit, 'r' to refresh")
        
        stdscr.refresh()
        
        stdscr.timeout(5000)  # Refresh every 5 seconds
        key = stdscr.getch()
        
        if key == ord('q'):
            break
        elif key == ord('r'):
            continue

def main():
    parser = argparse.ArgumentParser(description="Real-time monitoring dashboard for operator benchmark evaluations")
    args = parser.parse_args()
    
    curses.wrapper(monitor_dashboard)

if __name__ == "__main__":
    main()
