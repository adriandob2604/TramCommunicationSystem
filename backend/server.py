from flask import Flask, jsonify, request
from engine import Session
from database import Account
from flask_cors import CORS
import hashlib

app = Flask(__name__)
CORS(app)
@app.route('/create_account', methods=["POST"])
def create_account():
    session = Session()
    try:
        account_information = request.get_json()
        required_fields = ["username", "password", "name", "surname", "email", "phone_number"]
        if not all(field in account_information for field in required_fields):
            return jsonify({"message": "Missing account information"}), 400

        username = account_information["username"]
        password = account_information["password"]
        name = account_information["name"]
        surname = account_information["surname"]
        email = account_information["email"]
        phone_number = account_information["phone_number"]

        if session.query(Account).filter((Account.username == username) | (Account.email == email)).first():
            return jsonify({"message": "Account with this username or email already exists"}), 400

        hash = hashlib.sha256()
        hash.update(password.encode())
        hashed_password = hash.hexdigest()

        new_account = Account(username=username, password=hashed_password, name=name, surname=surname, email=email, phone_number=phone_number)
        session.add(new_account)
        session.commit()
        return jsonify({"message": "Account successfully created"}), 201
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
    finally:
        session.close()

@app.route('/accounts/<int:id>', methods=["GET"])
def account(id):
    session = Session()
    try:
        account = session.query(Account).filter_by(id=id).first()
        if account:
            return jsonify({
                "message": "Account found!",
                "account": {
                    "id": account.id,
                    "username": account.username,
                    "name": account.name,
                    "surname": account.surname,
                    "email": account.email,
                    "phone_number": account.phone_number
                }
            }), 200
        return jsonify({"message": "Account not found"}), 404
    finally:
        session.close()

@app.route('/accounts/<int:id>', methods=["PATCH"])
def update_account(id):
    session = Session()
    try:
        update_data = request.get_json()
        account = session.query(Account).filter_by(id=id).first()
        if account:
            if 'name' in update_data:
                account.name = update_data['name']
            if 'surname' in update_data:
                account.surname = update_data['surname']
            if 'email' in update_data:
                account.email = update_data['email']
            if 'phone_number' in update_data:
                account.phone_number = update_data['phone_number']
            session.commit()
            return jsonify({"message": "Account successfully updated"}), 200
        return jsonify({"message": "Account not found"}), 404
    finally:
        session.close()

@app.route('/accounts/<int:id>', methods=["DELETE"])
def delete_account(id):
    session = Session()
    try:
        account = session.query(Account).filter_by(id=id).first()
        if account:
            session.delete(account)
            session.commit()
            return jsonify({"message": "Account successfully deleted"}), 204
        return jsonify({"message": "Account not found"}), 404
    finally:
        session.close()

@app.route('/login', methods=["POST"])
def login():
    session = Session()
    try:
        login_data = request.get_json()
        username = login_data['username']
        password = login_data['password']
        hash = hashlib.sha256()
        hash.update(password.encode())
        hashed_password = hash.hexdigest()
        user = session.query(Account).filter_by(username=username, password=hashed_password).first()
        if user:
            return jsonify({"message": "Successfully logged in"}), 200
        return jsonify({"message": "Wrong information"}), 400
    finally:
        session.close()

if __name__ == '__main__':
    app.run(debug=True)
