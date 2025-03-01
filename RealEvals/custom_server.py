"""
Custom server script that directly creates a FastAPI app within the RealEvals directory
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create a simple FastAPI app
app = FastAPI(
    title="RealEvals API",
    version="1.0.0",
    description="RealEvals API for AI agent evaluation with Supabase integration",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set Supabase credentials in environment
os.environ["SUPABASE_URL"] = "https://mknvwcngwrcasddthvpt.supabase.co"
os.environ["SUPABASE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbnZ3Y25nd3JjYXNkZHRodnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MjMwMDQsImV4cCI6MjA1NjI5OTAwNH0.Lg9K-ffTBtaI5Z6rToNfmjbOYfqQKaTKYHL50FRFn_E"

# Import directly from relative paths
from app.db.database import init_db, get_db

# Health check route
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app_name": "RealEvals API",
        "environment": "development",
        "supabase_integration": "active"
    }

# Test Supabase connection route
@app.get("/test-supabase", tags=["Test"])
async def test_supabase():
    try:
        # Get Supabase client
        supabase = get_db()
        
        # Test query to users table
        result = supabase.table("users").select("*").limit(5).execute()
        
        return {
            "status": "success",
            "connection": "established",
            "user_count": len(result.data) if result.data else 0,
            "message": "Successfully connected to Supabase"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# Initialize database on startup
@app.on_event("startup")
async def startup():
    try:
        init_db(force_recreate=False)
        print("Database initialized successfully")
    except Exception as e:
        print(f"Failed to initialize database: {str(e)}")
        raise e

# Run the app directly when this script is executed
if __name__ == "__main__":
    print("Starting RealEvals API with Supabase integration...")
    uvicorn.run("custom_server:app", host="0.0.0.0", port=8000, reload=True)
