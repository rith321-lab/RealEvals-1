from app.db.database import get_db
import json

db = get_db()

# Create the agents table with the correct schema
try:
    # Define the SQL to create the agents table
    sql = """
    CREATE TABLE IF NOT EXISTS agents (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES users(id),
        configuration JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE
    );
    """
    
    # Execute the SQL
    db.execute(sql)
    print("Successfully created agents table")
    
    # Try to insert a test agent
    test_agent = {
        "id": "00000000-0000-0000-0000-000000000001",
        "name": "Test Agent",
        "user_id": "14f7dbdb-a08e-4c70-ba35-c8f71ca41520",  # testuser123@example.com
        "configuration": json.dumps({
            "model": "gpt-4",
            "temperature": 0.7
        })
    }
    
    # Try to insert the test agent
    response = db.table("agents").insert(test_agent).execute()
    print("Successfully created test agent")
    print("Agent data:", response.data[0])
    
except Exception as e:
    print(f"Error creating agents table: {str(e)}")
