import jwt
import datetime
import os
from dotenv import load_dotenv
load_dotenv("key.env")
SECRET_KEY = os.getenv("SECRET_KEY")
def createToken(id):
    payload = {
        "id": id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
