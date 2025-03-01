from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.database import init_db
from loguru import logger
from app.api.v1.auth import router as auth_router
from app.api.v1 import tasks , agents , submission


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.API_VERSION,
        debug=settings.DEBUG,
        description="RealEvals API for AI agent evaluation",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS_LIST,
        allow_credentials=settings.CORS_CREDENTIALS,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix="/api/v1")
    app.include_router(tasks.router, prefix="/api/v1")
    app.include_router(agents.router, prefix="/api/v1")
    app.include_router(submission.router, prefix="/api/v1")


    @app.on_event("startup")
    async def startup():
        try:
            init_db(force_recreate=False)
            logger.info(f"Starting {settings.APP_NAME} in {settings.ENVIRONMENT} environment")
        except Exception as e:
            logger.error(f"Failed to start application: {str(e)}")
            raise e

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "status": "healthy",
            "app_name": settings.APP_NAME,
            "environment": settings.ENVIRONMENT
        }

    return app

app = create_application()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )