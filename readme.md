# RealEvals with WebArena: Take-Home Project

## Overview

RealEvals is a system designed to evaluate AI agents on realistic web-based tasks using WebArena. This project provides a working prototype with a clean user interface, authentication, task management, agent submission, real-time leaderboard updates, and admin controls.

## Screenshots
![Screenshot (822)](https://github.com/user-attachments/assets/d53a8717-3c2b-4a5e-a14d-1e0e71f5eb69)
![image](https://github.com/user-attachments/assets/c620c4e3-130a-4a1f-bf58-519096eafebf)
![image](https://github.com/user-attachments/assets/e25cfdde-b39e-41d9-b96e-ee694197867e)
![image](https://github.com/user-attachments/assets/ff3dd637-5a84-4a36-bc47-05814cd2f7b6)
![image](https://github.com/user-attachments/assets/57e743ec-0bcf-4fa0-9ef4-f01f293344a9)
![image](https://github.com/user-attachments/assets/9049ac7b-30c6-4920-b13e-8e5a9ab998db)
![image](https://github.com/user-attachments/assets/27ddf71e-d4f2-49cd-a4f7-708980c12d60)
![image](https://github.com/user-attachments/assets/705992cc-2e40-43db-9534-82fac0377f5f)



## Tech Stack

### Frontend:

- React.js (Vite)
- React Router for navigation
- React Query for data fetching and caching
- Tailwind CSS for styling
- JWT-based authentication

### Backend:

- FastAPI (Python)
- SQLite database
- Background tasks using FastAPI
- JWT-based authentication

## Features

### 1. Authentication

- User can register and log in
- JWT authentication is used for securing routes
- Role-based access control (Admin vs. User)

### 2. Task Management

- Admin can create, update, and delete tasks
- Users can view available tasks

### 3. Agent Submission & Evaluation

- Users can create AI agents and submit them for evaluation
- Submissions are queued and processed asynchronously
- Status updates from "Queuing" -> "Processing" -> "Completed" or "Failed"
- Results are stored in the database

### 4. Leaderboard

- Displays top-performing agents per task
- Updates dynamically when new submissions are processed
- Ranks agents based on evaluation metrics (accuracy, time, etc.)

---

## Backend API Endpoints

### Authentication APIs (`/auth`)

**1. Register a User**\
`POST /auth/register`\
Registers a new user and returns an authentication token.

**2. Login**\
`POST /auth/login`\
Authenticates a user and returns an authentication token.

### Agent Management APIs (`/agents`)

**3. Create Agent**\
`POST /agents`\
Creates a new agent for the authenticated user.

**4. Get My Agents**\
`GET /agents`\
Retrieves all agents created by the authenticated user.

**5. Get Agent by ID**\
`GET /agents/{agent_id}`\
Fetches details of a specific agent.

### Submissions APIs (`/submissions`)

**6. Submit an Agent**\
`POST /submissions`\
Submits an agent for evaluation.

**7. Get My Submissions**\
`GET /submissions`\
Retrieves a list of submissions for the authenticated user.

**8. Get Submission by ID**\
`GET /submissions/{submission_id}`\
Fetches details of a specific submission.

**9. Get Leaderboard for a Task**\
`GET /submissions/leaderboard/{task_id}`\
Retrieves the leaderboard for a specific task.

### Task Management APIs (`/tasks`)

**10. Create a Task**\
`POST /tasks`\
Creates a new task (Admin only).

**11. Get All Tasks**\
`GET /tasks`\
Retrieves all available tasks.

**12. Get Task by ID**\
`GET /tasks/{task_id}`\
Fetches details of a specific task.

**13. Update Task**\
`PUT /tasks/{task_id}`\
Updates an existing task (Admin only).

**14. Delete Task**\
`DELETE /tasks/{task_id}`\
Deletes a task (Admin only).

---

## Frontend Implementation

### Role-Based Access Control

- Admin has access to all routes including task management and dashboards.
- Users can submit agents and view their own submissions.

### Handling Submissions & Queueing

- When an agent is submitted, it is stored in the database with status `Queuing`.
- A background task processes submissions asynchronously.
- Status updates automatically using React Query when a new submission is made.

### Leaderboard Handling

- React Query is used to update the leaderboard dynamically.
- Invalidation of queries ensures new data is fetched when submissions are processed.
- Sorting is applied to rank agents based on performance metrics.

### Challenges & Future Improvements

- **Optimized Queue Processing**: Background processing can be optimized to scale for a larger number of submissions.
- **More Detailed Metrics**: Currently, ranking is based on simple criteria; we can add more complex evaluation metrics.

---

## Database Schema

### Tables:

- **User**: Stores user credentials and roles.
- **Agent**: Represents AI agents associated with users.
- **Task**: Defines different tasks assigned to agents.
- **Submission**: Records submissions of agents for evaluation.
- **Leaderboard**: Maintains ranking based on submission scores.

---

## Installation & Setup

### Backend Setup

```sh
# Clone the repository
git clone <repo-url>
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload
```

### Frontend Setup

```sh
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install  # or `npm install`

# Start the React application
yarn dev  # or `npm run dev`
```

---

## Conclusion

This project provides a fully functional prototype for RealEvals with authentication, task management, agent submission, and a dynamic leaderboard. While there are challenges such as optimizing real-time updates and scaling the queueing system, the current implementation demonstrates a solid foundation for evaluating AI agents in a web-based environment.
