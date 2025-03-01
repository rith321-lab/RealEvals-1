"""
Basic FastAPI server - no Supabase
"""
import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import time
import random
import json
import os
import requests
import re

# Import BrowserUse API functions
try:
    from debug_browser_api_live import create_task, open_live_viewer, get_task_status, get_task_details
    BROWSER_USE_API_AVAILABLE = True
except ImportError:
    BROWSER_USE_API_AVAILABLE = False
    print("Warning: BrowserUse API integration not available. Using mock execution.")

# Setup API key
BROWSER_USE_API_KEY = os.getenv("BROWSER_USE_API_KEY", "test_api_key_for_demo")
BASE_URL = "https://api.browseruse.com/api"
HEADERS = {'Authorization': f'Bearer {BROWSER_USE_API_KEY}'}

# Track running tasks
TASKS = {}

app = FastAPI(title="Basic FastAPI Server", version="0.1")

# Add CORS middleware - critical for browser API to work
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample in-memory data
fake_users = [
    {"id": str(uuid.uuid4()), "email": "user1@example.com", "firstName": "John", "lastName": "Doe", "role": "USER"},
    {"id": str(uuid.uuid4()), "email": "user2@example.com", "firstName": "Jane", "lastName": "Smith", "role": "ADMIN"},
    {"id": str(uuid.uuid4()), "email": "user3@example.com", "firstName": "Bob", "lastName": "Johnson", "role": "USER"}
]

# Mock task data
fake_tasks = [
    {
        "id": "restaurant-search-task",
        "title": "Restaurant Menu Search",
        "description": "Search for restaurants and extract menu information",
        "difficulty": "Medium",
        "parameters": {"url": "https://example.com/restaurants", "searchTerms": ["vegetarian", "prices"]},
        "browserUseConfig": {"timeout": 30},
        "createdAt": "2023-05-20T10:30:00Z",
        "createdBy": "System"
    },
    {
        "id": "2",
        "title": "Product Comparison",
        "description": "Compare products across different e-commerce sites",
        "difficulty": "Hard",
        "parameters": {"url": "https://example.com/products", "searchTerms": ["laptop", "price comparison"]},
        "browserUseConfig": {"timeout": 45},
        "createdAt": "2023-05-21T09:15:00Z",
        "createdBy": "System"
    },
    {
        "id": "3",
        "title": "Interview Tips for SWE Roles",
        "description": "Find tips for software engineering interviews",
        "difficulty": "Easy",
        "parameters": {"url": "https://example.com/careers", "searchTerms": ["software engineer", "interview tips"]},
        "browserUseConfig": {"timeout": 25},
        "createdAt": "2023-05-22T14:45:00Z",
        "createdBy": "System"
    }
]

# Mock submissions data
fake_submissions = []

# Pydantic models
class UserBase(BaseModel):
    email: str
    firstName: str
    lastName: Optional[str] = None
    role: str = "USER"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    
    class Config:
        from_attributes = True

class TaskExecution(BaseModel):
    taskId: str
    parameters: Optional[Dict[str, Any]] = None
    browserUseConfig: Optional[Dict[str, Any]] = None

class TaskResponse(BaseModel):
    status: str
    executionTime: float
    results: Dict[str, Any]

@app.get("/")
async def root():
    return {"status": "ok", "message": "Basic FastAPI server running"}

@app.get("/api/users", response_model=List[User])
async def get_users():
    return fake_users

@app.get("/api/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    for user in fake_users:
        if user["id"] == user_id:
            return user
    return {"error": "User not found"}

@app.post("/api/users", response_model=User)
async def create_user(user: UserCreate):
    new_user = user.dict()
    new_user["id"] = str(uuid.uuid4())
    # In a real app, you would hash the password here
    new_user.pop("password")  # Don't return the password
    fake_users.append(new_user)
    return new_user

# Handle OPTIONS requests for CORS preflight
@app.options("/tasks/execute")
async def options_execute_task():
    return {}

@app.options("/api/v1/tasks/execute")
async def options_api_v1_execute_task():
    return {}

# Helper functions for BrowserUse API
def create_browser_task(instructions: str):
    """Create a new browser automation task if API available, otherwise simulate"""
    if BROWSER_USE_API_AVAILABLE:
        return create_task(instructions)
    else:
        # Mock task creation
        return f"mock-{uuid.uuid4().hex[:8]}"

def open_browser_viewer(task_id: str):
    """Open live viewer if API available"""
    if BROWSER_USE_API_AVAILABLE:
        return open_live_viewer(task_id)
    return {"success": False, "message": "BrowserUse API not available"}

# Task execution endpoints
@app.post("/tasks/execute")
async def execute_task(task_request: Request):
    # Get the JSON body
    body = await task_request.json()
    task_id = body.get("taskId")
    parameters = body.get("parameters", {})
    browser_config = body.get("browserUseConfig", {})
    
    # Log the received task
    print(f"Executing task: {task_id}")
    print(f"Parameters: {parameters}")
    print(f"Browser Config: {browser_config}")
    
    # Check if task exists
    task_exists = any(task["id"] == task_id for task in fake_tasks)
    if not task_exists:
        # Create a new submission record for this execution
        submission_id = str(uuid.uuid4())
        fake_submissions.append({
            "id": submission_id,
            "taskId": task_id,
            "userId": "system",
            "score": random.randint(70, 95),
            "status": "completed",
            "executionTime": 3.5,
            "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        })
    
    try:
        # Setup the BrowserUse task instructions
        if browser_config:
            # For structured config, convert it to a valid instruction
            url = browser_config.get('url', 'https://www.google.com')
            timeout = browser_config.get('timeout', 60)
            max_steps = browser_config.get('maxSteps', 15)
            
            # Create more detailed instruction based on config and parameters
            instruction = f"Open {url}"
            
            # Add search terms if provided in parameters (either directly or nested)
            search_terms = []
            if parameters.get("searchTerms") and isinstance(parameters["searchTerms"], list):
                search_terms = parameters["searchTerms"]
            elif parameters.get("keywords") and isinstance(parameters["keywords"], list):
                search_terms = parameters["keywords"]
            
            if search_terms:
                # Join search terms with proper formatting
                search_terms_str = ", ".join([f'"{term}"' for term in search_terms])
                instruction += f" and search for the following terms: {search_terms_str}"
                
                # Add task objectives based on requirements
                instruction += "\n\nComplete the following tasks:"
                
                # Add requirements if provided
                req_count = 1
                if parameters.get("requirements"):
                    for key, value in parameters["requirements"].items():
                        if value:
                            # Convert camelCase to readable text
                            readable_key = re.sub(r'([A-Z])', r' \1', key)
                            readable_req = readable_key[0].upper() + readable_key[1:]
                            instruction += f"\n{req_count}. {readable_req}"
                            req_count += 1
                
                # Add task title and description if provided
                if parameters.get("taskTitle"):
                    instruction += f"\n\nTask Title: {parameters['taskTitle']}"
                    
                if parameters.get("taskDescription"):
                    instruction += f"\n\nTask Description: {parameters['taskDescription']}"
                    
                # Add formatting instructions
                instruction += "\n\nFor each search term, collect information from at least 3 top results."
                instruction += "\nFormat the output as a structured report with sections for each requirement."
            
            print(f"Creating BrowserUse task with instruction: {instruction}")
            
            # Create the task via BrowserUse API or mock if unavailable
            browser_use_task_id = create_browser_task(instruction)
            print(f"BrowserUse task created with ID: {browser_use_task_id}")
            
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
            viewer_result = open_browser_viewer(browser_use_task_id)
            viewer_opened = False
            viewer_message = ""
            
            if isinstance(viewer_result, dict):
                viewer_opened = viewer_result.get("success", False)
                viewer_message = viewer_result.get("message", "")
                # Update live viewer URL if provided in the result
                if viewer_result.get("direct_access_url"):
                    live_viewer_url = viewer_result["direct_access_url"]
            else:
                viewer_opened = bool(viewer_result)
            
            if viewer_opened:
                print("Live viewer opened successfully")
            else:
                print("Live viewer could not be opened automatically")
            
            # Add a small delay to allow task to start
            time.sleep(1)
            
            # Return response with live task execution details
            steps = [
                {"action": "navigate", "success": True, "time": 0.8, "details": f"Navigated to {url}"},
                {"action": "setup", "success": True, "time": 0.2, "details": "Configured browser for task execution"}
            ]
            
            # Add search steps for each search term
            if search_terms:
                for idx, term in enumerate(search_terms[:3]):  # Show first 3 terms in steps
                    steps.append({
                        "action": "search", 
                        "success": True, 
                        "time": 0.6,
                        "details": f"Searching for '{term}'"
                    })
                
                if len(search_terms) > 3:
                    steps.append({
                        "action": "search", 
                        "success": True, 
                        "time": 0.6,
                        "details": f"Searching for {len(search_terms) - 3} more terms..."
                    })
                
                # Add steps for each requirement
                if parameters.get("requirements"):
                    for key, value in parameters["requirements"].items():
                        if value:
                            readable_key = re.sub(r'([A-Z])', r' \1', key)
                            readable_req = readable_key[0].upper() + readable_key[1:]
                            steps.append({
                                "action": "process",
                                "success": True,
                                "time": 0.7,
                                "details": f"Processing requirement: {readable_req}"
                            })
                
                steps.append({
                    "action": "execute", 
                    "success": True, 
                    "time": 0.3,
                    "details": "BrowserUse API task is executing. Click 'Open Live Viewer' to see real-time progress."
                })
            
            # Get the direct live viewer URL
            task_details = get_task_details(browser_use_task_id) if BROWSER_USE_API_AVAILABLE else None
            live_viewer_url = ""
            live_viewer_direct_url = ""
            
            # First try to get the live viewer URL from the task details
            if task_details:
                # Try to get session_id first (preferred)
                if 'session_id' in task_details:
                    session_id = task_details['session_id']
                    live_viewer_url = f"https://live.anchorbrowser.io/inspector.html?host=connect.anchorbrowser.io&sessionId={session_id}"
                    live_viewer_direct_url = live_viewer_url
                    print(f"Using session_id for live URL: {live_viewer_url}")
                # Then try live_url if available
                elif 'live_url' in task_details:
                    live_viewer_url = task_details['live_url']
                    live_viewer_direct_url = live_viewer_url
                    print(f"Using live_url from task details: {live_viewer_url}")
            
            # If we still don't have a URL, use the task ID as the session ID
            if not live_viewer_url:
                live_viewer_url = f"https://live.anchorbrowser.io/inspector.html?host=connect.anchorbrowser.io&sessionId={browser_use_task_id}"
                live_viewer_direct_url = live_viewer_url
                print(f"Using fallback URL with task_id: {live_viewer_url}")
            
            # Check if we have a viewer result with URLs
            if isinstance(viewer_result, dict) and viewer_result.get("direct_access_url"):
                # Override with the URLs from the viewer result if available
                live_viewer_direct_url = viewer_result["direct_access_url"]
                if viewer_result.get("viewer_url"):
                    live_viewer_url = viewer_result["viewer_url"]
                else:
                    live_viewer_url = live_viewer_direct_url
                print(f"Using URLs from viewer result: {live_viewer_url}")
            
            return {
                "status": "success",
                "executionTime": 1.0,
                "results": {
                    "taskCompleted": True,
                    "screenshotUrl": f"https://example.com/screenshot-{task_id}.png",
                    "sessionId": browser_use_task_id,
                    "steps": steps,
                    "browserUseTaskId": browser_use_task_id,
                    "liveViewerOpened": viewer_opened,
                    "liveViewerUrl": live_viewer_url,
                    "liveViewerDirectUrl": live_viewer_direct_url,
                    "instruction": instruction
                }
            }
            
        else:
            # Fall back to simulated execution if no browser config
            # Simulate execution time (1-2 seconds for better UX)
            execution_time = 1.0 + (random.random() * 1.0)
            time.sleep(1)
            
            # Create detailed response based on task parameters
            steps = [
                {"action": "navigate", "success": True, "time": 0.8, "details": f"Navigated to {parameters.get('url', 'https://example.com')}"}
            ]
            
            # Add search steps if search terms are provided
            if "searchTerms" in parameters and isinstance(parameters["searchTerms"], list):
                for term in parameters["searchTerms"]:
                    steps.append({
                        "action": "search", 
                        "success": True, 
                        "time": 0.5,
                        "details": f"Searched for '{term}'"
                    })
                    steps.append({
                        "action": "extract", 
                        "success": True, 
                        "time": 0.6,
                        "details": f"Extracted search results for '{term}'"
                    })
            else:
                # Generic steps
                steps.append({
                    "action": "interact", 
                    "success": True, 
                    "time": 0.7,
                    "details": "Interacted with page elements"
                })
                steps.append({
                    "action": "extract", 
                    "success": True, 
                    "time": 0.8,
                    "details": "Extracted relevant data"
                })
            
            # Add analysis step
            steps.append({
                "action": "analyze", 
                "success": True, 
                "time": 0.9,
                "details": "Analyzed the collected data"
            })
            
            return {
                "status": "success",
                "executionTime": execution_time,
                "results": {
                    "taskCompleted": True,
                    "screenshotUrl": f"https://example.com/screenshot-{task_id}.png",
                    "sessionId": f"session-{uuid.uuid4()}",
                    "steps": steps
                }
            }
    except Exception as e:
        print(f"Error executing task: {str(e)}")
        return {
            "status": "error",
            "message": f"Error executing task: {str(e)}",
            "executionTime": 0,
            "results": {
                "taskCompleted": False,
                "steps": [
                    {"action": "error", "success": False, "time": 0, "details": str(e)}
                ]
            }
        }

# Alternative endpoint path
@app.post("/api/v1/tasks/execute")
async def api_v1_execute_task(request: Request):
    return await execute_task(request)

@app.get("/api/health")
async def health_check():
    """Check the health of the API and BrowserUse integration"""
    # Test the BrowserUse API connection if available
    browser_api_status = "unavailable"
    
    if BROWSER_USE_API_AVAILABLE:
        try:
            # Check if we have an API key
            if BROWSER_USE_API_KEY and BROWSER_USE_API_KEY != "test_api_key_for_demo":
                browser_api_status = "configured"
            else:
                browser_api_status = "unconfigured"
        except Exception as e:
            print(f"Error checking BrowserUse API: {str(e)}")
            browser_api_status = "error"
    
    return {
        "status": "healthy",
        "version": "0.1",
        "user_count": len(fake_users),
        "browser_use_api": {
            "status": browser_api_status,
            "key_configured": BROWSER_USE_API_KEY and BROWSER_USE_API_KEY != "test_api_key_for_demo"
        }
    }

# Task-related API endpoints
@app.get("/tasks")
async def get_all_tasks():
    return fake_tasks

@app.get("/tasks/{task_id}")
async def get_task(task_id: str):
    # Find the task by ID
    for task in fake_tasks:
        if task["id"] == task_id:
            return task
    
    # Return a default task if not found (for development purposes)
    return {
        "id": task_id,
        "title": f"Task {task_id}",
        "description": "This is a mock task description",
        "difficulty": "Medium",
        "parameters": {"url": "https://example.com"},
        "browserUseConfig": {"timeout": 30},
        "createdAt": "2023-05-20T10:30:00Z",
        "createdBy": "System"
    }

@app.get("/submissions/task/{task_id}")
async def get_submissions(task_id: str):
    # Filter submissions by task ID
    task_submissions = [sub for sub in fake_submissions if sub["taskId"] == task_id]
    
    # If no submissions exist, create a few mock ones
    if not task_submissions:
        for i in range(3):
            submission_id = str(uuid.uuid4())
            task_submissions.append({
                "id": submission_id,
                "taskId": task_id,
                "userId": f"user{i+1}",
                "score": random.randint(60, 95),
                "status": "completed",
                "executionTime": round(2.0 + (random.random() * 3.0), 1),
                "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            })
        
        # Add these to the global submissions
        fake_submissions.extend(task_submissions)
    
    return task_submissions

@app.get("/submissions/leaderboard/{task_id}")
async def get_leaderboard(task_id: str):
    # Get submissions for this task
    task_submissions = await get_submissions(task_id)
    
    # Sort by score (highest first)
    leaderboard = sorted(task_submissions, key=lambda x: x["score"], reverse=True)
    
    # Add rank and user info
    for idx, entry in enumerate(leaderboard):
        entry["rank"] = idx + 1
        # Add mock user info
        user_idx = int(entry["userId"].replace("user", "")) if entry["userId"].startswith("user") else 0
        entry["user"] = {
            "id": entry["userId"],
            "name": f"User {user_idx}" if entry["userId"].startswith("user") else "Anonymous",
            "avatar": f"https://ui-avatars.com/api/?name=User+{user_idx}&background=random"
        }
    
    return leaderboard

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
