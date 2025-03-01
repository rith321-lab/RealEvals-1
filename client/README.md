# RealEvals Frontend - WebArena Take-Home Project

## Overview

The frontend of RealEvals is a React.js-based user interface that enables AI agents to be evaluated on realistic web-based tasks using WebArena. It provides authentication, role-based access, task management, agent submission, and real-time leaderboard updates.

## Features

### 1. **User Authentication**

- Users can register and log in using JWT-based authentication.
- Role-based access control (Admin & User) is enforced.
- Authentication state is managed using local storage.
- Protected routes ensure only authorized users access specific pages.

### 2. **Role-Based Access Control**

- Admin has full control and can:
  - Create and delete tasks.
  - View all stats (number of agents, tasks, etc.).
  - Access all user routes.
- Users can:
  - Log in and submit AI agents for evaluation.
  - Track submission status.
  - View leaderboards and task details.

### 3. **Task Management (Admin Only)**

- Admin can create tasks with a description, difficulty level, and environment.
- Tasks are displayed on the dashboard.

### 4. **Agent Submission & Status Tracking**

- Users can submit agents for evaluation.
- A background task in FastAPI processes the submission asynchronously.
- Status updates:
  - `Queued` → `Processing` → `Completed` / `Failed`

### 5. **Real-Time Leaderboard & Submission Tracking**

- React Query is used to automatically update:
  - Leaderboard rankings based on performance metrics (accuracy, time, etc.).
  - Submission statuses (avoiding costly API polling).

## Tech Stack

- **Frontend:** React.js (with React Router & React Query)
- **Authentication:** JWT (stored in local storage)
- **UI Components:** TailwindCSS for styling

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/realevals-frontend.git
   cd realevals-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables (`.env` file):
   ```sh
   REACT_APP_API_URL=http://localhost:5173
   ```
4. Start the development server:
   ```sh
   npm start
   ```

## Core Components & Architecture

### 1. **Authentication & Role-Based Access**

- `AuthContext.js`: Manages authentication state.
- `ProtectedRoute.js`: Wraps restricted routes based on role.
- `Login.js` & `Signup.js`: Handle authentication.

### 2. **Admin Dashboard**

- `AdminDashboard.js`: Displays system stats, tasks, and agents.
- `CreateTask.js`: Allows admins to create new tasks.
- `TaskList.js`: Shows all tasks and allows deletion.

### 3. **Task & Agent Management**

- `DisplayTasks.js`: Lists available tasks.
- `TaskDetails.js`: Shows task-specific details.
- `SubmitAgent.js`: Allows users to submit AI agents.

### 4. **Real-Time Status & Leaderboard Updates**

- React Query is used to invalidate and refetch data on updates.
- `Leaderboard.js`: Displays top-performing agents.
- `SubmissionStatus.js`: Tracks the status of submitted agents.

## API Endpoints Used

| Method | Endpoint               | Description                             |
| ------ | ---------------------- | --------------------------------------- |
| POST   | `/auth/login`          | Logs in a user                          |
| POST   | `/auth/signup`         | Registers a new user                    |
| GET    | `/tasks`               | Fetches available tasks                 |
| POST   | `/tasks`               | Creates a new task (Admin only)         |
| DELETE | `/tasks/:id`           | Deletes a task (Admin only)             |
| POST   | `/agents/submit`       | Submits an agent for evaluation         |
| GET    | `/submissions`         | Fetches submission statuses             |
| GET    | `/leaderboard/:taskId` | Fetches leaderboard for a specific task |

## Key Decisions & Optimizations

- **React Query for State Management**
  - Ensures automatic updates when new agents are added or when the leaderboard changes.
  - Avoids frequent API polling, reducing unnecessary requests.
- **Role-Based Route Protection**
  - Implemented via `ProtectedRoute.js` to ensure admin-only actions.
- **Performance Optimization**
  - Used lazy loading for components.
  - Minimized re-renders using memoization (`useMemo`, `useCallback`).

## Screenshots

(Add relevant UI screenshots here)

## Conclusion

This frontend provides an intuitive interface for evaluating AI agents while ensuring real-time updates using React Query. The architecture is modular, making it easy to extend for future WebArena integration.
