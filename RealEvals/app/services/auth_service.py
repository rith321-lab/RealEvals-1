from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Union, Any
from jose import jwt
from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..core.config import settings
from ..models.models import User
from ..models.enums import UserRole
import uuid

class AuthService:
    def __init__(self, db: Session):
        self._db = db
        self._password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def _get_hashed_password(self, password: str) -> str:
        return self._password_context.hash(password)

    def _verify_password(self, password: str, hashed_pass: str) -> bool:
        return self._password_context.verify(password, hashed_pass)

    def _create_access_token(self, subject: uuid.UUID) -> str:
        expires_delta = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode = {"exp": expires_delta, "sub": str(subject)}
        return jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)

    def _create_refresh_token(self, subject: uuid.UUID) -> str:
        expires_delta = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)  
        to_encode = {"exp": expires_delta, "sub": str(subject)}
        return jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM) 

    def register_user(self, user_data: dict) -> dict:
        try:
            
            existing_user = self._db.query(User).filter(User.email == user_data["email"]).first()
            if existing_user:
                raise HTTPException(
                    status_code=400,
                    detail="Email already registered"
                )

            # Create user
            new_user = User(
                email=user_data["email"],
                password=self._get_hashed_password(user_data["password"]),
                firstName=user_data["firstName"],
                lastName=user_data.get("lastName"),
                role=user_data.get("role", UserRole.USER)
            )
            
            self._db.add(new_user)
            self._db.commit()
            self._db.refresh(new_user)

            return {
                "access_token": self._create_access_token(new_user.id),
                "refresh_token": self._create_refresh_token(new_user.id),
                "token_type": "bearer",
                 "role":new_user.role
            }

        except Exception as e:
            self._db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    def login_user(self, email: str, password: str) -> dict:
        try:
            user = self._db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password"
                )

            if not self._verify_password(password, user.password):
                raise HTTPException(
                    status_code=401,
                    detail="Invalid email or password"
                )

        
            user.lastLoginAt = datetime.utcnow()
            user.loginCount += 1
            self._db.commit()

            return {
                "access_token": self._create_access_token(user.id),
                "refresh_token": self._create_refresh_token(user.id),
                "token_type": "bearer",
                "role":user.role
            }

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))