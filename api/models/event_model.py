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

class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    created_by = db.Column(db.Integer)
    created_at = db.Column(db.Integer)
    related_to = db.Column(db.Integer)
    related_clients = db.Column(db.Text(4294000000))
    related_pros = db.Column(db.Text(4294000000))
    related_admins = db.Column(db.Text(4294000000))
    status = db.Column(db.String(15))
    
    def __init__(self, name, created_by, clients, pros, admins, created_at, status, related_to):
        self.name = name
        self.created_by = created_by
        self.created_at = created_at
        self.related_clients = clients
        self.related_pros = pros
        self.related_admins = admins
        self.status = status
        self.related_to = related_to

class EventSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "name",
            "created_by",
            "created_at",
            "related_clients",
            "related_pros",
            "related_admins",
            "status",
            "related_to",
        )