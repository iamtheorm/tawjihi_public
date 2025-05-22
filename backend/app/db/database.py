from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Database configuration
DATABASE_URL = "postgresql://postgres:ritesh123@localhost:5432/tawjihai_test"

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    pool_size=5,  # Number of connections to keep open
    max_overflow=10,  # Maximum number of connections that can be created beyond pool_size
    pool_timeout=30,  # Seconds to wait before giving up on getting a connection from the pool
    pool_recycle=1800,  # Recycle connections after 30 minutes
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency
def get_db():
    """
    Dependency function that yields database sessions.
    Usage:
        @app.get("/")
        def read_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 