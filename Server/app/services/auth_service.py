from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Union, Any, Dict
from jose import jwt
from fastapi import HTTPException
from supabase import Client
from ..core.config import settings
from ..models.enums import UserRole
import uuid
from ..db.database import get_db

class AuthService:
    def __init__(self, db: Client = None):
        from ..db.database import get_db
        self._db = db if db else get_db()
        self._password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def _get_hashed_password(self, password: str) -> str:
        return self._password_context.hash(password)

    def _verify_password(self, password: str, hashed_pass: str) -> bool:
        return self._password_context.verify(password, hashed_pass)

    def _create_access_token(self, subject: str) -> str:
        expires_delta = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {"exp": expires_delta, "sub": subject}
        return jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)

    def _create_refresh_token(self, subject: str) -> str:
        expires_delta = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)  
        to_encode = {"exp": expires_delta, "sub": subject}
        return jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM) 
        
    async def dev_login(self) -> Dict[str, str]:
        """Development-only method to get an admin token without password"""
        try:
            # Get admin user
            response = self._db.table("users").select("*").eq("role", "ADMIN").limit(1).execute()
            
            if not response.data or len(response.data) == 0:
                # Create a temporary admin user if none exists
                admin_user = {
                    "id": str(uuid.uuid4()),
                    "email": "admin@example.com",
                    "firstName": "Admin",
                    "lastName": "User",
                    "role": "ADMIN",
                    "isActive": True,
                    "isEmailVerified": True,
                    "password": self._get_hashed_password("admin123")  # Default password for dev
                }
                result = self._db.table("users").insert(admin_user).execute()
                if result.data:
                    user_id = result.data[0]["id"]
                    user_role = "ADMIN"
                else:
                    raise HTTPException(status_code=500, detail="Failed to create admin user")
            else:
                user_id = response.data[0]["id"]
                user_role = response.data[0].get("role", "ADMIN")
                
            # Generate token
            access_token = self._create_access_token(user_id)
            refresh_token = self._create_refresh_token(user_id)
            
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer",
                "role": user_role
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Dev login error: {str(e)}")

    def register_user(self, user_data: dict) -> dict:
        try:
            # Check if user exists with this email
            result = self._db.table("users").select("*").eq("email", user_data["email"]).execute()
            if result.data:
                raise HTTPException(
                    status_code=400,
                    detail="Email already registered"
                )

            # Create user
            new_user_data = {
                "email": user_data["email"],
                "password": self._get_hashed_password(user_data["password"]),
                "firstName": user_data["firstName"],
                "lastName": user_data.get("lastName"),
                "role": user_data.get("role", UserRole.USER),
                "isActive": True,
                "isEmailVerified": False,
                "loginCount": 0
            }
            
            result = self._db.table("users").insert(new_user_data).execute()
            
            if not result.data:
                raise HTTPException(status_code=500, detail="Failed to create user")
            
            new_user = result.data[0]

            return {
                "access_token": self._create_access_token(new_user["id"]),
                "refresh_token": self._create_refresh_token(new_user["id"]),
                "token_type": "bearer",
                "role": new_user["role"]
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def login_user(self, email: str, password: str) -> dict:
        try:
            # Find user by email
            result = self._db.table("users").select("*").eq("email", email).execute()
            
            if not result.data:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password"
                )
            
            user = result.data[0]

            if not self._verify_password(password, user["password"]):
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password"
                )

            # Update login stats
            now = datetime.utcnow().isoformat()
            login_count = user["loginCount"] + 1 if "loginCount" in user and user["loginCount"] is not None else 1
            
            self._db.table("users").update({
                "lastLoginAt": now,
                "loginCount": login_count
            }).eq("id", user["id"]).execute()

            return {
                "access_token": self._create_access_token(user["id"]),
                "refresh_token": self._create_refresh_token(user["id"]),
                "token_type": "bearer",
                "role": user["role"]
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
