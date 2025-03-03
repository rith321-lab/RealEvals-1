from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from ..models.enums import UserRole
from ..db.database import get_db
from .config import settings
from uuid import UUID
from pydantic import BaseModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# Pydantic model for User
class UserModel(BaseModel):
    id: str
    email: str
    firstName: str
    lastName: str | None = None
    role: str
    isActive: bool = True
    isEmailVerified: bool = False
    
    class Config:
        from_attributes = True

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db = Depends(get_db)
) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, 
            settings.JWT_SECRET_KEY, 
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id = payload.get("sub")

        if not user_id:
            raise credentials_exception

        print("Token Payload:", payload)

        try:
            user_uuid = UUID(str(user_id))
        except ValueError:
            raise credentials_exception

        # Use Supabase client to get user
        response = db.table("users").select("*").eq("id", str(user_uuid)).execute()
        
        if not response.data or len(response.data) == 0:
            raise credentials_exception
            
        user_data = response.data[0]
        user = UserModel(**user_data)
        
        return user

    except JWTError as e:
        print("JWT Error:", str(e))
        raise credentials_exception
    except Exception as e:
        print("Unexpected Error:", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

async def get_current_admin(
    current_user: UserModel = Depends(get_current_user)
) -> UserModel:
    if current_user.role != UserRole.ADMIN and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can perform this action"
        )
    return current_user
