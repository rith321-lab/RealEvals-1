"""
Database connection module for Supabase integration
"""
import os
from typing import Optional, Dict, Any
from supabase import create_client, Client
from loguru import logger

# Global Supabase client instance
_supabase_client: Optional[Client] = None

# Supabase credentials
SUPABASE_URL = "https://mknvwcngwrcasddthvpt.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbnZ3Y25nd3JjYXNkZHRodnB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MjMwMDQsImV4cCI6MjA1NjI5OTAwNH0.Lg9K-ffTBtaI5Z6rToNfmjbOYfqQKaTKYHL50FRFn_E"

# Dummy Base class for SQLAlchemy compatibility
class Base:
    pass

def init_db(force_recreate: bool = False) -> Client:
    """
    Initialize and return the Supabase client
    
    Args:
        force_recreate: If True, force recreation of the client even if it already exists
        
    Returns:
        Initialized Supabase client
    """
    global _supabase_client
    
    # Re-create the client if requested or if it doesn't exist yet
    if _supabase_client is None or force_recreate:
        try:
            logger.info("Initializing Supabase client")
            
            # Create the Supabase client
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            logger.info("Supabase client initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Supabase client: {str(e)}")
            raise e
    
    return _supabase_client


def get_db() -> Client:
    """
    Get the initialized Supabase client
    
    Returns:
        The initialized Supabase client
    
    Raises:
        RuntimeError: If the database client has not been initialized
    """
    if _supabase_client is None:
        try:
            # Attempt to initialize the client if it doesn't exist
            return init_db()
        except Exception as e:
            error_msg = f"Database client not initialized and initialization failed: {str(e)}"
            logger.error(error_msg)
            raise RuntimeError(error_msg)
    
    return _supabase_client
