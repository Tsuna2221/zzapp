from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow 
import os,sys,inspect
current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir) 
from keys import DB_URL

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

#Init DB
db = SQLAlchemy(app)
ma = Marshmallow(app)

class Avatar(db.Model):
    __tablename__ = 'user_media'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    avatar_name = db.Column(db.String(500))
    banner_name = db.Column(db.String(500))

    def __init__(self, user_id, avatar_name, banner_name):
        self.user_id = user_id
        self.avatar_name = avatar_name
        self.banner_name = banner_name

class AvatarSchema(ma.Schema):
    class Meta:
        fields = (
            "user_id",
            "avatar_name",
            "banner_name",
        )