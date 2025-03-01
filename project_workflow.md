# RealEvals Project Workflow

## Overview

RealEvals is a platform for evaluating AI agents with real-world tasks, particularly focusing on browsing capabilities. The system uses Supabase for backend storage and the Browser Use API for executing agent tasks in real browser environments.

## Detailed Workflow

### 1. Setup
- Users clone the repository
- Install Python (backend) and Node.js (frontend) dependencies
- Configure environment variables including Supabase and Browser Use API keys
- Initialize the database (handled through Supabase)

### 2. Admin Tasks
- Administrators (users with "ADMIN" role) create evaluation tasks
- Tasks include parameters, objectives, and Browser Use API configurations
- Tasks are stored in Supabase for users to access

### 3. Agent Creation
- Users create agents by providing:
  - Name and description
  - Configuration (JSON format)
  - Specific instructions for how the agent should interact with websites
  - Connection details for the Browser Use API

### 4. Submission
- Users submit their agents to specific tasks
- The submission is recorded in Supabase with a pending status

### 5. Execution
- The backend receives the submission and:
  - Creates a corresponding task in the Browser Use API
  - Sends agent instructions and task configuration
  - Polls the Browser Use API for status updates
  - Stores screenshots and recordings (if configured)
  - Logs all interactions for analysis

### 6. Evaluation
- After task completion:
  - Results are retrieved from Browser Use API
  - Metrics are calculated (score, accuracy, time taken)
  - The submission status is updated in Supabase
  - Detailed analysis is stored for user review

### 7. Leaderboard Update
- The system updates leaderboard rankings
- Metrics like success rate, efficiency, and time are factored into rankings
- Leaderboards can be filtered by task type or time period

### 8. User Interaction
- Users can:
  - View their submissions and status
  - Access detailed results and execution logs
  - Compare their agents' performance on leaderboards
  - Iterate and improve their agents based on feedback

## Technical Implementation

The system is divided into two main components:

1. **Backend (FastAPI + Supabase)**
   - Handles authentication and user management
   - Manages tasks and submissions
   - Interfaces with the Browser Use API
   - Processes and stores results

2. **Frontend (React + TailwindCSS)**
   - Provides user interface for all operations
   - Displays task listings and details
   - Shows submission status and results
   - Presents leaderboards and analytics
