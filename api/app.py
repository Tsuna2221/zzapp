import datetime, random, string, os, jwt
from flask import Flask, jsonify, request, make_response, send_file
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from functools import wraps
from io import BytesIO

from routes.user_routes import UserRouter
from routes.event_routes import EventRouter
from routes.media_routes import MediaRouter
from routes.request_routes import RequestRouter

DB_USER = os.environ.get('DB_USER') if os.environ.get('DB_USER') else 'root'
DB_PASS = os.environ.get('DB_PASS') if os.environ.get('DB_PASS') else ''
DB_HOST = os.environ.get('DB_HOST') if os.environ.get('DB_HOST') else 'localhost:3308'
DB_NAME = os.environ.get('DB_HOST') if os.environ.get('DB_HOST') else 'zztestdb'

DB_URL = 'mysql+pymysql://'+ DB_USER +':'+ DB_PASS + '@' + DB_HOST + '/' + DB_NAME
    
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_RECYCLE'] = 280
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 20
app.config['UPLOAD_FOLDER'] = "/static"

CORS(app)

try:
    f = open('gmqs.txt', 'r')
    s_key = f.readline()
    f.close()

except:
    random_string = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(30))
    f = open("gmqs.txt", "w")
    f.write(random_string)
    f.close()

    s_key = random_string
    
#Init DB
db = SQLAlchemy(app)
ma = Marshmallow(app)
db.init_app(app)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('authorization')

        if token:
            if jwt.decode(token, s_key):
                return f(*args, **kwargs)
            else:
                return jsonify({"data": 'Token invalido'}), 401
        return jsonify({"data": 'Nenhum token encontrado'}), 401
    return decorated

@app.route('/', methods=['GET'])
def _main():
    return "v2"

@app.route('/validateuser', methods=['POST'])
def validate_user():
    try:
        return UserRouter.validate_user(s_key)
    except: 
        db.session.rollback()

@app.route('/createuser', methods=['POST'])
def create_user():
    return UserRouter.create_user()

@app.route('/send_reset_request', methods=['POST'])
def send_pass_request():
    return UserRouter.send_pass_request(s_key)

@app.route('/verify_request', methods=['POST'])
def verify_request():
    return UserRouter.verify_request()

@app.route('/reset_password', methods=['POST'])
def reset_password():
    return UserRouter.reset_password()

@app.route('/loguser', methods=['POST'])
@token_required
def get_user():
    return UserRouter.get_user(s_key)

@app.route('/getuser', methods=['GET'])
@token_required
def fetch_user():
    try:
        return UserRouter.fetch_user()
    except: 
        db.session.rollback()

@app.route('/getusers', methods=['GET'])
def get_users_by():
    try:
        return UserRouter.get_users_by()
    except: 
        db.session.rollback()

@app.route('/updatepass', methods=['PUT'])
@token_required
def update_password():
    return UserRouter.update_password()

@app.route('/updateaccount', methods=['PUT'])
@token_required
def update_account():
    return UserRouter.update_account()
 
@app.route('/deleteuser', methods=['DELETE'])
@token_required
def delete_user():
    return UserRouter.delete_user()

@app.route('/createevent', methods=['POST'])
@token_required
def create_event():
    return EventRouter.create_event()

@app.route('/updateevent', methods=['PUT'])
@token_required
def update_event():
    return EventRouter.update_event()

@app.route('/getevents', methods=['GET'])
@token_required
def get_events():
    return EventRouter.get_events()

@app.route('/getevent', methods=['GET'])
def get_event():
    return EventRouter.get_single()

@app.route('/deleteevents', methods=['DELETE'])
@token_required
def delete_events():
    return EventRouter.delete_events()

@app.route('/uploaddata', methods=['POST'])
@token_required
def upload_event_data():
    return MediaRouter.upload_event_data()

@app.route('/deleteeventdata', methods=['DELETE'])
@token_required
def delete_event_data():
    return MediaRouter.delete_event_data()

@app.route('/createrequest', methods=['POST'])
@token_required
def post_request():
    return RequestRouter.post_request()

@app.route('/getrequests', methods=['GET'])
def get_requests():
    return RequestRouter.get_requests()

@app.route('/updaterequest', methods=['PUT'])
@token_required
def update_request():
    return RequestRouter.request_status()

@app.route('/getconfig', methods=['GET'])
@token_required
def get_config():
    return RequestRouter.get_config()

@app.route('/getportfolios', methods=['GET'])
@token_required
def get_portfolios():
    return EventRouter.get_portfolios()

@app.route('/updateconfig', methods=['PUT'])
@token_required
def update_config():
    return RequestRouter.update_config()

@app.route('/setrequest', methods=['PUT'])
@token_required
def set_request():
    return RequestRouter.update_request()

if __name__ == '__main__':
    app.run(debug=True)