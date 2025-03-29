import os
import json
import glob
import pandas as pd
from datetime import datetime

def get_latest_files(dataset_name):
    """Get the latest result files for a dataset"""
    results_dir = "results"
    
    csv_files = [f for f in os.listdir(results_dir) if f.startswith(f"{dataset_name}_summary_") and f.endswith(".csv")]
    
    if not csv_files:
        return None, None
    
    csv_files.sort(reverse=True)
    latest_csv = os.path.join(results_dir, csv_files[0])
    
    json_file = csv_files[0].replace("summary", "detailed").replace(".csv", ".json")
    latest_json = os.path.join(results_dir, json_file)
    
    if not os.path.exists(latest_json):
        latest_json = None
    
    return latest_csv, latest_json

def analyze_dataset(dataset_name):
    """Analyze the results for a dataset"""
    csv_file, json_file = get_latest_files(dataset_name)
    
    if not csv_file:
        print(f"{dataset_name.upper()}: No results available")
        return None
    
    df = pd.read_csv(csv_file)
    
    total_tasks = len(df)
    success_count = df['success'].sum()
    success_rate = (success_count / total_tasks) * 100 if total_tasks > 0 else 0
    avg_time = df['time_taken'].mean()
    
    error_counts = df['error'].value_counts().head(3)
    
    result = {
        "dataset": dataset_name,
        "total_tasks": total_tasks,
        "success_count": success_count,
        "success_rate": success_rate,
        "avg_time": avg_time,
        "common_errors": error_counts.to_dict() if not error_counts.empty else {},
        "csv_file": csv_file,
        "json_file": json_file
    }
    
    return result

def print_summary(results):
    """Print a summary of the results"""
    print("\n" + "="*50)
    print("OPERATOR BENCHMARK EVALUATION SUMMARY")
    print("="*50)
    
    for result in results:
        if result:
            print(f"\n{result['dataset'].upper()} DATASET:")
            print(f"  Total Tasks: {result['total_tasks']}")
            print(f"  Success Rate: {result['success_rate']:.2f}%")
            print(f"  Average Time: {result['avg_time']:.2f} seconds")
            print(f"  CSV File: {result['csv_file']}")
            print(f"  JSON File: {result['json_file']}")
            
            if result['common_errors']:
                print("  Common Errors:")
                for error, count in result['common_errors'].items():
                    error_str = error[:100] + "..." if len(error) > 100 else error
                    print(f"    - {error_str} ({count} occurrences)")
    
    print("\n" + "="*50)

def main():
    """Main function"""
    datasets = ["webvoyager", "mind2web", "webarena"]
    results = []
    
    for dataset in datasets:
        result = analyze_dataset(dataset)
        results.append(result)
    
    print_summary(results)

if __name__ == "__main__":
    main()
