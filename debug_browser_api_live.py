from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from pydantic import BaseModel
import uvicorn
import json
from typing import Dict, Any, Optional
import random
import time
import os
import webbrowser
import requests
import uuid
from dotenv import load_dotenv
import sys

print("=" * 50)
print("BROWSER USE API INTEGRATION SERVER")
print("=" * 50)

# Load environment variables
print("Loading environment variables...")
load_dotenv()

# Get the Browser Use API key from environment variables
BROWSER_USE_API_KEY = os.getenv("BROWSER_USE_API_KEY")
print(f"\nBrowserUse API Key from env: {'Configured' if BROWSER_USE_API_KEY else 'Not found'}")

# Check if API key exists
if not BROWSER_USE_API_KEY:
    print("\n*** WARNING: BrowserUse API Key not found in environment variables! ***")
    print("Please add your API key to the .env file with BROWSER_USE_API_KEY=your_key_here")
    BROWSER_USE_API_KEY = "test_api_key_for_demo"
    os.environ["BROWSER_USE_API_KEY"] = BROWSER_USE_API_KEY
else:
    print("BrowserUse API Key found in environment variables.")

# Constants for BrowserUse API
BASE_URL = 'https://api.browser-use.com/api/v1'
HEADERS = {'Authorization': f'Bearer {BROWSER_USE_API_KEY}'}

# Task storage for tracking ongoing tasks
TASKS = {}

# Create a custom port
port = 8001
print(f"\nStarting server on port {port}...")

app = FastAPI(title="BrowserUse API Integration Server")

# Set up CORS middleware with more permissive settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Models
class TaskExecuteRequest(BaseModel):
    taskId: str
    parameters: Optional[Dict[str, Any]] = None
    browserUseConfig: Optional[Dict[str, Any]] = None

# HTML template for live viewer
VIEWER_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BrowserUse Live View - {task_id}</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }}
        header {{
            background-color: #333;
            color: white;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .container {{
            display: flex;
            flex: 1;
            overflow: hidden;
        }}
        .live-view {{
            flex: 1;
            height: 100%;
            border: none;
        }}
        .sidebar {{
            width: 400px;
            background-color: #f5f5f5;
            padding: 20px;
            overflow-y: auto;
            border-left: 1px solid #ddd;
        }}
        .log-entry {{
            margin-bottom: 15px;
            padding: 10px;
            background-color: #fff;
            border-radius: 4px;
            border-left: 4px solid #4CAF50;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        .log-entry pre {{
            margin: 0;
            overflow-x: auto;
            white-space: pre-wrap;
        }}
        .status {{
            font-weight: bold;
        }}
        .controls {{
            display: flex;
            gap: 10px;
        }}
        button {{
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }}
        button.stop {{
            background-color: #f44336;
        }}
        button:hover {{
            opacity: 0.9;
        }}
    </style>
</head>
<body>
    <header>
        <h2>BrowserUse Task: {task_id}</h2>
        <div class="controls">
            <button class="status">Status: Initializing...</button>
            <button class="stop" onclick="stopTask()">Stop Task</button>
        </div>
    </header>
    <div class="container">
        <iframe id="liveFrame" class="live-view" src="{live_url}" allowfullscreen></iframe>
        <div class="sidebar">
            <h3>Task Steps</h3>
            <div id="logs"></div>
        </div>
    </div>

    <script>
        // Task details
        const taskId = '{task_id}';
        let statusCheckInterval;
        
        // Update the status display
        function updateStatus(status) {{
            document.querySelector('.status').textContent = `Status: ${{status}}`;
        }}
        
        // Add a log entry
        function addLogEntry(step) {{
            const logsContainer = document.getElementById('logs');
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            
            // Format the step data nicely
            const formattedStep = JSON.stringify(step, null, 2);
            
            logEntry.innerHTML = `<pre>${{formattedStep}}</pre>`;
            logsContainer.prepend(logEntry);
        }}
        
        // Function to stop the task
        function stopTask() {{
            if (!confirm('Are you sure you want to stop this task?')) return;
            
            fetch('/tasks/{task_id}/stop', {{
                method: 'POST'
            }})
            .then(response => {{
                if (response.ok) {{
                    updateStatus('Stopped');
                    clearInterval(statusCheckInterval);
                    alert('Task has been stopped');
                }}
            }})
            .catch(error => console.error('Error stopping task:', error));
        }}
        
        // Poll for task updates
        function pollTaskStatus() {{
            fetch('/tasks/{task_id}/status')
            .then(response => response.json())
            .then(data => {{
                updateStatus(data.status);
                
                // Add any new steps to the log
                if (data.steps && data.steps.length > 0) {{
                    const existingLogs = document.querySelectorAll('.log-entry').length;
                    if (data.steps.length > existingLogs) {{
                        for (let i = existingLogs; i < data.steps.length; i++) {{
                            addLogEntry(data.steps[i]);
                        }}
                    }}
                }}
                
                // Check if the task is complete
                if (['finished', 'failed', 'stopped'].includes(data.status)) {{
                    clearInterval(statusCheckInterval);
                    
                    if (data.status === 'finished') {{
                        addLogEntry({{
                            "type": "result",
                            "output": data.output
                        }});
                    }}
                }}
            }})
            .catch(error => console.error('Error polling task status:', error));
        }}
        
        // Initialize
        window.onload = function() {{
            updateStatus('Connecting...');
            
            // Start polling for task updates
            pollTaskStatus();
            statusCheckInterval = setInterval(pollTaskStatus, 2000);
        }};
    </script>
</body>
</html>
"""

# BrowserUse API functions
def create_task(instructions: str):
    """Create a new browser automation task"""
    print(f"Creating task with instructions: {instructions}")
    try:
        response = requests.post(f'{BASE_URL}/run-task', 
                               headers=HEADERS, 
                               json={'task': instructions})
        
        if response.status_code != 200:
            print(f"Error creating task: {response.status_code}")
            print(response.text)
            raise Exception(f"Failed to create task: {response.text}")
        
        return response.json()['id']
    except Exception as e:
        print(f"Error in create_task: {str(e)}")
        raise e

def stop_task(task_id: str):
    """Stop a running task"""
    print(f"Stopping task: {task_id}")
    try:
        response = requests.put(f'{BASE_URL}/stop-task', 
                              headers=HEADERS, 
                              params={'task_id': task_id})
        return response.status_code == 200
    except Exception as e:
        print(f"Error stopping task: {str(e)}")
        return False

def get_task_status(task_id: str):
    """Get current task status"""
    try:
        response = requests.get(f'{BASE_URL}/task/{task_id}/status', 
                              headers=HEADERS)
        return response.json()
    except Exception as e:
        print(f"Error getting task status: {str(e)}")
        return {"status": "unknown", "error": str(e)}

def get_task_details(task_id: str):
    """Get full task details including output and live_url"""
    try:
        response = requests.get(f'{BASE_URL}/task/{task_id}', 
                              headers=HEADERS)
        
        if response.status_code != 200:
            print(f"Error getting task details: {response.status_code}")
            print(response.text)
            return None
            
        return response.json()
    except Exception as e:
        print(f"Error getting task details: {str(e)}")
        return None

def create_viewer_file(task_id, live_url):
    """Create a local HTML file to view the live execution"""
    file_path = f"browser_use_task_{task_id}.html"
    
    # Generate the HTML content
    html_content = VIEWER_TEMPLATE.format(
        task_id=task_id,
        live_url=live_url
    )
    
    # Write to file
    with open(file_path, "w") as f:
        f.write(html_content)
    
    return file_path

def open_live_viewer(task_id: str):
    """Open the browser with the live viewer and return the viewer URL and status
    
    Args:
        task_id: The BrowserUse task ID
        
    Returns:
        dict: Contains success status, viewer URL, and direct access URL
    """
    try:
        details = get_task_details(task_id)
        if not details:
            print(f"No details available for task {task_id}")
            return {
                "success": False,
                "message": "Could not retrieve task details for the browser session",
                "viewer_url": None,
                "direct_access_url": None
            }
            
        # Get session ID from details or use task_id as fallback
        session_id = details.get('session_id', task_id)
        
        # Format direct access link - ensure we're using the correct URL format
        direct_access_url = f"https://live.anchorbrowser.io/inspector.html?host=connect.anchorbrowser.io&sessionId={session_id}"
        print(f"Live URL available: {direct_access_url}")
        
        # Try both methods to open the viewer
        try:
            # Method 1: Create and open viewer file
            viewer_path = create_viewer_file(task_id, direct_access_url)
            webbrowser.open('file://' + os.path.abspath(viewer_path))
                
            return {
                "success": True,
                "message": "Viewer opened successfully",
                "viewer_url": direct_access_url,
                "direct_access_url": direct_access_url
            }
        except Exception as e:
            print(f"Error opening viewer: {str(e)}")
            print(f"User can manually access at: {direct_access_url}")
            return {
                "success": True,  # Return True anyway since we have a URL even if opening failed
                "message": f"Viewer URL available but could not open automatically: {str(e)}",
                "viewer_url": direct_access_url,
                "direct_access_url": direct_access_url
            }
    except Exception as e:
        print(f"Error in open_live_viewer: {str(e)}")
        # Fallback direct URL using task_id as session_id
        fallback_url = f"https://live.anchorbrowser.io/inspector.html?host=connect.anchorbrowser.io&sessionId={task_id}"
        print(f"Fallback URL: {fallback_url}")
        
        return {
            "success": False,
            "message": f"Error retrieving live viewer details: {str(e)}",
            "viewer_url": fallback_url,
            "direct_access_url": fallback_url
        }

# API Endpoints
@app.get("/api/v1/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok", 
        "message": "BrowserUse API integration server is running", 
        "api_key_configured": bool(BROWSER_USE_API_KEY) and BROWSER_USE_API_KEY != "test_api_key_for_demo",
        "active_tasks": len(TASKS)
    }

@app.post("/tasks/execute")
async def execute_task(task_data: dict):
    """Execute a task using BrowserUse API"""
    try:
        # Log the incoming task data
        print("\n==== Task Execution Request ====")
        task_id = task_data.get('taskId', f"auto-{uuid.uuid4().hex[:8]}")
        print(f"Task ID: {task_id}")
        
        parameters = task_data.get('parameters', {})
        browser_config = task_data.get('browserUseConfig', {})
        
        # Create instructions for BrowserUse API
        # Either use a natural language instruction or a structured configuration
        if browser_config:
            # For structured config, convert it to a valid instruction
            url = browser_config.get('url', 'https://www.google.com')
            steps = browser_config.get('steps', [])
            
            # Create instruction based on config
            instruction = f"Open {url}"
            
            # Add step information if available
            if steps:
                instruction += " and perform the following steps:\n"
                for i, step in enumerate(steps):
                    instruction += f"{i+1}. {step.get('type', 'action')}"
                    if 'selector' in step:
                        instruction += f" on element '{step['selector']}'"
                    if 'value' in step:
                        instruction += f" with value '{step['value']}'"
                    instruction += "\n"
        else:
            # Fall back to a basic instruction if no config provided
            search_term = parameters.get('searchTerm', 'browser use api')
            instruction = f"Open https://www.google.com and search for {search_term}"
        
        print(f"Creating task: {instruction}")
        
        # Create the task via BrowserUse API
        browser_use_task_id = create_task(instruction)
        print(f"Task created with ID: {browser_use_task_id}")
        
        # Store task info for tracking
        TASKS[task_id] = {
            'browser_use_task_id': browser_use_task_id,
            'status': 'created',
            'created_at': time.time(),
            'instruction': instruction,
            'browser_config': browser_config,
            'parameters': parameters
        }
        
        # Try to open live viewer
        viewer_opened = open_live_viewer(browser_use_task_id)
        
        # Return response with task details
        return {
            "task_id": task_id,
            "browser_use_task_id": browser_use_task_id,
            "status": "created",
            "viewer_opened": viewer_opened,
            "instruction": instruction,
            "message": "Task created successfully. Live viewer launched in browser."
        }
    except Exception as e:
        print(f"Error in execute_task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error executing task: {str(e)}")

@app.get("/tasks/{task_id}/status")
async def get_status(task_id: str):
    """Get the status of a task"""
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    browser_use_task_id = TASKS[task_id]['browser_use_task_id']
    details = get_task_details(browser_use_task_id)
    
    if not details:
        return {"status": "unknown", "message": "Could not retrieve task details"}
    
    # Update local task status
    TASKS[task_id]['status'] = details.get('status', 'unknown')
    
    return {
        "task_id": task_id,
        "browser_use_task_id": browser_use_task_id,
        "status": details.get('status', 'unknown'),
        "steps": details.get('steps', []),
        "output": details.get('output', ''),
        "live_url": details.get('live_url', '')
    }

@app.post("/tasks/{task_id}/stop")
async def stop_task_endpoint(task_id: str):
    """Stop a running task"""
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    browser_use_task_id = TASKS[task_id]['browser_use_task_id']
    success = stop_task(browser_use_task_id)
    
    if success:
        TASKS[task_id]['status'] = 'stopped'
        return {"status": "stopped", "message": f"Task {task_id} stopped successfully"}
    else:
        raise HTTPException(status_code=500, detail=f"Failed to stop task {task_id}")

@app.get("/viewer/{task_id}")
async def get_viewer(task_id: str):
    """Get the HTML viewer for a task"""
    if task_id not in TASKS:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")
    
    browser_use_task_id = TASKS[task_id]['browser_use_task_id']
    details = get_task_details(browser_use_task_id)
    
    if not details or 'live_url' not in details:
        raise HTTPException(status_code=404, detail=f"No live URL available for task {task_id}")
    
    # Generate HTML content
    html_content = VIEWER_TEMPLATE.format(
        task_id=task_id,
        live_url=details['live_url']
    )
    
    return HTMLResponse(content=html_content, status_code=200)

# Also add an endpoint that works with the original API path
@app.post("/api/v1/tasks/execute")
async def execute_task_v1(task_data: dict):
    return await execute_task(task_data)

# Start the server
if __name__ == "__main__":
    print("\n==================================")
    print("🚀 Starting BrowserUse API server on port 8001")
    print("==================================\n")
    uvicorn.run(app, host="0.0.0.0", port=8001) 