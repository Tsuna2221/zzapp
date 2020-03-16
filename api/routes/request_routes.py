from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow 
from keys import DB_URL
from models.user_model import User, UserSchema
from models.request_model import Request, RequestSchema
from models.media_model import Media, MediaSchema
from models.event_model import Event, EventSchema
from models.avatar_model import Avatar, AvatarSchema

from models.budconfig_model import BudConfig, BudConfigSchema
from models.kits_model import Kits, KitsSchema
from models.sets_model import Sets, SetsSchema

from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
import os, sys, inspect, json, bcrypt, time, re, base64, ast, smtplib, ssl

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir) 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER']='mail.zzfotoevideo.com.br'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'zzapp@zzfotoevideo.com.br'
app.config['MAIL_PASSWORD'] = 'Novoappzz2019'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
CORS(app)

#Init DB
db = SQLAlchemy(app)
ma = Marshmallow(app) 
mail = Mail(app)

class RequestRouter:
    @staticmethod
    def post_request():
        type = request.json.get('type')
        duration = request.json.get('duration')
        level = request.json.get('level')
        client_id = request.json.get('client_id')
        set = request.json.get('set')
        total = request.json.get('total')
        discount = request.json.get('discount')
        total_outros = request.json.get('total_outros')
        total_servicos = request.json.get('total_servicos')
        total_eventos = request.json.get('total_eventos')
        date = request.json.get('date')
        hour = request.json.get('hour')
        result = request.json.get('result')
        event_id = request.json.get('eventId')

        user = db.session.query(User).filter_by(id = client_id).first()

        def get_user_details(user_type):
            output = []
            for user_index in ast.literal_eval(user_type):
                try:
                    temp_user = db.session.query(User).filter_by(id = user_index).first()
                    media = db.session.query(Avatar).filter_by(user_id = user_index).first()
                    avatar = media.avatar_name if media.avatar_name else None

                    output.append({
                        "id": temp_user.id,
                        "name": temp_user.name,
                        "avatar_name": avatar,
                    })
                except:
                    None

            return output

        if user: 
            event_request = Request(type, duration, level, client_id, str(set), total, discount, total_outros, total_servicos, total_eventos, "accepted" if event_id else "pending", date, hour, "pending", result)
            db.session.add(event_request)
            db.session.commit()
            
            json_dump = RequestSchema(strict=True).dump(event_request).data

            if not event_id:
                event = Event(
                    None, 
                    user.id, 
                    str([user.id]), 
                    str([]), 
                    str([]), 
                    time.time(), 
                    "pendente",
                    json_dump['id']
                )
            else:
                event = db.session.query(Event).filter_by(id = event_id).first()

                event.related_to = json_dump['id']

            event_dump = EventSchema(strict=True).dump(event).data

            db.session.add(event)
            db.session.commit()

            output = {
                "id": event_dump['id'],
                "name": event_dump['name'],
                "created_by": event_dump['created_by'],
                "created_at": event_dump['created_at'],
                "current_status": event_dump['status'],
                "images": [],
                "related_to": event_dump['related_to'],
                "related": {
                    "admins": get_user_details(str([event_dump['id']])),
                    "clients": get_user_details(event_dump['related_clients']),
                    "pros": get_user_details(event_dump['related_pros'])
                },
                "request": {
                    "id": json_dump['id'],
                    "duration": json_dump['duration'],
                    "level": json_dump['level'],
                    "type": json_dump['type'],
                    "client_id": json_dump['client_id'],
                    "client_name": user.name,
                    "client_email": user.email,
                    "client_phone": user.phone_number,
                    "set": ast.literal_eval(json_dump['set']),
                    "status": json_dump['status'],
                    "result": json_dump['result'],
                    "discount": json_dump['discount'],
                    "date": json_dump['date'],
                    "hour": json_dump['hour'],
                    "total": {
                        "sub": json_dump['total'],
                        "outros": json_dump['total_outros'],
                        "servicos": json_dump['total_servicos'],
                        "eventos": json_dump['total_eventos']
                    }
                }
            }

            db.session.close()
            return jsonify({"data": output})
        else:
            db.session.close()
            return jsonify({"data": {"msg": "Nenhum usuário encontrado"}}), 400

    @staticmethod
    def get_requests():
        user_id = request.args.get('id')

        admin = db.session.query(User).filter_by(id = user_id).first()

        if admin and admin.account_type == "admin":
            output = []

            for req in db.session.query(Request).all():
                client = db.session.query(User).filter_by(id = req.client_id).first()
                output.append({
                    "id": req.id,
                    "duration": req.duration,
                    "level": req.level,
                    "type": req.type,
                    "result": req.result,
                    "client_id": req.client_id,
                    "client_name": client.name,
                    "client_email": client.email,
                    "client_phone": client.phone_number,
                    "set": ast.literal_eval(req.set),
                    "status": req.status,
                    "discount": req.discount,
                    "date": req.date,
                    "hour": req.hour,
                    "total": {
                        "sub": req.total,
                        "outros": req.total_outros,
                        "servicos": req.total_servicos,
                        "eventos": req.total_eventos
                    }
                })
            
            db.session.close()
            return jsonify({"data": output})
        else:
            db.session.close()
            return jsonify({"data": {"msg": "desautorizado"}}), 401

    @staticmethod
    def request_status():
        user_id = request.json.get('user_id')
        request_id = request.json.get('request_id')
        status = request.json.get('status')

        admin = db.session.query(User).filter_by(id = user_id).first()

        if not user_id:
            return jsonify({"data": {"msg": "user_id is required"}}), 400
        if not request_id:
            return jsonify({"data": {"msg": "request_id is required"}}), 400
        if not status:
            return jsonify({"data": {"msg": "status is required"}}), 400

        if admin and admin.account_type == "admin":
            data = db.session.query(Request).filter_by(id = request_id).first()
            user = db.session.query(User).filter_by(id = data.client_id).first()

            data.status = status

            messages = {
                "accepted": {
                    'one': "ORÇAMENTO ACEITO - \n",
                    'two': "Olá, " + user.name +",\n\n",
                    'three': "Agradecemos o seu contato e ficamos felizes com a oportunidade. Informamos ainda que seu pedido foi aceito.\n\n",
                    'five': "Verifique o seu número, pois em breve entraremos em contato pelo whatsapp para definirmos demais detalhes,\n\n",
                    'six': "\nQualquer dúvida estamos à disposição.\n\n",
                    'seven': "Equipe ZZ Foto e Vídeo",
                },

                "rejected": {
                    'one': "ORÇAMENTO RECUSADO - \n",
                    'two': "Olá, " + user.name +",\n\n",
                    'three': "Agradecemos o seu contato e oportunidade. Infelizmente não conseguiremos atender a sua solicitação.\n",
                    'five': "\nQualquer dúvida estamos a disposição e fique a vontade para entrar em contato para verificar novas possibilidade,\n\n",
                    'six': "\nAtenciosamente,\n\n",
                    'seven': "Equipe ZZ Foto e Vídeo",
                },
                "details": """Sobre o evento

Tipo de evento: {type}
Nível: {level}
Duração: {duration} horas
Data do evento: {date}, às {hour}
                """.format(type = data.type, level = data.level, duration = data.duration, date = data.date, hour = data.hour, name = user.name, email = user.email)
            }

            string = "aceita" if status == "accepted" else "rejeitada"

            sets = ""

            for item in ast.literal_eval(data.set):
                sets += """
Pacote: {label}
Quantidade: {qty}
Observação: {obs}
""".format(label = item["label"], qty = item["qty"], obs = item["obs"])
            message_encode = messages[status]['one'] + messages[status]['two'] + messages[status]['three'] + messages["details"] + sets + messages[status]['six'] + messages[status]['seven']

            # try:
            #     msg = Message('Solicitação de orçamento ' + string,
            #                 sender=("ZZ Foto e Video" , app.config['MAIL_USERNAME']), 
            #                 recipients=[user.email])
            #     msg.body = message_encode
            #     msg.charset = "utf8"
            #     mail.send(msg)
            # except:
            #     None

            msg = Message('Solicitação de orçamento ' + string,
            sender=("ZZ Foto e Video" , app.config['MAIL_USERNAME']), 
            recipients=[user.email])
            msg.body = message_encode
            msg.charset = "utf8"
            mail.send(msg)

            def get_user_details(user_type):
                output = []
                for user_index in ast.literal_eval(user_type):
                    try:
                        temp_user = db.session.query(User).filter_by(id = user_index).first()
                        media = db.session.query(Avatar).filter_by(user_id = user_index).first()
                        avatar = media.avatar_name if media.avatar_name else None

                        output.append({
                            "id": temp_user.id,
                            "name": temp_user.name,
                            "avatar_name": avatar,
                        })
                    except:
                        None

                return output

            image_list = []
            event = db.session.query(Event).filter_by(related_to = request_id).first()
            images = db.session.query(Media).filter_by(event_id = event.id).all()
            client = db.session.query(User).filter_by(id = data.client_id).first()

            print(get_user_details(event.related_pros), get_user_details(event.related_clients))

            for image in images:
                image_list.append({
                    "name": image.media_name,
                    "type": image.media_type,
                    "id": image.id,
                    "size": image.media_size,
                })

            output = {
                'id': event.id,
                'name': event.name,
                'created_by': event.created_by,
                'created_at': event.created_at,
                'current_status': event.status,
                'related_to': event.related_to,
                "images": image_list,
                'related': {
                    "admins": get_user_details(event.related_admins),
                    "clients": get_user_details(event.related_clients),
                    "pros": get_user_details(event.related_pros)
                },
                "request": {
                    "id": data.id,
                    "duration": data.duration,
                    "level": data.level,
                    "type": data.type,
                    "result": data.result,
                    "client_id": data.client_id,
                    "client_name": client.name,
                    "client_email": client.email,
                    "client_phone": client.phone_number,
                    "set": ast.literal_eval(data.set),
                    "status": data.status,
                    "discount": data.discount,
                    "date": data.date,
                    "hour": data.hour,
                    "total": {
                        "sub": data.total,
                        "outros": data.total_outros,
                        "servicos": data.total_servicos,
                        "eventos": data.total_eventos
                    }
                }
            }

            db.session.add(data)
            db.session.commit()
            db.session.close()

            return jsonify({"data": output})
        else:
            db.session.close()
            return jsonify({"data": {"msg": "desautorizado"}}), 401

    @staticmethod
    def get_config():
        config = db.session.query(BudConfig).filter_by(id = 1).first()
        sets = db.session.query(Sets).filter_by(id = 1).first()
        kits = db.session.query(Kits).filter_by(id = 1).first()

        output = {
            "config": {
                'base_avancado': config.base_avancado, 
                'taxa_zz': config.taxa_zz,
                'mar_desconto': config.mar_desconto, 
                'nf': config.nf, 
                'base_tratamento': config.base_tratamento, 
                'minmax_iniciante': config.minmax_iniciante, 
                'minmax_basico': config.minmax_basico,
                'minmax_intermediario': config.minmax_intermediario, 
                'minmax_avancado': config.minmax_avancado, 
                'grau_iniciante': config.grau_iniciante, 
                'grau_basico': config.grau_basico, 
                'grau_intermediario': config.grau_intermediario,
                'grau_avancado': config.grau_avancado
            },
            "sets": {
                'civil': sets.civil, 
                'batizado': sets.batizado,
                'ensaio': sets.ensaio,
                'casamento': sets.casamento,
                'corporativo': sets.corporativo,
                'debutante': sets.debutante,
                'aniversario': sets.aniversario,
                'making_of': sets.making_of,
                'making_of_noivo': sets.making_of_noivo,
                'video_edicao': sets.video_edicao,
                'tratamento_fotos': sets.tratamento_fotos,
                'diagramação_album': sets.diagramação_album,
                'ensaio_pre_evento': sets.ensaio_pre_evento,
            },
            "kits": {
                'retrospectiva': kits.retrospectiva,
                'wedding_story': kits.wedding_story,
                'quadro_60x80cm': kits.quadro_60x80cm,
                'premium_30x30cm_box': kits.premium_30x30cm_box,
                'master_30x30cm_box': kits.master_30x30cm_box,
                'premium_24x30cm_box': kits.premium_24x30cm_box,
                'master_24x30cm_box': kits.master_24x30cm_box,
                'master_20x30cm_box': kits.master_20x30cm_box,
                'sogra_premium_15x15cm_box': kits.sogra_premium_15x15cm_box, 
                'sogra_master_15x15cm_box': kits.sogra_master_15x15cm_box,
                'locucao_2_min': kits.locucao_2_min,
                'trilha_sonora': kits.trilha_sonora,
                'kit_resultado': kits.kit_resultado,
                'pencard': kits.pencard,
            }
        }

        db.session.commit()
        db.session.close()
        return jsonify({"data": output})

    @staticmethod
    def update_config():
        def value_to_update(key, table):
            return request.json.get(key) if request.json.get(key) != None else getattr(table, key)

        config = db.session.query(BudConfig).filter_by(id = 1).first()
        sets = db.session.query(Sets).filter_by(id = 1).first()
        kits = db.session.query(Kits).filter_by(id = 1).first()

        config.base_avancado = value_to_update("base_avancado", BudConfig) 
        config.taxa_zz = value_to_update("taxa_zz", BudConfig) 
        config.mar_desconto = value_to_update("mar_desconto", BudConfig)
        config.nf = value_to_update("nf", BudConfig) 
        config.base_tratamento = value_to_update("base_tratamento", BudConfig) 
        config.minmax_iniciante = value_to_update("minmax_iniciante", BudConfig) 
        config.minmax_basico = value_to_update("minmax_basico", BudConfig)
        config.minmax_intermediario = value_to_update("minmax_intermediario", BudConfig)
        config.minmax_avancado = value_to_update("minmax_avancado", BudConfig)
        config.grau_iniciante = value_to_update("grau_iniciante", BudConfig)
        config.grau_basico = value_to_update("grau_basico", BudConfig) 
        config.grau_intermediario = value_to_update("grau_intermediario", BudConfig)
        config.grau_avancado = value_to_update("grau_avancado", BudConfig)

        sets.civil = value_to_update("civil", Sets) 
        sets.batizado = value_to_update("batizado", Sets) 
        sets.ensaio = value_to_update("ensaio", Sets) 
        sets.casamento = value_to_update("casamento", Sets)
        sets.corporativo = value_to_update("corporativo", Sets) 
        sets.debutante = value_to_update("debutante", Sets) 
        sets.aniversario = value_to_update("aniversario", Sets)
        sets.making_of = value_to_update("making_of", Sets) 
        sets.making_of_noivo = value_to_update("making_of_noivo", Sets) 
        sets.video_edicao = value_to_update("video_edicao", Sets) 
        sets.tratamento_fotos = value_to_update("tratamento_fotos", Sets) 
        sets.diagramação_album = value_to_update("diagramação_album", Sets) 
        sets.ensaio_pre_evento = value_to_update("ensaio_pre_evento", Sets)

        kits.retrospectiva = value_to_update("retrospectiva", Kits) 
        kits.wedding_story = value_to_update("wedding_story", Kits) 
        kits.quadro_60x80cm = value_to_update("quadro_60x80cm", Kits) 
        kits.premium_30x30cm_box = value_to_update("premium_30x30cm_box", Kits)
        kits.master_30x30cm_box = value_to_update("master_30x30cm_box", Kits) 
        kits.premium_24x30cm_box = value_to_update("premium_24x30cm_box", Kits) 
        kits.master_24x30cm_box = value_to_update("master_24x30cm_box", Kits) 
        kits.master_20x30cm_box = value_to_update("master_20x30cm_box", Kits) 
        kits.sogra_premium_15x15cm_box = value_to_update("sogra_premium_15x15cm_box", Kits) 
        kits.sogra_master_15x15cm_box = value_to_update("sogra_master_15x15cm_box", Kits) 
        kits.locucao_2_min = value_to_update("locucao_2_min", Kits) 
        kits.trilha_sonora = value_to_update("trilha_sonora", Kits) 
        kits.kit_resultado = value_to_update("kit_resultado", Kits) 
        kits.pencard = value_to_update("pencard", Kits) 

        db.session.commit()
        db.session.close()

        return jsonify({"data": "Values updates successfully"})

    @staticmethod
    def update_request():
        request_id = request.json.get('request_id')
        event_id = request.json.get('eventId')

        type = request.json.get('type')
        duration = request.json.get('duration')
        level = request.json.get('level')
        client_id = request.json.get('client_id')
        set = request.json.get('set')
        total = request.json.get('total')
        discount = request.json.get('discount')
        date = request.json.get('date')
        hour = request.json.get('hour')
        result = request.json.get('result')

        updated_request = db.session.query(Request).filter_by(id = request_id).first()
        event = db.session.query(Event).filter_by(id = event_id).first()
         
        updated_request.type = type
        updated_request.duration = duration
        updated_request.level = level
        updated_request.client_id = client_id
        updated_request.set = str(set)
        updated_request.total = total
        updated_request.discount = discount
        updated_request.date = date
        updated_request.hour = hour
        updated_request.result = result

        output = {
            "id": event.id,
            "name": event.name,
            "created_by": event.created_by,
            "created_at": event.created_at,
            "current_status": event.status,
            "related_to": event.related_to,
            "request": {
                "id": request_id,
                "duration": duration,
                "level": level,
                "type": type,
                "client_id": client_id,
                "set": set,
                "result": result,
                "discount": discount,
                "date": date,
                "hour": hour,
                "total": total
            }
        }
        
        db.session.commit()
        db.session.close()

        return jsonify({"data": output})