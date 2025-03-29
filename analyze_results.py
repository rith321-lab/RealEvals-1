import os
import json
import glob
import pandas as pd
import re
from datetime import datetime

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
        return 0, 0, 0, []
    
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
            else:
                success_rate = 0
        else:
            success_rate = 0
        
        error_lines = [line for line in log_content.split('\n') if "Error:" in line or "failed:" in line]
        error_counts = {}
        
        for line in error_lines:
            error_match = re.search(r"Error: (.+)$", line)
            if not error_match:
                error_match = re.search(r"failed: (.+)$", line)
            
            if error_match:
                error = error_match.group(1)
                if error in error_counts:
                    error_counts[error] += 1
                else:
                    error_counts[error] = 1
        
        sorted_errors = sorted(error_counts.items(), key=lambda x: x[1], reverse=True)
        
        return completed, total_tasks, success_rate, sorted_errors
    except Exception as e:
        print(f"Error reading log file for {dataset_name}: {str(e)}")
    
    return 0, 0, 0, []

def analyze_dataset(dataset_name):
    """Analyze the results for a dataset"""
    csv_file, json_file = get_latest_files(dataset_name)
    completed, total, success_rate, errors = get_dataset_progress(dataset_name)
    
    print(f"\n{dataset_name.upper()} DATASET RESULTS:")
    
    if csv_file:
        print(f"CSV file: {csv_file}")
        print(f"JSON file: {json_file}")
        
        try:
            df = pd.read_csv(csv_file)
            
            if not df.empty:
                csv_total_tasks = len(df)
                csv_success_count = df['success'].sum() if 'success' in df.columns else 0
                csv_success_rate = (csv_success_count / csv_total_tasks) * 100 if csv_total_tasks > 0 else 0
                csv_avg_time = df['time_taken'].mean() if 'time_taken' in df.columns else 0
                
                print(f"CSV Data - Total tasks: {csv_total_tasks}")
                print(f"CSV Data - Successful tasks: {csv_success_count}")
                print(f"CSV Data - Success rate: {csv_success_rate:.2f}%")
                print(f"CSV Data - Average time per task: {csv_avg_time:.2f} seconds")
                
                if 'error' in df.columns:
                    error_counts = df['error'].value_counts().head(5)
                    if not error_counts.empty:
                        print("\nTop 5 errors from CSV:")
                        for error, count in error_counts.items():
                            if error and error != "":
                                print(f"- {error}: {count} occurrences")
            else:
                print("No data in CSV file")
        except Exception as e:
            print(f"Error analyzing CSV file: {str(e)}")
    else:
        print("No CSV file found")
    
    log_file = get_log_file(dataset_name)
    if log_file:
        print(f"\nLog file: {log_file}")
        print(f"Log Data - Tasks processed: {completed}/{total} ({(completed/total*100):.2f}% complete)")
        print(f"Log Data - Success rate: {success_rate:.2f}%")
        
        if errors:
            print("\nTop 5 errors from logs:")
            for error, count in errors[:5]:
                print(f"- {error}: {count} occurrences")
    else:
        print("No log file found")

def main():
    """Main function"""
    print("=" * 60)
    print("OPERATOR BENCHMARK RESULTS ANALYSIS")
    print("=" * 60)
    print(f"Analysis time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    datasets = ["webvoyager", "mind2web", "webarena"]
    
    for dataset in datasets:
        analyze_dataset(dataset)
    
    print("\n" + "=" * 60)
    print("Analysis complete")
    print("=" * 60)

if __name__ == "__main__":
    main()
