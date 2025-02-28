from fastapi import HTTPException
from ..schemas.auth_schema import UserRegisterRequest, UserLoginRequest, TokenResponse
from ..services.auth_service import AuthService
from sqlalchemy.orm import Session

class AuthController:
    def __init__(self, db: Session):
        self.auth_service = AuthService(db)

    async def register(self, request: UserRegisterRequest) -> TokenResponse:
        try:
            tokens = self.auth_service.register_user(request.dict())
            return TokenResponse(**tokens)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def login(self, request: UserLoginRequest) -> TokenResponse:
        try:
            tokens = self.auth_service.login_user(
                email=request.email,
                password=request.password
            )
            return TokenResponse(**tokens)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))