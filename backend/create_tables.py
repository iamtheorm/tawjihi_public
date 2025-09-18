from app.db.database import Base, engine
from app.models.models import *

# Create all tables
Base.metadata.create_all(bind=engine)
print("All tables created successfully!")
