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

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(300))
    account_type = db.Column(db.String(10))
    mentor_id = db.Column(db.Integer, nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    portfolio = db.Column(db.String(300), nullable=True)
    rating_pro = db.Column(db.String(20), nullable=True)
    rating_general = db.Column(db.Integer, nullable=True)
    evt_rating_civil = db.Column(db.Integer, nullable=True)
    evt_rating_baptism = db.Column(db.Integer, nullable=True)
    evt_rating_essay = db.Column(db.Integer, nullable=True)
    evt_rating_wedding = db.Column(db.Integer, nullable=True)
    evt_rating_corp = db.Column(db.Integer, nullable=True)
    evt_rating_debut = db.Column(db.Integer, nullable=True)
    evt_rating_birthday = db.Column(db.Integer, nullable=True)
    avatar_id = db.Column(db.Integer, nullable=True)
    banner_id = db.Column(db.Integer, nullable=True)
    rg = db.Column(db.String(20), nullable=True)
    cpf = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.String(20))
    updated_at = db.Column(db.String(20))
    about_me = db.Column(db.String(500))
    status = db.Column(db.String(15))
    services = db.Column(db.String(100))

    def __init__(
        self,
        name,
        email,
        password,
        account_type,
        mentor_id,
        phone_number,
        portfolio,
        rating_pro,
        rating_general,
        evt_rating_civil,
        evt_rating_baptism,
        evt_rating_essay,
        evt_rating_wedding,
        evt_rating_corp,
        evt_rating_debut,
        evt_rating_birthday,
        avatar_id,
        banner_id,
        rg,
        cpf,
        created_at,
        updated_at,
        about_me,
        status,
        services
    ):
        self.name = name
        self.email = email
        self.password = password
        self.account_type = account_type
        self.mentor_id = mentor_id
        self.phone_number = phone_number
        self.portfolio = portfolio
        self.rating_pro = rating_pro
        self.rating_general = rating_general
        self.evt_rating_civil = evt_rating_civil
        self.evt_rating_baptism = evt_rating_baptism
        self.evt_rating_essay = evt_rating_essay
        self.evt_rating_wedding = evt_rating_wedding
        self.evt_rating_corp = evt_rating_corp
        self.evt_rating_debut = evt_rating_debut
        self.evt_rating_birthday = evt_rating_birthday
        self.avatar_id = avatar_id
        self.banner_id = banner_id
        self.rg = rg
        self.cpf = cpf
        self.created_at = created_at
        self.updated_at = updated_at
        self.about_me = about_me
        self.status = status
        self.services = services

class UserSchema(ma.Schema):
    class Meta:
        fields = (
            'id',
            'name',
            'email',
            'account_type',
            'mentor_id',
            'phone_number',
            'portfolio',
            'rating_pro',
            'rating_general',
            'evt_rating_civil',
            'evt_rating_baptism',
            'evt_rating_essay',
            'evt_rating_wedding',
            'evt_rating_corp',
            'evt_rating_debut',
            'evt_rating_birthday',
            'avatar_id',
            'banner_id',
            'rg',
            'cpf',
            'created_at',
            'updated_at',
            'about_me',
            'status',
            'services'
        )