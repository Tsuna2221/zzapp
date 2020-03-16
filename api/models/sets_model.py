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

class Sets(db.Model):
    __tablename__ = 'sets'

    id = db.Column(db.Integer, primary_key=True)
    civil = db.Column(db.String(20))
    batizado = db.Column(db.String(20))
    ensaio = db.Column(db.String(20))
    casamento = db.Column(db.String(20))
    corporativo = db.Column(db.String(20))
    debutante = db.Column(db.String(20))
    aniversario = db.Column(db.String(20))
    making_of = db.Column(db.String(20))
    making_of_noivo = db.Column(db.String(20))
    video_edicao = db.Column(db.String(20))
    tratamento_fotos = db.Column(db.String(20))
    diagramação_album = db.Column(db.String(20))
    ensaio_pre_evento = db.Column(db.String(20))

    def __init__(
        self, 
        civil,
        batizado,
        ensaio,
        casamento,
        corporativo,
        debutante,
        aniversario,
        making_of,
        making_of_noivo,
        video_edicao,
        tratamento_fotos,
        diagramação_album,
        ensaio_pre_evento,
    ):
        self.civil = civil
        self.batizado = batizado
        self.ensaio = ensaio
        self.casamento = casamento
        self.corporativo = corporativo
        self.debutante = debutante
        self.aniversario = aniversario
        self.making_of = making_of
        self.making_of_noivo = making_of_noivo
        self.video_edicao = video_edicao
        self.tratamento_fotos = tratamento_fotos
        self.diagramação_album = diagramação_album
        self.ensaio_pre_evento = ensaio_pre_evento

class SetsSchema(ma.Schema):
    class Meta:
        fields = (
            'civil', 
            'batizado', 
            'ensaio',
            'casamento', 
            'corporativo', 
            'debutante', 
            'aniversario', 
            'making_of',
            'making_of_noivo', 
            'video_edicao', 
            'tratamento_fotos', 
            'diagramação_album', 
            'ensaio_pre_evento',
        )