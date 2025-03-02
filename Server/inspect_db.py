from app.db.database import get_db
import json

db = get_db()

# Get the schema for the agents table
response = db.table('agents').select('*').limit(1).execute()
if response.data:
    print('Agents table schema:')
    for key in response.data[0].keys():
        print(f'- {key}')
else:
    print('No agents found in the database')

# Get the schema for the tasks table
response = db.table('tasks').select('*').limit(1).execute()
if response.data:
    print('\nTasks table schema:')
    for key in response.data[0].keys():
        print(f'- {key}')
else:
    print('No tasks found in the database')

# Check if the current user has admin privileges
response = db.table('users').select('*').limit(10).execute()
if response.data:
    print('\nUsers in the database:')
    for user in response.data:
        print(f'- {user.get("email")}: role={user.get("role")}')
else:
    print('No users found in the database')
