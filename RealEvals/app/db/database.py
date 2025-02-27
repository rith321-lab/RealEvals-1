from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from ..core.config import settings
from loguru import logger
import os

DATABASE_URL = settings.DATABASE_URL
SQLITE_DB_FILE = "sql_app.db"

engine = create_engine(
    DATABASE_URL,
    echo=settings.DATABASE_LOGGING,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db(force_recreate: bool = True) -> None:
    try:
        if force_recreate:
            logger.info("Dropping all existing tables...")
            Base.metadata.drop_all(bind=engine)
            logger.info("All tables dropped successfully")

        logger.info("Creating all tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully")

        inspector = inspect(engine)
        tables = inspector.get_table_names()
        logger.info(f"Created tables: {', '.join(tables)}")

    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise

def remove_db():
    try:
        if os.path.exists(SQLITE_DB_FILE):
            os.remove(SQLITE_DB_FILE)
            logger.info(f"Removed existing database file: {SQLITE_DB_FILE}")
    except Exception as e:
        logger.error(f"Failed to remove database file: {str(e)}")
        raise