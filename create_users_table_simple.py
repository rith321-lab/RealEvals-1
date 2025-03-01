"""
Simple script to create users table in Supabase
"""
from supabase import create_client
import time
import sys

# Supabase configuration
SUPABASE_URL = "https://mknvwcngwrcasddthvpt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbnZ3Y25nd3JjYXNkZHRodnB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDcyMzAwNCwiZXhwIjoyMDU2Mjk5MDA0fQ.oDm3j6kYyFb6kGOVwRCZnYf5NNfSdebSlR6naUfEBCs"

print("Starting Supabase connection...")
print(f"URL: {SUPABASE_URL}")
print(f"Key: {SUPABASE_KEY[:10]}...{SUPABASE_KEY[-10:]}")

try:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Successfully connected to Supabase!")
    
    # Create a simple users table
    print("Creating users table with basic schema...")
    
    # Drop the table if it exists (for clean setup)
    try:
        supabase.rpc('execute_sql', {'query': 'DROP TABLE IF EXISTS users;'}).execute()
        print("Dropped existing users table")
    except Exception as e:
        print(f"Error dropping table: {str(e)}")
    
    # Create the table
    try:
        create_table_sql = """
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR NOT NULL UNIQUE,
            firstName VARCHAR NOT NULL,
            lastName VARCHAR,
            password VARCHAR NOT NULL,
            role VARCHAR NOT NULL,
            isActive BOOLEAN NOT NULL DEFAULT TRUE,
            createdAt TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        """
        
        supabase.rpc('execute_sql', {'query': create_table_sql}).execute()
        print("Successfully created users table!")
        
        # Insert a test user
        print("Inserting test user...")
        test_user = {
            "email": "test@example.com",
            "firstName": "Test",
            "lastName": "User",
            "password": "hashed_password_here",
            "role": "USER"
        }
        
        result = supabase.table('users').insert(test_user).execute()
        print(f"Test user created with ID: {result.data[0]['id'] if result.data else 'unknown'}")
        
        # List users
        print("Listing users...")
        users = supabase.table('users').select('*').execute()
        print(f"Found {len(users.data)} users:")
        for user in users.data:
            print(f"  - {user['firstName']} {user['lastName']} ({user['email']})")
        
    except Exception as e:
        print(f"Error creating table or inserting data: {str(e)}")
    
except Exception as e:
    print(f"Failed to connect to Supabase: {str(e)}")
    sys.exit(1)

print("Script completed!")
