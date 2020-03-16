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

class BudConfig(db.Model):
    __tablename__ = 'orcamento'

    id = db.Column(db.Integer, primary_key=True)
    base_avancado = db.Column(db.Integer)
    taxa_zz = db.Column(db.Integer)
    mar_desconto = db.Column(db.Integer)
    nf = db.Column(db.Integer)
    base_tratamento = db.Column(db.Integer)
    minmax_iniciante = db.Column(db.String(20))
    minmax_basico = db.Column(db.String(20))
    minmax_intermediario = db.Column(db.String(20))
    minmax_avancado = db.Column(db.String(20))
    grau_iniciante = db.Column(db.Integer)
    grau_basico = db.Column(db.Integer)
    grau_intermediario = db.Column(db.Integer)
    grau_avancado = db.Column(db.Integer)


    def __init__(
        self, 
        base_avancado, 
        taxa_zz,
        mar_desconto, 
        nf, 
        base_tratamento, 
        minmax_iniciante, 
        minmax_basico,
        minmax_intermediario, 
        minmax_avancado, 
        grau_iniciante, 
        grau_basico, 
        grau_intermediario,
        grau_avancado, 
    ):
        self.base_avancado = base_avancado
        self.taxa_zz = taxa_zz
        self.mar_desconto = mar_desconto
        self.nf = nf
        self.base_tratamento = base_tratamento
        self.minmax_iniciante = minmax_iniciante
        self.minmax_basico = minmax_basico
        self.minmax_intermediario = minmax_intermediario
        self.minmax_avancado = minmax_avancado
        self.grau_iniciante = grau_iniciante
        self.grau_basico = grau_basico
        self.grau_intermediario = grau_intermediario
        self.grau_avancado = grau_avancado

class BudConfigSchema(ma.Schema):
    class Meta:
        fields = (
            'base_avancado', 
            'taxa_zz',
            'mar_desconto', 
            'nf', 
            'base_tratamento', 
            'minmax_iniciante', 
            'minmax_basico',
            'minmax_intermediario', 
            'minmax_avancado', 
            'grau_iniciante', 
            'grau_basico', 
            'grau_intermediario',
            'grau_avancado', 
        )