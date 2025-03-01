import requests
import json

# Define the task parameters
task = {
    "taskId": "amazon-search-test",
    "parameters": {
        "taskTitle": "Amazon Product Search",
        "taskDescription": "Search Amazon for wireless headphones and extract product information",
        "keywords": ["wireless headphones", "bluetooth headphones"],
        "requirements": {
            "extractTopProducts": True,
            "compareProductPrices": True,
            "findBestRatedItems": True
        }
    },
    "browserUseConfig": {
        "url": "https://www.amazon.com",
        "timeout": 60,
        "maxSteps": 20,
        "searchDepth": 3,
        "captureScreenshots": True
    }
}

# Send the request
response = requests.post(
    "http://localhost:8000/tasks/execute",
    json=task,
    headers={"Content-Type": "application/json"}
)

# Print the response
print(f"Status Code: {response.status_code}")
try:
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except:
    print(f"Response: {response.text}") 