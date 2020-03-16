import os

DB_USER = os.environ.get('DB_USER') if os.environ.get('DB_USER') else 'root'
DB_PASS = os.environ.get('DB_PASS') if os.environ.get('DB_PASS') else ''
DB_HOST = os.environ.get('DB_HOST') if os.environ.get('DB_HOST') else 'localhost:3308'
DB_NAME = os.environ.get('DB_HOST') if os.environ.get('DB_HOST') else 'zztestdb'

DB_URL = 'mysql+pymysql://'+ DB_USER +':'+ DB_PASS + '@' + DB_HOST + '/' + DB_NAME