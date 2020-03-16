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

class Media(db.Model):
    __tablename__ = 'medias'

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer)
    media_type = db.Column(db.String(20))
    media_name = db.Column(db.String(500))
    media_size = db.Column(db.Integer)

    def __init__(self, media_name, event_id, media_size, media_type):
        self.media_name = media_name
        self.event_id = event_id
        self.media_size = media_size
        self.media_type = media_type

class MediaSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "media_name",
            "event_id",
            "media_size",
            "media_type",
        )