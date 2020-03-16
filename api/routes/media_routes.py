from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow 
from keys import DB_URL
from PIL import Image
from models.event_model import Event, EventSchema
from models.user_model import User, UserSchema
from models.media_model import Media, MediaSchema
from models.avatar_model import Avatar
from io import BytesIO
from werkzeug.utils import secure_filename
import os, sys, inspect, json, time, re, base64, random, string, cv2

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

class MediaRouter:
    @staticmethod
    def upload_event_data():
        store_type = request.args.get('store_type') # < ['event', 'avatar', 'banner']
        is_web = request.args.get('web')

        if store_type == 'event':
            event_id = request.json.get('event_id')
            image_array = request.json.get('data')

            output = []
            thumb_list = []

            for i in image_array:
                name = i['image']['path'].split('/')[::-1][0].replace(" ", "_")
                size = i['image']['size']
                mime = i['image']['mime']
                base = i['base']
                
                #Generate random name
                random_string = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(12))
                random_name = random_string + "-" + name

                #Write file to folder
                with open(app.config['UPLOAD_FOLDER'] + secure_filename(random_name), "wb") as fh:
                    fh.write(base64.b64decode(re.sub("data:"+ mime +";base64", '', base)))

                if "video" not in mime:
                    to_optimize = Image.open("./static/" + secure_filename(random_name))
                    to_optimize.save("./static/" + secure_filename(random_name), optimize=True, quality=50)

                    thumb_list.append(secure_filename(random_name))
                else:
                    vidcap = cv2.VideoCapture("./static/" + secure_filename(random_name)) 

                    vidcap.set(cv2.CAP_PROP_POS_MSEC, 0.5*1000)
                    hasFrames, image = vidcap.read()
                    if hasFrames:
                        cv2.imwrite("./static/thumb-" + secure_filename(random_name) + ".jpg", image)

                #Upload to DB
                upload = Media(secure_filename(random_name), event_id, size, mime)
                db.session.add(upload)
                db.session.commit()

                #Append new data to output
                output.append({
                    "name": upload.media_name,
                    "type": upload.media_type,
                    "id": upload.id,
                    "size": upload.media_size,
                })  

            size = 200, 200

            for i in thumb_list:
                im = Image.open("./static/" + i)
                im.thumbnail(size)
                im.save("./static/thumb-" + i, optimize=True, quality=60)

            db.session.close()
            return jsonify({'data': output})
            
        else:
            if is_web == "true":
                user_id = request.json.get('event_id')
                mime = "image/png"
                base = request.json["data"].split(',')[::-1][0]
                name = ''.join(random.SystemRandom().choice(string.ascii_lowercase) for _ in range(4)) + ".png"
            else:
                name = request.json['data']['path'].split('/')[::-1][0].replace(" ", "_")
                mime = request.json['data']['mime']
                base = request.json['data']['data']
                user_id = request.json.get('event_id')

            random_string = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits + string.ascii_lowercase) for _ in range(12))
            random_name = random_string + "-" + name
           
            image = db.session.query(Avatar).filter_by(user_id = user_id).first()
           
            if store_type == "avatar":
                if image.avatar_name == None:
                    image.avatar_name = secure_filename(random_name)

                    with open(app.config['UPLOAD_FOLDER'] + secure_filename(random_name), "wb") as fh:
                        fh.write(base64.b64decode(re.sub("data:"+ mime +";base64", '', base)))

                    db.session.commit()
                    return jsonify({"data": {
                        "file_name": random_name,
                        "user_id": user_id,
                        "file_type": store_type,
                    }});
                else:
                    with open(app.config['UPLOAD_FOLDER'] + secure_filename(image.avatar_name), "wb") as fh:
                        fh.write(base64.b64decode(re.sub("data:"+ mime +";base64", '', base)))

                    db.session.commit()
                    return jsonify({"data": {
                        "file_name": image.avatar_name,
                        "user_id": user_id,
                        "file_type": store_type,
                    }});

            elif store_type == "banner":
                if image.banner_name == None:
                    image.banner_name = secure_filename(random_name)

                    with open(app.config['UPLOAD_FOLDER'] + secure_filename(random_name), "wb") as fh:
                        fh.write(base64.b64decode(re.sub("data:"+ mime +";base64", '', base)))

                    db.session.commit()
                    return jsonify({"data": {
                        "file_name": name,
                        "user_id": user_id,
                        "file_type": store_type,
                    }});
                else:
                    with open(app.config['UPLOAD_FOLDER'] + secure_filename(image.banner_name), "wb") as fh:
                        fh.write(base64.b64decode(re.sub("data:"+ mime +";base64", '', base)))

                    db.session.commit()
                    return jsonify({"data": {
                        "file_name": name,
                        "user_id": user_id,
                        "file_type": store_type,
                    }});

            else:
                db.session.close()
                return jsonify({"data": {"msg": "an error occured"}}), 400

    @staticmethod
    def delete_event_data():
        media_id = request.args.get('media_id')
        user_id = request.args.get('user_id')

        admin = db.session.query(User).filter_by(id = user_id).first()

        if admin and admin.account_type == "admin":
            image = db.session.query(Media).filter_by(id = media_id).first()
            try:
                db.session.delete(image)
            except:
                None

            try:
                os.remove(app.config['UPLOAD_FOLDER'] + image.media_name)
            except:
                None
                
            try:
                if "video" in image.media_type:
                    os.remove(app.config['UPLOAD_FOLDER']+ 'thumb-' + image.media_name + ".jpg")

                os.remove(app.config['UPLOAD_FOLDER']+ 'thumb-' + image.media_name)
            except:
                None

            db.session.commit()
            db.session.close()

            return MediaSchema(strict=True).jsonify(image)
        else:
            return jsonify({"data": {"msg": "Somente administradores podem deletar imagens"}}), 400