from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
database_url = "sqlite:///database.db"
engine = create_engine(database_url)
Session = sessionmaker(bind=engine)


