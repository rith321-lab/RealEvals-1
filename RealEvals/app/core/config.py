from pydantic_settings import BaseSettings
from typing import List
import json
import os

class Settings(BaseSettings):
    APP_NAME: str
    ENVIRONMENT: str
    DEBUG: bool
    API_VERSION: str
    HOST: str
    PORT: int
    DATABASE_URL: str
    DATABASE_LOGGING: bool
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    CORS_ORIGINS: str
    CORS_CREDENTIALS: bool
    LOG_LEVEL: str
    ADMIN_SECRET_KEY: str
    BROWSER_USE_API_KEY: str = "your_api_key_here"  # Default placeholder, should be set in .env
    
    # Supabase settings
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()