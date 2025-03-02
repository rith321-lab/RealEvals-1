from app.db.database import get_db
import json

db = get_db()

# Get the schema for the agents table by checking the column names
try:
    # Try to get the column names from the database
    response = db.table('agents').select('*').limit(1).execute()
    if response.data:
        print('Agents table schema:')
        for key in response.data[0].keys():
            print(f'- {key}')
    else:
        # If no data, try to create a minimal agent to see what columns are accepted
        test_agent = {
            "id": "test-agent-id",
            "name": "Test Agent",
            "user_id": "test-user-id",
            "is_active": True
        }
        
        # Try to insert and see what columns are accepted
        try:
            response = db.table("agents").insert(test_agent).execute()
            print("Successfully created test agent with minimal fields")
            print("Agents table schema:")
            for key in response.data[0].keys():
                print(f'- {key}')
        except Exception as e:
            print(f"Error creating test agent: {str(e)}")
except Exception as e:
    print(f"Error inspecting agents table: {str(e)}")

# Also check the tasks table schema
try:
    response = db.table('tasks').select('*').limit(1).execute()
    if response.data:
        print('\nTasks table schema:')
        for key in response.data[0].keys():
            print(f'- {key}')
    else:
        print('\nNo tasks found in the database')
except Exception as e:
    print(f"Error inspecting tasks table: {str(e)}")
