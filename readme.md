# API Endpoints Documentation

## Authentication APIs (`/auth`)

### 1. Register a User

**Endpoint:** `POST /auth/register`
**Description:** Registers a new user and returns an authentication token.
**Request Body:** `UserRegisterRequest`
**Response:** `TokenResponse`

### 2. Login

**Endpoint:** `POST /auth/login`
**Description:** Authenticates a user and returns an authentication token.
**Request Body:** `UserLoginRequest`
**Response:** `TokenResponse`

---

## Agent Management APIs (`/agents`)

### 3. Create Agent

**Endpoint:** `POST /agents`
**Description:** Creates a new agent for the authenticated user.
**Request Body:** `AgentCreate`
**Response:** `AgentResponse`

### 4. Get My Agents

**Endpoint:** `GET /agents`
**Description:** Retrieves a list of all agents created by the authenticated user.
**Response:** `List[AgentResponse]`

### 5. Get Agent by ID

**Endpoint:** `GET /agents/{agent_id}`
**Description:** Fetches details of a specific agent.
**Response:** `AgentResponse`

---

## Submissions APIs (`/submissions`)

### 6. Submit an Agent

**Endpoint:** `POST /submissions`
**Description:** Submits an agent for evaluation.
**Request Body:** `SubmissionCreate`
**Response:** `SubmissionResponse`

### 7. Get My Submissions

**Endpoint:** `GET /submissions`
**Description:** Retrieves a list of submissions for the authenticated user with pagination.
**Query Parameters:** `skip`, `limit`
**Response:** `SubmissionListResponse`

### 8. Get Submission by ID

**Endpoint:** `GET /submissions/{submission_id}`
**Description:** Fetches details of a specific submission.
**Response:** `SubmissionResponse`

### 9. Get Leaderboard for a Task

**Endpoint:** `GET /submissions/leaderboard/{task_id}`
**Description:** Retrieves the leaderboard for a specific task.
**Response:** `List[LeaderboardResponse]`

### 10. Get My Submissions by Task

**Endpoint:** `GET /submissions/task/{task_id}`
**Description:** Fetches all submissions for a specific task made by the authenticated user.
**Response:** `SubmissionListResponse`

---

## Task Management APIs (`/tasks`)

### 11. Create a Task

**Endpoint:** `POST /tasks`
**Description:** Creates a new task (Admin only).
**Request Body:** `TaskCreate`
**Response:** `TaskResponse`

### 12. Get All Tasks

**Endpoint:** `GET /tasks`
**Description:** Retrieves all available tasks with pagination.
**Query Parameters:** `skip`, `limit`
**Response:** `TaskListResponse`

### 13. Get Task by ID

**Endpoint:** `GET /tasks/{task_id}`
**Description:** Fetches details of a specific task.
**Response:** `TaskResponse`

### 14. Update Task

**Endpoint:** `PUT /tasks/{task_id}`
**Description:** Updates an existing task (Admin only).
**Request Body:** `TaskUpdate`
**Response:** `TaskResponse`

### 15. Delete Task

**Endpoint:** `DELETE /tasks/{task_id}`
**Description:** Deletes a task (Admin only).
**Response:** `{"message": "Task deleted successfully"}`

---

## Authentication & Authorization

- All APIs require authentication via a Bearer token except `/auth/register` and `/auth/login`.
- Admin-specific APIs require admin-level privileges.

## Database Schema

Below is the ER diagram representing the database design for the system:

![Database Schema](https://1drv.ms/i/s!AnQfRZdUKMDSj4t80PMnYPSZl8ekPA) <!-- Replace with actual image link -->

### Schema Overview

- **User**: Stores user details including authentication info.
- **Agent**: Represents agents associated with users.
- **Task**: Defines different tasks assigned to agents.
- **Submission**: Records submissions of agents for tasks.
- **EvaluationResult**: Stores the evaluation results of submissions.
- **Leaderboard**: Maintains ranking based on submission scores.
- **TaskMetrics**: Defines evaluation parameters for tasks.

Each table has appropriate relationships ensuring normalized and structured data storage.
