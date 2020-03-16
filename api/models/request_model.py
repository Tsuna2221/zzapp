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


class Request(db.Model):
    __tablename__ = 'requests'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(40))
    result = db.Column(db.String(40))
    duration = db.Column(db.Integer)
    level = db.Column(db.String(500))
    client_id = db.Column(db.Integer)
    set = db.Column(db.Text(4294000000))
    total = db.Column(db.String(500))
    discount = db.Column(db.String(500))
    total_outros = db.Column(db.String(500))
    total_servicos = db.Column(db.String(500))
    total_eventos = db.Column(db.String(500))
    status = db.Column(db.String(15))
    date = db.Column(db.String(10))
    hour = db.Column(db.String(5))
    notification = db.Column(db.String(15))

    def __init__(self, type, duration, level, client_id, set, total, discount, total_outros, total_servicos, total_eventos, status, date, hour, notification, result):
        self.type = type
        self.duration = duration
        self.level = level
        self.client_id = client_id
        self.set = set
        self.total = total
        self.discount = discount
        self.total_outros = total_outros
        self.total_servicos = total_servicos
        self.total_eventos = total_eventos
        self.status = status
        self.date = date
        self.hour = hour
        self.notification = notification
        self.result = result

class RequestSchema(ma.Schema):
    class Meta:
        fields = (
            "id",
            "type",
            "duration",
            "level",
            "client_id",
            "set",
            "total",
            "discount",
            "total_outros",
            "total_servicos",
            "total_eventos",
            "status",
            "date",
            "hour",
            "notification",
            "result"
        )