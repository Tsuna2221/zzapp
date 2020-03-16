from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from flask_marshmallow import Marshmallow 
from keys import DB_URL
from models.user_model import User, UserSchema
from models.avatar_model import Avatar
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
import os, sys, inspect, json, bcrypt, time, re, base64, jwt, random, string, ast

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

#Init
db = SQLAlchemy(app)
ma = Marshmallow(app) 
mail = Mail(app)

def check_client(ty, value):
    return None if ty == "client" else value

class UserRouter:
    @staticmethod
    def create_user():
        name = request.json.get('name')
        email = request.json.get('email')
        password = request.json.get('password')
        confirm_password = request.json.get('confirm_password')
        account_type = request.json.get('account_type')
        mentor_id = request.json.get('mentor_id')
        phone_number = request.json.get('phone_number')
        portfolio = request.json.get('portfolio')
        status = check_client(account_type, "pending")
        user_id = request.json.get('id')
        mentor_check = request.json.get('is_mentor')
        rg = request.json.get('rg')
        cpf = request.json.get('cpf')
        services = request.json.get('services')
        
        if not name:
            return jsonify({"data": {"msg": "Nome é obrigatório"}}), 400
        elif not email:
            return jsonify({"data": {"msg": "E-mail obrigatório"}}), 400
        elif not password:
            return jsonify({"data": {"msg": "Senha é obrigatório"}}), 400
        elif not confirm_password:
            return jsonify({"data": {"msg": "Confirmação de senha é obrigatório"}}), 400
        elif not account_type:
            return jsonify({"data": {"msg": "Tipo de conta é obrigatório"}}), 400
        elif not phone_number:
            return jsonify({"data": {"msg": "Telefone é obrigatório"}}), 400
        elif not mentor_id and account_type == "pro" and status == "pending":
            return jsonify({"data": {"msg": "Selecione um mentor"}}), 400
        elif account_type == "pro" and services == "[]":
            return jsonify({"data": {"msg": "Lista de serviços é obrigatório"}}), 400

        #validation
        #name
        email_pattern = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
        url_pattern = r'(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'

        if len(name) < 7:
            return jsonify({"data": {"msg": "Seu nome deve ter mais de 6 letras"}}), 400
        elif not re.match(email_pattern, email):
            return jsonify({"data": {"msg": "E-mail inválido"}}), 400
        elif phone_number and len(phone_number) < 11:
            return jsonify({"data": {"msg": "Número de telefone inválido"}}), 400
        elif len(password) < 8:
            return jsonify({"data": {"msg": "Sua senha deve ter mais de 8 dígitos"}}), 400
        elif not re.search('[a-zA-Z]', password):
            return jsonify({"data": {"msg": "Sua senha deve conter pelo menos uma letra"}}), 400
        elif not re.search('[0-9]', password):
            return jsonify({"data": {"msg": "Sua senha deve conter pelo menos um número"}}), 400
        elif password != confirm_password:
            return jsonify({"data": {"msg": "Senhas não coincidem"}}), 400
        elif portfolio and not re.match(url_pattern, portfolio):
            return jsonify({"data": {"msg": "Link do portfólio inválido"}}), 400
        elif cpf and len(cpf) != 11:
            return jsonify({"data": {"msg": "CPF inválido"}}), 400
        elif rg and len(rg) != 9:
            return jsonify({"data": {"msg": "RG inválido"}}), 400

        hashed_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10))
        mentor_data = mentor_id
        
        if user_id:
            admin = db.session.query(User).filter_by(id = user_id).first()
            mentor_data = admin.id
            
            if admin.account_type == "admin" or admin.account_type == "mentor" and mentor_check == True:
                account_type = "mentor"
                status = "approved"
            elif admin.account_type == "admin" or admin.account_type == "mentor" and mentor_check == False:
                account_type = "pro"
                status = "approved"
                
        new_user = User(
            name,
            email,
            hashed_pass,
            account_type,
            mentor_data, 
            phone_number, 
            check_client(account_type, portfolio),
            check_client(account_type, "Amador"), 
            5, 
            check_client(account_type, 1),
            check_client(account_type, 1),
            check_client(account_type, 1),
            check_client(account_type, 1),
            check_client(account_type, 1),
            check_client(account_type, 1),
            check_client(account_type, 1), 
            None,
            None,
            request.json.get('rg'),
            request.json.get('cpf'),
            time.time(),
            time.time(),
            None,
            status,
            check_client(account_type, services)
        )

        try:
            db.session.add(new_user)
            db.session.commit()
        except:
            db.session.close()
            return jsonify({"data": {"msg": "Este E-mail já esta sendo utilizado"}}), 400

        json = UserSchema(strict=True).dump(new_user).data

        images = Avatar(json['id'], None, None)
        db.session.add(images)
        db.session.commit()

        data = {
            "id": json['id'],
            "name": json['name'],
            "email": json['email'],
            "account_type": json['account_type'],
            "phone_number": json['phone_number'],
            "mentor_id": json['mentor_id'],
            "portfolio": json['portfolio'],
            "phone_number": json['phone_number'],
            "avatar_name": json['avatar_id'],
            "banner_name": json['banner_id'],
            "rg": json['rg'],
            "cpf": json['cpf'],
            "created_at": json['created_at'],
            "updated_at": json['updated_at'],
            "about_me": json['about_me'],
            "status": json['status'],
            "services": json['services'],
            "ratings": {
                "general": json['rating_general'],
                "pro": json['rating_pro'],
                "events": [
                    {'rating': json['evt_rating_birthday'], 'label': "Aniversário"},
                    {'rating': json['evt_rating_civil'], 'label': "Civil"},
                    {'rating': json['evt_rating_baptism'], 'label': "Batizado"},
                    {'rating': json['evt_rating_essay'], 'label': "Ensaio"},
                    {'rating': json['evt_rating_wedding'], 'label': "Casamento"},
                    {'rating': json['evt_rating_corp'], 'label': "Corporativo"},
                    {'rating': json['evt_rating_debut'], 'label': "Debutante"},
                ]
            }
        }

        db.session.close()
        return jsonify({"data": data})

    @staticmethod
    def validate_user(s_key):
        request_email = request.json.get('email')
        request_pass = request.json.get('password')

        if not request_email:
            return jsonify({"data": {"msg": "E-mail é obrigatório"}}), 400
        elif not request_pass:
            return jsonify({"data": {"msg": "Senha é obrigatório"}}), 400

        user = db.session.query(User).filter_by(email = request_email).first()

        if user != None:
            stored_password = user.password
            test = bcrypt.hashpw(request_pass.encode('utf-8'), stored_password.encode('utf-8')).decode() == stored_password

            if test:
                encoded = jwt.encode({'email': request_email, 'id': user.id, "account_type": user.account_type}, s_key, algorithm='HS256')

                response = make_response(jsonify({"data": {"token": encoded.decode('utf-8')}}))

                response.set_cookie('token', encoded.decode('utf-8'), secure=True, httponly=True)

                return response
            else:
                db.session.close()
                return jsonify({"data": {"msg": "Senha incorreta"}}), 400


        db.session.close()
        return jsonify({"data": {"msg": "Este E-mail não existe"}}), 400


        jwt.encode({'some': 'payload'}, 'secret', algorithm='HS256')        

    @staticmethod
    def get_user(s_key):
        token = request.headers.get('authorization')

        decoded_user = jwt.decode(token, s_key, algorithms=['HS256'])
    
        user = db.session.query(User).filter_by(email = decoded_user['email']).first()
        image = db.session.query(Avatar).filter_by(user_id = decoded_user['id']).first()
        
        if not user:
            db.session.close()
            return jsonify({"data": {"msg": "Ocorreu um erro"}}), 400
            
        user.updated_at = time.time()
        db.session.commit()

        avatar = image.avatar_name if image.avatar_name else None
        banner = image.banner_name if image.banner_name else None

        data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "account_type": user.account_type,
            "phone_number": user.phone_number,
            "mentor_id": user.mentor_id,
            "portfolio": user.portfolio,
            "phone_number": user.phone_number,
            "avatar_name": avatar,
            "banner_name": banner,
            "rg": user.rg,
            "cpf": user.cpf,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "about_me": user.about_me,
            "status": user.status,
            "services": user.services,
            "ratings": {
                "general": user.rating_general,
                "pro": user.rating_pro,
                "events": [
                    {'rating': user.evt_rating_birthday, 'label': "Aniversário"},
                    {'rating': user.evt_rating_civil, 'label': "Civil"},
                    {'rating': user.evt_rating_baptism, 'label': "Batizado"},
                    {'rating': user.evt_rating_essay, 'label': "Ensaio"},
                    {'rating': user.evt_rating_wedding, 'label': "Casamento"},
                    {'rating': user.evt_rating_corp, 'label': "Corporativo"},
                    {'rating': user.evt_rating_debut, 'label': "Debutante"},
                ]
            }
        }
        db.session.close()
        
        return jsonify({"data": data})

    @staticmethod
    def fetch_user():
        user_id = request.args.get('id')

        if not user_id:
            db.session.close()
            return jsonify({"data": {"msg": "id field is required"}}), 400

        user = db.session.query(User).filter_by(id = user_id).first()
        image = db.session.query(Avatar).filter_by(user_id = user_id).first()

        avatar = image.avatar_name if image.avatar_name else None
        banner = image.banner_name if image.banner_name else None

        data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "account_type": user.account_type,
            "phone_number": user.phone_number,
            "mentor_id": user.mentor_id,
            "portfolio": user.portfolio,
            "phone_number": user.phone_number,
            "avatar_name": avatar,
            "banner_name": banner,
            "rg": user.rg,
            "cpf": user.cpf,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
            "services": user.services,
            "about_me": user.about_me,
            "status": user.status,
            "ratings": {
                "general": user.rating_general,
                "pro": user.rating_pro,
                "events": [
                    {'rating': user.evt_rating_birthday, 'label': "Aniversário"},
                    {'rating': user.evt_rating_civil, 'label': "Civil"},
                    {'rating': user.evt_rating_baptism, 'label': "Batizado"},
                    {'rating': user.evt_rating_essay, 'label': "Ensaio"},
                    {'rating': user.evt_rating_wedding, 'label': "Casamento"},
                    {'rating': user.evt_rating_corp, 'label': "Corporativo"},
                    {'rating': user.evt_rating_debut, 'label': "Debutante"},
                ]
            }
        }
        db.session.close()
        
        return jsonify({"data": data})


    @staticmethod
    def update_account():
        user_id = request.json.get('id')
        updatable = ["account_type", "baptism", "birthday", "civil", "corp", "debut", "essay", "wedding", "rating_general", "rating_pro", "phone_number", "name", "portfolio", "avatar_id", "banner_id", "cpf", "rg", "email", "status", "services"]
        requested_items = {}

        name = request.json.get('name')
        phone_number = request.json.get('phone_number')
        account_type = request.json.get('account_type')
        portfolio = request.json.get('portfolio')
        cpf = request.json.get('cpf')
        rg = request.json.get('rg')

        url_pattern = r'(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'

        if not request.json.get('name'):
            return jsonify({"data": {"msg": "Nome é obrigatório"}}), 400
        elif not request.json.get('email'):
            return jsonify({"data": {"msg": "E-mail obrigatório"}}), 400
        elif not request.json.get('phone_number'):
            return jsonify({"data": {"msg": "Telefone é obrigatório"}}), 400
        elif request.json.get('account_type') == "pro" and request.json.get('services') == "[]":
            return jsonify({"data": {"msg": "Lista de serviços é obrigatório"}}), 400

        #validation
        #name
        email_pattern = r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
        url_pattern = r'(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$'

        if len(request.json.get('name')) < 7:
            return jsonify({"data": {"msg": "Seu nome deve ter mais de 6 letras"}}), 400
        elif not re.match(email_pattern, request.json.get('email')):
            return jsonify({"data": {"msg": "E-mail inválido"}}), 400
        elif request.json.get('phone_number') and len(request.json.get('phone_number')) < 11:
            return jsonify({"data": {"msg": "Número de telefone inválido"}}), 400
        elif portfolio and not re.match(url_pattern, portfolio):
            return jsonify({"data": {"msg": "Link do portfólio inválido"}}), 400
        elif request.json.get('cpf') and len(request.json.get('cpf')) != 11:
            return jsonify({"data": {"msg": "CPF inválido"}}), 400
        elif request.json.get('rg') and len(request.json.get('rg')) != 9:
            return jsonify({"data": {"msg": "RG inválido"}}), 400


        user = db.session.query(User).filter_by(id = user_id).first()

        if user != None:
            for key in updatable:
                if request.json.get(key) != None:
                    requested_items.update({key: request.json.get(key)})
                    
            def value_to_update(user_attr, key):
                return requested_items.get(key) if requested_items.get(key) != None else getattr(User, user_attr)

            user.evt_rating_baptism = value_to_update("evt_rating_baptism" ,'baptism')
            user.evt_rating_birthday = value_to_update("evt_rating_birthday" ,'birthday')
            user.evt_rating_civil = value_to_update("evt_rating_civil" ,'civil')
            user.evt_rating_corp = value_to_update("evt_rating_corp" ,'corp')
            user.evt_rating_debut = value_to_update("evt_rating_debut" ,'debut')
            user.evt_rating_essay = value_to_update("evt_rating_essay" ,'essay')
            user.evt_rating_wedding = value_to_update("evt_rating_wedding" ,'wedding')
            user.rating_pro = value_to_update("rating_pro" ,'rating_pro')
            user.phone_number = value_to_update("phone_number" ,'phone_number')
            user.name = value_to_update("name" ,'name')
            user.portfolio = value_to_update("portfolio" ,'portfolio')
            user.rating_general = value_to_update("rating_general" ,'rating_general')
            user.avatar_id = value_to_update("avatar_id" ,'avatar_id')
            user.banner_id = value_to_update("banner_id" ,'banner_id')
            user.cpf = value_to_update("cpf" ,'cpf')
            user.rg = value_to_update("rg" ,'rg')
            user.email = value_to_update("email" ,'email')
            user.status = value_to_update("status" ,'status')
            user.account_type = value_to_update("account_type" ,'account_type')
            user.services = value_to_update("services" ,'services')

            image = db.session.query(Avatar).filter_by(user_id = user_id).first()
            
            avatar = image.avatar_name if image.avatar_name else None
            banner = image.banner_name if image.banner_name else None

            data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "account_type": user.account_type,
                "phone_number": user.phone_number,
                "mentor_id": user.mentor_id,
                "portfolio": user.portfolio,
                "phone_number": user.phone_number,
                "avatar_name": avatar,
                "banner_name": banner,
                "rg": user.rg,
                "cpf": user.cpf,
                "created_at": user.created_at,
                "updated_at": user.updated_at,
                "about_me": user.about_me,
                "status": user.status,
                "services": user.services,
                "ratings": {
                    "general": user.rating_general,
                    "pro": user.rating_pro,
                    "events": [
                        {'rating': user.evt_rating_birthday, 'label': "Aniversário"},
                        {'rating': user.evt_rating_civil, 'label': "Civil"},
                        {'rating': user.evt_rating_baptism, 'label': "Batizado"},
                        {'rating': user.evt_rating_essay, 'label': "Ensaio"},
                        {'rating': user.evt_rating_wedding, 'label': "Casamento"},
                        {'rating': user.evt_rating_corp, 'label': "Corporativo"},
                        {'rating': user.evt_rating_debut, 'label': "Debutante"},
                    ]
                }
            }

            db.session.commit()
            db.session.close()
            
            return jsonify({"data": data})
        else:
            db.session.close()
            return jsonify({"data": {"msg": "invalid user"}}), 400

    @staticmethod
    def get_users_by():
        user_id = request.args.get('user_id')
        user_type = request.args.get('user_type')

        output = []
        if not user_id:
            return jsonify({"data": {"msg": "user_id arg is required"}}), 400
        elif not user_type:
            return jsonify({"data": {"msg": "user_type arg is required"}}), 400

        if user_id != 'new':
            auth_user = db.session.query(User).filter_by(id = user_id).first()

            if auth_user == None:
                db.session.close()
                return jsonify({"data": {"msg": "invalid request"}}), 400

        def temp(cls):
            media = db.session.query(Avatar).filter_by(user_id = cls.id).first()

            avatar = media.avatar_name if media.avatar_name else None
            banner = media.banner_name if media.banner_name else None

            return {
                "id": cls.id,
                "name": cls.name,
                "email": cls.email,
                "account_type": cls.account_type,
                "phone_number": cls.phone_number,
                "mentor_id": cls.mentor_id,
                "portfolio": cls.portfolio,
                "phone_number": cls.phone_number,
                "avatar_name": avatar,
                "banner_name": banner,
                "rg": cls.rg,
                "cpf": cls.cpf,
                "created_at": cls.created_at,
                "updated_at": cls.updated_at,
                "services": cls.services,
                "about_me": cls.about_me,
                "status": cls.status,
                "services": cls.services,
                "ratings": {
                    "general": cls.rating_general,
                    "pro": cls.rating_pro,
                    "events": {
                        "baptism": cls.evt_rating_baptism,
                        "birthday": cls.evt_rating_birthday,
                        "civil": cls.evt_rating_civil,
                        "corp": cls.evt_rating_corp,
                        "debut": cls.evt_rating_debut,
                        "essay": cls.evt_rating_essay,
                        "wedding": cls.evt_rating_wedding,
                    }
                }
            }

        if user_id != 'new':
            if auth_user.account_type == "admin" or auth_user.account_type == "mentor":
                if user_type == "client":
                    users = db.session.query(User).filter_by(account_type = "client").all()

                    for user in users:
                        output.append(temp(user))

                if user_type == "admin":
                    users = db.session.query(User).filter_by(account_type = "admin").all()

                    for user in users:
                        output.append(temp(user))

                if user_type == "all":
                    users = db.session.query(User).all()

                    for user in users:
                        output.append(temp(user))

                if user_type == "pro" or user_type == "mentor":
                    users = db.session.query(User).filter((User.account_type == "pro") | (User.account_type == "mentor")).all()

                    for user in users:
                        output.append(temp(user))
            else:
                return jsonify({"data": {"msg": "an error ocurred"}}), 400
        elif user_id == "new":
            if user_type == "mentor":
                users = db.session.query(User).filter_by(account_type = "mentor").all()

                for user in users:
                    output.append(temp(user))
        else:
        
            db.session.close()
            return jsonify({"data": {"msg": "an error ocurred"}}), 400
        
        db.session.close()
        return jsonify({"data": output})

    @staticmethod
    def send_pass_request(s_key):
        email = request.json.get("email")

        if not email:
            return jsonify({"data": {"msg": "E-mail é obrigatório"}}), 400

        user = db.session.query(User).filter_by(email = email).first()

        if user:
            code = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(6))

            msg = Message('Código de Verificação', 
                          sender=("ZZ Foto e Video", app.config['MAIL_USERNAME']), 
                          recipients=[email])
            msg.body = "Codigo de Verificacao: " + code
            mail.send(msg)

            werk_hash = generate_password_hash(code + email).encode('utf-8') #Create Hash
            base_string = base64.b64encode(werk_hash).decode('utf-8')[:-2] #Create base64 hash

            return jsonify({"data": {"hash": base_string}})
        else:
            return jsonify({"data": {"msg": "Este E-mail não existe"}}), 400

    @staticmethod
    def verify_request():
        email = request.json.get('email')
        code = request.json.get('code')
        hashed = request.json.get('hash') + "=="

        decode_base = base64.b64decode(hashed).decode('utf-8')

        if not code:
            return jsonify({"data": {"msg": "Código de verificação é obrigatório"}}), 400
        elif not email:
            return jsonify({"data": {"msg": "E-mail é obrigatório"}}), 400
        elif not hashed:
            return jsonify({"data": {"msg": "Hash de segurança é obrigatório"}}), 400
        
        if check_password_hash(decode_base, code + email):
            return "redirect"
        else:
            return jsonify({"data": {"msg": "Código inválido"}}), 401

    @staticmethod
    def reset_password():
        email = request.json.get('email')
        password = request.json.get('password')
        confirm = request.json.get('confirm_password')

        if not password:
            return jsonify({"data": {"msg": "Senha é obrigatório"}}), 400
        elif not confirm:
            return jsonify({"data": {"msg": "Confirmação de senha é obrigatório"}}), 400
        elif not email:
            return jsonify({"data": {"msg": "E-mail é obrigatório"}}), 400
        elif len(password) < 8:
            return jsonify({"data": {"msg": "Sua senha deve ter mais de 8 dígitos"}}), 400
        elif not re.search('[a-zA-Z]', password):
            return jsonify({"data": {"msg": "Sua senha deve conter pelo menos uma letra"}}), 400
        elif not re.search('[0-9]', password):
            return jsonify({"data": {"msg": "Sua senha deve conter pelo menos um número"}}), 400
        elif password != confirm:
            return jsonify({"data": {"msg": "Senhas não coincidem"}}), 400

        hashed_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10))
                
        user = db.session.query(User).filter_by(email = email).first()

        user.password = hashed_pass 

        db.session.commit()
        db.session.close()
            
        return jsonify({"data": {"msg": "Senha redefinida com sucesso"}})

    @staticmethod
    def delete_user():
        user_id = request.args.get('user_id')
        deleted_id = request.args.get('deleted_id')

        admin = db.session.query(User).filter_by(id = user_id).first()
        deletedUser = db.session.query(User).filter_by(id = deleted_id).first()
        deletedAvatar = db.session.query(Avatar).filter_by(user_id = deleted_id).first()

        if admin != None and admin.account_type == "admin":
            db.session.delete(deletedUser)
            db.session.delete(deletedAvatar)
            db.session.commit()
            db.session.close()

            return jsonify({"data": {"id": deleted_id}})
        else:
            return jsonify({"data": {"msg": "Apenas administradores podem excluir usuários"}}), 400