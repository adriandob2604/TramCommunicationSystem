from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db_access import database_url

engine = create_engine(database_url)
Session = sessionmaker(bind=engine)


