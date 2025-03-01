"""
Simplified example demonstrating how to use the Browser Use API integration in RealEvals.
This example shows the key concepts without requiring a database connection.
"""

import os
import time
import json
import uuid
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set a test API key if not present
if not os.getenv("BROWSER_USE_API_KEY"):
    os.environ["BROWSER_USE_API_KEY"] = "test_api_key_for_demo"

# Mock Browser Use API client
class BrowserUseClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.browseruse.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        print(f"Initialized Browser Use API client with API key: {api_key[:4]}{'*' * 10}")
    
    def create_task(self, task_config):
        """Create a browser automation task"""
        print(f"Creating browser task with config: {json.dumps(task_config, indent=2)}")
        # In a real implementation, this would make an API call
        # response = requests.post(f"{self.base_url}/tasks", headers=self.headers, json=task_config)
        # return response.json()
        
        # For demo purposes, return a mock task ID
        return {"task_id": str(uuid.uuid4()), "status": "created"}
    
    def get_task_status(self, task_id):
        """Get the status of a browser automation task"""
        print(f"Checking status of task: {task_id}")
        # In a real implementation, this would make an API call
        # response = requests.get(f"{self.base_url}/tasks/{task_id}", headers=self.headers)
        # return response.json()
        
        # For demo purposes, return a mock status
        return {"status": "in_progress", "progress": 50, "steps_completed": 3, "total_steps": 6}
    
    def execute_task(self, task_id):
        """Execute a browser automation task"""
        print(f"Executing task: {task_id}")
        # In a real implementation, this would make an API call
        # response = requests.post(f"{self.base_url}/tasks/{task_id}/execute", headers=self.headers)
        # return response.json()
        
        # For demo purposes, return a mock execution response
        return {"status": "running", "message": "Task execution started"}

def main():
    print("Starting Browser Use API example...")
    
    # Initialize the Browser Use API client
    api_key = os.getenv("BROWSER_USE_API_KEY")
    browser_use_client = BrowserUseClient(api_key)
    
    # 1. Create a browser-based task
    print("\nCreating browser-based task...")
    task_config = {
        "start_url": "https://www.google.com",
        "allowed_domains": ["google.com", "wikipedia.org", "github.com"],
        "timeout_seconds": 300,
        "viewport": {
            "width": 1280,
            "height": 800
        },
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "actions": [
            {
                "type": "navigate",
                "url": "https://www.google.com"
            },
            {
                "type": "type",
                "selector": "input[name='q']",
                "text": "machine learning trends 2023"
            },
            {
                "type": "click",
                "selector": "input[name='btnK']"
            },
            {
                "type": "wait",
                "time_ms": 2000
            },
            {
                "type": "click",
                "selector": ".g a"
            },
            {
                "type": "wait",
                "time_ms": 5000
            },
            {
                "type": "extract",
                "selector": "body",
                "attribute": "textContent"
            }
        ],
        "options": {
            "record_video": True,
            "take_screenshots": True,
            "screenshot_interval_seconds": 5
        }
    }
    
    task = browser_use_client.create_task(task_config)
    task_id = task["task_id"]
    print(f"Created task: {task_id}")
    
    # 2. Execute the task
    print("\nExecuting browser task...")
    execution = browser_use_client.execute_task(task_id)
    print(f"Execution response: {execution}")
    
    # 3. Monitor task progress
    print("\nMonitoring task progress...")
    for i in range(5):
        # Simulate task progress
        status = browser_use_client.get_task_status(task_id)
        print(f"Status: {status['status']}")
        print(f"Progress: {status['progress']}% ({status['steps_completed']}/{status['total_steps']} steps)")
        
        # Simulate task completion on the last iteration
        if i == 4:
            print("\nTask completed!")
            print("\nEvaluation Results:")
            print("Score: 85/100")
            print("Time Taken: 12.5 seconds")
            print("Accuracy: 90%")
            print("\nVideo Recording: https://api.browseruse.com/recordings/task_123456.mp4")
            print("Screenshots: 3 available")
            print("  Screenshot 1: https://api.browseruse.com/screenshots/task_123456_1.png")
            print("  Screenshot 2: https://api.browseruse.com/screenshots/task_123456_2.png")
            print("  Screenshot 3: https://api.browseruse.com/screenshots/task_123456_3.png")
            break
        
        # Wait before checking again
        time.sleep(1)
    
    print("\nExample completed successfully")

if __name__ == "__main__":
    main()
