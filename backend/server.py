from flask import Flask, jsonify, request, make_response
from flask_socketio import SocketIO, emit
from engine import Session
from database import Account, BlacklistedToken
from flask_cors import CORS
from hashFunction import hashFunction
from session_token import createToken
from datetime import datetime 
from stops import stops
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

currentDelays = []
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

        hashed_password = hashFunction(password)
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
        if not username or not password:
            return jsonify({"message": "An error has occurred"}), 400
        hashed_password = hashFunction(password)
        user = session.query(Account).filter_by(username=username, password=hashed_password).first()
        if user:
            account_token = createToken(user.id)
            blacklistedToken = session.query(BlacklistedToken).filter_by(token=account_token).first()        
            if not blacklistedToken:
                response = make_response(jsonify({"message": "Logged in"}))
                response.set_cookie('token', account_token, httponly=True, secure=False, samesite='Lax')
                return response
            return jsonify({"message": "Token is not valid"}), 400
        return jsonify({"message": "Wrong information"}), 400
    finally:
        session.close()

@app.route('/logout', methods=["DELETE"])
def logout():
    session = Session()
    try:
        account_token = request.cookies.get('token')
        blacklistedToken = session.query(BlacklistedToken).filter_by(token=account_token).first()  
        if not blacklistedToken:
            newBlacklistedToken = BlacklistedToken(token=account_token)
            session.add(newBlacklistedToken)
            session.commit()
            response = make_response(jsonify({"message": "Logging off"}))
            response.delete_cookie('token')
            return response
        return jsonify({"message": "Token is already invalidated"}), 400
    finally:
        session.close()

@app.route('/stops', methods=['GET'])
def stopData():
    if stops:
        return jsonify({"stops": stops}), 200
    return jsonify({"message": "stops not found"}), 404

@socketio.on('delays')
def handle_delays(data):
    global currentDelays
    current_time = datetime.now().strftime('%H:%M:%S')
    current_time_split = current_time.split(":")
    if data:
        for delay in data:
            arrival = delay['arrivalTime'].split(":")
            if int(arrival[0]) == int(current_time_split[0]) and  int(arrival[1]) == int(current_time_split[1]):
                if delay['delay'] < 0:
                    currentDelays.append(f"The Tram number {delay['routeId']} will arrive at an estimated time of {delay['arrivalTime']} at {delay['stopName']} {abs(delay['delay'])}s earlier")
                else:
                    currentDelays.append(f"The Tram number {delay['routeId']} will arrive at an estimated time of {delay['arrivalTime']} at {delay['stopName']} {delay['delay']}s later")
        socketio.emit('delays', currentDelays[0:4])
        currentDelays = []
    


if __name__ == '__main__':
    socketio.run(app, debug=True)
