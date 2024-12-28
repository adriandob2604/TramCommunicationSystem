from flask import Flask, jsonify, request
from engine import Session
from database import Account
import hashlib

app = Flask(__name__)
session = Session()


@app.route('/create_account', methods=["POST"])
def create_account():
    account_information = request.get_json()
    username, password, name, surname, email, phone_number = account_information['username'], account_information['password'], 
    account_information["name"], account_information["surname"],
    account_information["email"], account_information["phone_number"]
    if name and surname and email and phone_number:
        hash = hashlib.sha256()
        hash.update(password.encode())
        hashed_password = hash.hexdigest()
        new_account = Account(username, hashed_password, name, surname, email, phone_number)
        if not session.query(Account).filter(Account['surname'] == surname):
            session.add(new_account)
            session.commit()
            session.close()
            return jsonify({"message": "Account successfully created"}), 201
        return jsonify({"message": "Account already exists"}), 400
    return jsonify({"message": "Enter valid account information"}), 400
@app.route('/accounts/<id>', methods=["GET"])
def account(id):
    account = session.query(Account).filter_by(id=id).first()
    if account:
        return jsonify({"message": "Account found!", "account": account}), 200
    return jsonify({"message": "Account not found"}), 404

@app.route('/accounts/<id>', methods=["PATCH"])
def update_account(id):
    update_data = request.get_json()
    account = session.query(Account).filter_by(id=id)
    if account:
        if update_data:
            if 'name' in update_data:
                account['name'] = update_data['name']
            if 'surname' in update_data:
                account['surname'] = update_data['surname']
            if 'email' in update_data:
                account['email'] = update_data['email']
            if 'phone_number' in update_data:
                account['phone_number'] = update_data['phone_number']
            return jsonify({"message": "Account successfully updated"}), 200
        return jsonify({"message": "No update data"}), 400
    return jsonify({"message": "Account not found"}), 404

@app.route('/accounts/<id>', methods=["DELETE"])
def delete_account(id):
    account = session.query(Account).filter_by(id=id)
    if account:
        session.pop(account)
        return jsonify({"message": "Account successfully deleted"}), 200
    return jsonify({"message": "Account not found"}), 404

@app.route('/login')
def login():
    login_data = request.get_json()
    username, password = login_data['username'], login_data['password']
    hash = hashlib.sha256()
    hash.update(password.encode())
    hashed_password = hash.hexdigest()
    if username and password:
        if session.query(Account).filter_by(username=username, password=hashed_password):
            return jsonify({"message": "Successfully logged in"}), 200
        return jsonify({"message": "Wrong information"}), 400
    return jsonify({"message": "Enter valid information"}), 400

if __name__ == '__main__':
    app.run(debug=True)