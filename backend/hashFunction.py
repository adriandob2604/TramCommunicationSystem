import hashlib
def hashFunction(password):
    hash = hashlib.sha256()
    hash.update(password.encode())
    return hash.hexdigest()