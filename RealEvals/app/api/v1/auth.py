from fastapi import APIRouter, Depends
from ...db.database import get_db
from ...controllers.auth_controller import AuthController
from ...schemas.auth_schema import UserRegisterRequest, UserLoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(request: UserRegisterRequest, db = Depends(get_db)):
    controller = AuthController(db)
    return await controller.register(request)

@router.post("/login", response_model=TokenResponse)
async def login(request: UserLoginRequest, db = Depends(get_db)):
    controller = AuthController(db)
    return await controller.login(request)