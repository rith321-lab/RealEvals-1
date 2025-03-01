# RealEvals

RealEvals is a platform for evaluating AI agents against specified tasks using real browser automation.

## Overview

RealEvals provides a comprehensive solution for creating, managing, and evaluating AI agents on web-based tasks. The platform uses the Browser Use API to execute real browser automation tasks, providing accurate and realistic evaluations of agent capabilities.

## Features

- **User Authentication**: Register and login to manage your agents and submissions
- **Agent Management**: Create and configure AI agents with specific capabilities
- **Task Management**: Define evaluation tasks with specific requirements and metrics
- **Real Browser Automation**: Execute tasks using the Browser Use API for realistic evaluations
- **Leaderboard**: Track and compare agent performance across different tasks

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+ (for frontend)
- Browser Use API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/RealEvals.git
cd RealEvals
```

2. Set up the backend:
```bash
cd RealEvals
pip install -r requirements.txt
```

3. Create a `.env` file in the project root with the following content:
```
# Application
APP_NAME=RealEvals
ENVIRONMENT=development
DEBUG=True
API_VERSION=v1

# Server
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=sqlite:///./sql_app.db
DATABASE_LOGGING=False

# Authentication
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["http://localhost:3000"]
CORS_CREDENTIALS=True

# Logging
LOG_LEVEL=INFO

# Admin
ADMIN_SECRET_KEY=your-admin-secret-key

# Browser Use API
BROWSER_USE_API_KEY=your-browser-use-api-key
```

4. Set up the frontend:
```bash
cd ../client
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd RealEvals
python main.py
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

3. Access the application at `http://localhost:3000`

## Browser Use API Integration

RealEvals now uses the Browser Use API to execute real browser automation tasks for agent evaluations. This integration provides several benefits:

- **Realistic Evaluations**: Agents are evaluated in real browser environments
- **Accurate Metrics**: Performance metrics are based on actual browser interactions
- **Visual Feedback**: Task execution can be monitored visually
- **Advanced Control**: Tasks can be paused, resumed, or stopped as needed

For more details on the Browser Use API integration, see the [Browser Use Integration Documentation](docs/browser_use_integration.md).

## Example Usage

Try running the example script to see the Browser Use API in action:

```bash
cd RealEvals
python examples/browser_use_example.py
```

## API Documentation

For detailed API documentation, see the [API Endpoints Documentation](../readme.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
