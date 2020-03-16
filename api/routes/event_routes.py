from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow 
from keys import DB_URL
from models.event_model import Event, EventSchema
from models.user_model import User, UserSchema
from models.media_model import Media, MediaSchema
from models.request_model import Request, RequestSchema
from models.avatar_model import Avatar
import os, sys, inspect, json, urllib, bcrypt, time, re, ast

current_dir = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir) 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = "static/"
CORS(app)

#Init DB
db = SQLAlchemy(app)
ma = Marshmallow(app)

def null_key(default, dicti, key):
    return default if dicti.get(key) is None else dicti.get(key)

class EventRouter:
    @staticmethod
    def create_event():
        user_id = request.json.get('user_id')
        name = request.json.get('name')
        related_to = request.json.get('related_to')
        related_pros = request.json.get("related_pros")
        related_clients = request.json.get("related_clients")
        status = request.json.get("status")

        if not user_id:
            return jsonify({"data": {"msg": "user_id field is required"}}), 400
        elif not name:
            return jsonify({"data": {"msg": "Nome é obrigatório"}}), 400

        admin = db.session.query(User).filter_by(id = user_id).first()

        new_event = Event(
            name,
            user_id,
            str(related_clients if related_clients else []),
            str([user_id] if admin.account_type == "mentor" else related_pros if related_pros else []),
            str([user_id] if admin.account_type == "admin" else related_pros if related_pros else []),
            time.time(),
            status if status else "agendado",
            related_to
        )


        try:
            db.session.add(new_event)
            db.session.commit()
        except:
            return jsonify({"data": {"msg": "an error occured"}}), 400

        json = EventSchema(strict=True).dump(new_event).data

        request_data = db.session.query(Request).filter_by(id = json['related_to']).first()
        client = db.session.query(User).filter_by(id = request_data.client_id).first() if request_data else None

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

        data = {
            "id": json['id'],
            "name": json['name'],
            "created_by": json['created_by'],
            "created_at": json['created_at'],
            "current_status": json['status'],
            "images": [],
            "related_to": json['related_to'],
            "related": {
                "admins": get_user_details(str([json['id']])),
                "clients": get_user_details(json['related_clients']),
                "pros": get_user_details(json['related_pros'])
            },
            "request": {
                "id": request_data.id,
                "duration": request_data.duration,
                "level": request_data.level,
                "type": request_data.type,
                "client_id": request_data.client_id,
                "result": request_data.result,
                "client_name": client.name,
                "client_email": client.email,
                "client_phone": client.phone_number,
                "set": ast.literal_eval(request_data.set),
                "status": request_data.status,
                "discount": request_data.discount,
                "date": request_data.date,
                "hour": request_data.hour,
                "total": {
                    "sub": request_data.total,
                    "outros": request_data.total_outros,
                    "servicos": request_data.total_servicos,
                    "eventos": request_data.total_eventos
                }
            } if request_data else None
        }
        db.session.close()
        return jsonify({"data": data})


    @staticmethod
    def get_events():
        event_id = request.args.get('event_id')
        user_id = request.args.get('user_id')
        user = db.session.query(User).filter_by(id = user_id).first()
        account_type = user.account_type
        status = user.status

        output = []

        if not user_id:
            db.session.close()
            return jsonify({"data": {"msg": "user_id field is required"}}), 400

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

        events = db.session.query(Event).all()

        if account_type == 'client':
            for event in events:
                available = ast.literal_eval(event.related_clients)
                request_data = db.session.query(Request).filter_by(id = event.related_to).first()
                client = db.session.query(User).filter_by(id = request_data.client_id).first() if request_data else None

                if int(user_id) in available:
                    image_list = []
                    images = db.session.query(Media).filter_by(event_id = event.id).all()

                    for image in images:
                        image_list.append({
                            "name": image.media_name,
                            "type": image.media_type,
                            "id": image.id,
                            "size": image.media_size,
                        })

                    output.append({
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
                            "id": request_data.id,
                            "duration": request_data.duration,
                            "level": request_data.level,
                            "type": request_data.type,
                            "result": request_data.result,
                            "client_id": request_data.client_id,
                            "client_name": client.name,
                            "client_email": client.email,
                            "client_phone": client.phone_number,
                            "set": ast.literal_eval(request_data.set),
                            "status": request_data.status,
                            "discount": request_data.discount,
                            "date": request_data.date,
                            "hour": request_data.hour,
                            "total": {
                                "sub": request_data.total,
                                "outros": request_data.total_outros,
                                "servicos": request_data.total_servicos,
                                "eventos": request_data.total_eventos
                            }
                        } if request_data else None
                    })

            db.session.close()
        
        if account_type == 'admin':
            column = db.session.query(Event).all()

            for event in column:
                image_list = []
                images = db.session.query(Media).filter_by(event_id = event.id).all()
                request_data = db.session.query(Request).filter_by(id = event.related_to).first()
                client = db.session.query(User).filter_by(id = request_data.client_id).first() if request_data else None

                for image in images:
                    image_list.append({
                        "name": image.media_name,
                        "type": image.media_type,
                        "id": image.id,
                        "size": image.media_size,
                    })

                output.append({
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
                        "id": request_data.id,
                        "duration": request_data.duration,
                        "level": request_data.level,
                        "type": request_data.type,
                        "result": request_data.result,
                        "client_id": request_data.client_id,
                        "client_name": client.name,
                        "client_email": client.email,
                        "client_phone": client.phone_number,
                        "set": ast.literal_eval(request_data.set),
                        "status": request_data.status,
                        "discount": request_data.discount,
                        "date": request_data.date,
                        "hour": request_data.hour,
                        "total": {
                            "sub": request_data.total,
                            "outros": request_data.total_outros,
                            "servicos": request_data.total_servicos,
                            "eventos": request_data.total_eventos
                        }
                    } if request_data else None
                })

            db.session.close()

        if account_type == 'pro' and status == "approved":
            for event in events:
                available = ast.literal_eval(event.related_pros)
                request_data = db.session.query(Request).filter_by(id = event.related_to).first()
                client = db.session.query(User).filter_by(id = request_data.client_id).first() if request_data else None

                def level_check():
                    levels = ["Iniciante", "Básico", "Intermediário", "Avançado"]

                    if event.related_to:
                        def get_name(label):
                            if label == "Aniversário": return 'evt_rating_birthday'
                            elif label == "Civil": return 'evt_rating_civil'
                            elif label == "Corporativo": return 'evt_rating_corp'
                            elif label == "Debutante": return 'evt_rating_debut'
                            elif label == "Casamento": return 'evt_rating_wedding'
                            elif label == "Batizado": return 'evt_rating_baptism'
                            elif label == "Ensaio": return 'evt_rating_essay'
                            
                        return request_data.level in levels[:getattr(user, get_name(request_data.type))]

                if int(user_id) in available or level_check():
                    image_list = []
                    images = db.session.query(Media).filter_by(event_id = event.id).all()

                    for image in images:
                        image_list.append({
                            "name": image.media_name,
                            "type": image.media_type,
                            "id": image.id,
                            "size": image.media_size,
                        })

                    output.append({
                        'id': event.id,
                        'name': event.name,
                        'created_by': event.created_by,
                        'created_at': event.created_at,
                        'current_status': event.status,
                        'related_to': event.related_to,
                        "images": image_list,
                        "equivalent": level_check(), 
                        'related': {
                            "admins": get_user_details(event.related_admins),
                            "clients": get_user_details(event.related_clients),
                            "pros": get_user_details(event.related_pros)
                        },
                        "request": {
                            "id": request_data.id,
                            "duration": request_data.duration,
                            "level": request_data.level,
                            "type": request_data.type,
                            "result": request_data.result,
                            "client_id": request_data.client_id,
                            "client_name": client.name,
                            "client_email": client.email,
                            "client_phone": client.phone_number,
                            "set": ast.literal_eval(request_data.set),
                            "status": request_data.status,
                            "discount": request_data.discount,
                            "date": request_data.date,
                            "hour": request_data.hour,
                            "total": {
                                "sub": request_data.total,
                                "outros": request_data.total_outros,
                                "servicos": request_data.total_servicos,
                                "eventos": request_data.total_eventos
                            }
                        } if request_data else None
                    })

            db.session.close()

        if account_type == 'mentor':
            for event in events:
                available = ast.literal_eval(event.related_pros)
                request_data = db.session.query(Request).filter_by(id = event.related_to).first()
                client = db.session.query(User).filter_by(id = request_data.client_id).first() if request_data else None

                def level_check():
                    levels = ["Iniciante", "Básico", "Intermediário", "Avançado"]

                    if event.related_to:
                        def get_name(label):
                            if label == "Aniversário": return 'evt_rating_birthday'
                            elif label == "Civil": return 'evt_rating_civil'
                            elif label == "Corporativo": return 'evt_rating_corp'
                            elif label == "Debutante": return 'evt_rating_debut'
                            elif label == "Casamento": return 'evt_rating_wedding'
                            elif label == "Batizado": return 'evt_rating_baptism'
                            elif label == "Ensaio": return 'evt_rating_essay'
                            
                        return request_data.level in levels[:getattr(user, get_name(request_data.type))]

                if int(user_id) in available or str(event.created_by) == str(user_id) or level_check():
                    image_list = []
                    images = db.session.query(Media).filter_by(event_id = event.id).all()

                    for image in images:
                        image_list.append({
                            "name": image.media_name,
                            "type": image.media_type,
                            "id": image.id,
                            "size": image.media_size,
                        })

                    output.append({
                        'id': event.id,
                        'name': event.name,
                        'created_by': event.created_by,
                        'created_at': event.created_at,
                        'current_status': event.status,
                        'related_to': event.related_to,
                        "images": image_list,
                        "equivalent": level_check(), 
                        'related': {
                            "admins": get_user_details(event.related_admins),
                            "clients": get_user_details(event.related_clients),
                            "pros": get_user_details(event.related_pros)
                        },
                        "request": {
                            "id": request_data.id,
                            "duration": request_data.duration,
                            "level": request_data.level,
                            "type": request_data.type,
                            "result": request_data.result,
                            "client_id": request_data.client_id,
                            "client_name": client.name,
                            "client_email": client.email,
                            "client_phone": client.phone_number,
                            "set": ast.literal_eval(request_data.set),
                            "status": request_data.status,
                            "discount": request_data.discount,
                            "date": request_data.date,
                            "hour": request_data.hour,
                            "total": {
                                "sub": request_data.total,
                                "outros": request_data.total_outros,
                                "servicos": request_data.total_servicos,
                                "eventos": request_data.total_eventos
                            }
                        } if request_data else None
                    })

            db.session.close()

        if not event_id:
            output.reverse()

        return jsonify({"data": output})


    @staticmethod
    def update_event():
        event_id = request.json['event_id']
        updatable = ["name", "related_clients", "related_admins", "related_pros", "status", "related_to"]
        requested_items = {}
        event = db.session.query(Event).filter_by(id = event_id).first()

        if event != None:
            for key in updatable:
                if request.json.get(key) != None:
                    requested_items.update({key: request.json.get(key)})
                    
            def value_to_update(event_attr, key):
                return str(requested_items.get(key)) if requested_items.get(key) != None else getattr(Event, event_attr)

            event.name = value_to_update("name" ,'name')
            event.related_clients = value_to_update("related_clients" ,'related_clients')
            event.related_admins = value_to_update("related_admins" ,'related_admins')
            event.related_pros = value_to_update("related_pros" ,'related_pros')
            if request.json.get('status'):
                event.status = request.json.get('status')
            if request.json.get('related_to'):
                event.related_to = request.json.get('related_to')

            output = []

            if requested_items.get('related_clients') != [] or requested_items.get('related_pros') != []:
                _clients = requested_items.get('related_clients')
                _pros = requested_items.get('related_pros')

                if _clients:
                    for i in _clients:
                        user = db.session.query(User).filter_by(id = i).first()
                        image = db.session.query(Avatar).filter_by(user_id = i).first()

                        avatar = image.avatar_name if image.avatar_name else None

                        output.append({
                            "id": user.id,
                            "name": user.name,
                            "avatar_name": avatar
                        })
                        
                elif _pros:
                    for i in _pros:
                        user = db.session.query(User).filter_by(id = i).first()
                        image = db.session.query(Avatar).filter_by(user_id = i).first()

                        avatar = image.avatar_name if image.avatar_name else None

                        output.append({
                            "id": user.id,
                            "name": user.name,
                            "avatar_name": avatar
                        })

                db.session.commit()
                db.session.close()

                return jsonify({"data": output})

            db.session.commit()
            db.session.close()

            return jsonify({"data": {"msg": "???"}}), 400
        else:
            db.session.close()
            return jsonify({"data": {"msg": "invalid event"}}), 400


    @staticmethod
    def delete_events():
        event_id = request.args.get('event_id')
        user_id = request.args.get('user_id')

        if not user_id:
            return jsonify({"data": {"msg": "user_id arg is required"}}), 400
        elif not event_id:
            return jsonify({"data": {"msg": "event_id arg is required"}}), 400

        admin = db.session.query(User).filter_by(id = user_id).first()

        if admin != None and admin.account_type == "admin":
            event = db.session.query(Event).filter_by(id = event_id).first()
            images = db.session.query(Media).filter_by(event_id = event_id).all()

            for image in images:
                try:
                    os.remove(app.config['UPLOAD_FOLDER'] + image.media_name)
                    os.remove(app.config['UPLOAD_FOLDER']+ 'thumb-' + image.media_name)
                except:
                    None
                try:
                    db.session.delete(image)
                    if "video" in image.media_type:
                        os.remove(app.config['UPLOAD_FOLDER']+ 'thumb-' + image.media_name + ".jpg")
                        
                except:
                    None

            db.session.delete(event)
            db.session.commit()
            db.session.close()

            return EventSchema(strict=True).jsonify(event)
        else:
            db.session.close()
            return jsonify({"data": {"msg": "only admins can delete a event"}}), 401


    @staticmethod
    def get_single():
        user_id = request.args.get('user_id')
        event_id = request.args.get('event_id')

        def get_user_details(user_type):
            doutput = []
            for user_index in ast.literal_eval(user_type):
                try:
                    temp_user = db.session.query(User).filter_by(id = user_index).first()
                    media = db.session.query(Avatar).filter_by(user_id = user_index).first()
                    avatar = media.avatar_name if media.avatar_name else None

                    doutput.append({
                        "id": temp_user.id,
                        "name": temp_user.name,
                        "avatar_name": avatar,
                    })
                except:
                    None

            return doutput


        event = db.session.query(Event).filter_by(id = event_id).first()
        available = ast.literal_eval(event.related_clients)
        request_data = db.session.query(Request).filter_by(id = event.related_to).first()
        client = db.session.query(User).filter_by(id = request_data.client_id).first() if request_data else None

        output = {
            "request": {
                "id": request_data.id,
                "duration": request_data.duration,
                "level": request_data.level,
                "type": request_data.type,
                "result": request_data.result,
                "client_id": request_data.client_id,
                "client_name": client.name,
                "client_email": client.email,
                "client_phone": client.phone_number,
                "set": ast.literal_eval(request_data.set),
                "status": request_data.status,
                "discount": request_data.discount,
                "date": request_data.date,
                "hour": request_data.hour,
                "total": {
                    "sub": request_data.total,
                    "outros": request_data.total_outros,
                    "servicos": request_data.total_servicos,
                    "eventos": request_data.total_eventos
                }
            }
        }

        return jsonify({"data": output})

    @staticmethod
    def get_portfolios():
        output = []
        events = db.session.query(Event).filter_by(status = "portfolio").all()

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

        for event in events:
            image_list = []
            images = db.session.query(Media).filter_by(event_id = event.id).all()
            request_data = db.session.query(Request).filter_by(id = event.related_to).first()
            client = db.session.query(User).filter_by(id = request_data.client_id).first() if request_data else None

            for image in images:
                image_list.append({
                    "name": image.media_name,
                    "type": image.media_type,
                    "id": image.id,
                    "size": image.media_size,
                })

            output.append({
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
                    "id": request_data.id,
                    "duration": request_data.duration,
                    "level": request_data.level,
                    "type": request_data.type,
                    "result": request_data.result,
                    "client_id": request_data.client_id,
                    "client_name": client.name,
                    "client_email": client.email,
                    "client_phone": client.phone_number,
                    "set": ast.literal_eval(request_data.set),
                    "status": request_data.status,
                    "discount": request_data.discount,
                    "date": request_data.date,
                    "hour": request_data.hour,
                    "total": {
                        "sub": request_data.total,
                        "outros": request_data.total_outros,
                        "servicos": request_data.total_servicos,
                        "eventos": request_data.total_eventos
                    }
                } if request_data else None
            })

        db.session.close()
        return jsonify({"data": output})