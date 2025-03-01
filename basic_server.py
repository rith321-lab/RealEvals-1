from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
from typing import Dict, Any, Optional
import random
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the Browser Use API key from environment variables or use a default value
BROWSER_USE_API_KEY = os.getenv("BROWSER_USE_API_KEY", "test_api_key_for_demo")
print(f"Using Browser Use API Key: {BROWSER_USE_API_KEY[:4]}{'*' * 10}")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class TaskExecuteRequest(BaseModel):
    taskId: str
    parameters: Optional[Dict[str, Any]] = None
    browserUseConfig: Optional[Dict[str, Any]] = None

# Endpoint for health check
@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "message": "Server is running", "api_key_configured": bool(BROWSER_USE_API_KEY)}

# Endpoint for task execution
@app.post("/api/v1/tasks/execute")
async def execute_task(request: TaskExecuteRequest):
    try:
        # Print the request data
        print(f"Task execution request received:")
        print(f"  Task ID: {request.taskId}")
        print(f"  Parameters: {json.dumps(request.parameters, indent=2) if request.parameters else 'None'}")
        print(f"  Browser Use Config: {json.dumps(request.browserUseConfig, indent=2) if request.browserUseConfig else 'None'}")
        print(f"  Using API Key: {BROWSER_USE_API_KEY[:4]}{'*' * 10}")
        
        # Check if API key is configured
        if not BROWSER_USE_API_KEY or BROWSER_USE_API_KEY == "test_api_key_for_demo":
            print("WARNING: Using default API key. For production, set BROWSER_USE_API_KEY in .env file.")
        
        # Simulated execution time
        execution_time = random.uniform(2.0, 4.0)
        time.sleep(1)  # Simulate a brief delay for processing
        
        # Simulated execution steps
        steps = [
            {"action": "navigate", "success": True, "time": random.uniform(0.5, 1.2)},
            {"action": "click", "success": True, "time": random.uniform(0.3, 0.8)},
            {"action": "waitForNavigation", "success": True, "time": random.uniform(0.7, 1.5)}
        ]
        
        # Return a successful response
        return {
            "status": "success",
            "executionTime": execution_time,
            "apiKeyUsed": BROWSER_USE_API_KEY[:4] + "*" * 10,  # Include masked API key in response for debugging
            "results": {
                "taskCompleted": True,
                "screenshotUrl": "https://example.com/screenshot.png",
                "sessionId": f"session-{int(time.time())}",
                "steps": steps,
                "browserUseConfig": request.browserUseConfig  # Echo back the config to confirm it was received
            }
        }
    except Exception as e:
        # Log the error
        print(f"Error executing task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error executing task: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
