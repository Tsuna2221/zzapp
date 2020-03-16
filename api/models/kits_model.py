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

class Kits(db.Model):
    __tablename__ = 'kits'

    id = db.Column(db.Integer, primary_key=True)
    retrospectiva = db.Column(db.Integer)
    wedding_story = db.Column(db.Integer)
    quadro_60x80cm = db.Column(db.Integer)
    premium_30x30cm_box = db.Column(db.Integer)
    master_30x30cm_box = db.Column(db.Integer)
    premium_24x30cm_box = db.Column(db.Integer)
    master_24x30cm_box = db.Column(db.Integer)
    master_20x30cm_box = db.Column(db.Integer)
    sogra_premium_15x15cm_box = db.Column(db.Integer)
    sogra_master_15x15cm_box = db.Column(db.Integer)
    locucao_2_min = db.Column(db.Integer)
    trilha_sonora = db.Column(db.Integer)
    kit_resultado = db.Column(db.Integer)
    pencard = db.Column(db.Integer)

    def __init__(
        self, 
        retrospectiva,
        wedding_story,
        quadro_60x80cm,
        premium_30x30cm_box,
        master_30x30cm_box,
        premium_24x30cm_box,
        master_24x30cm_box,
        master_20x30cm_box,
        sogra_premium_15x15cm_box,
        sogra_master_15x15cm_box,
        locucao_2_min,
        trilha_sonora,
        kit_resultado,
        pencard,
    ):
        self.retrospectiva = retrospectiva
        self.wedding_story = wedding_story
        self.quadro_60x80cm = quadro_60x80cm
        self.premium_30x30cm_box = premium_30x30cm_box
        self.master_30x30cm_box = master_30x30cm_box
        self.premium_24x30cm_box = premium_24x30cm_box
        self.master_24x30cm_box = master_24x30cm_box
        self.master_20x30cm_box = master_20x30cm_box
        self.sogra_premium_15x15cm_box = sogra_premium_15x15cm_box
        self.sogra_master_15x15cm_box = sogra_master_15x15cm_box
        self.locucao_2_min = locucao_2_min
        self.trilha_sonora = trilha_sonora
        self.kit_resultado = kit_resultado
        self.pencard = pencard

class KitsSchema(ma.Schema):
    class Meta:
        fields = (
            'retrospectiva', 
            'wedding_story', 
            'quadro_60x80cm',
            'premium_30x30cm_box', 
            'master_30x30cm_box', 
            'premium_24x30cm_box', 
            'master_24x30cm_box', 
            'master_20x30cm_box',
            'sogra_premium_15x15cm_box', 
            'sogra_master_15x15cm_box', 
            'locucao_2_min', 
            'trilha_sonora', 
            'kit_resultado',
            'pencard', 
        )