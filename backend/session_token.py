import jwt
import datetime
import secrets
SECRET_KEY = secrets.token_hex(32)

def createToken(id):
    payload = {
        "id": id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
