import os

from flask import Flask
from json import JSONEncoder
##from flask_bcrypt import Bcrypt
##from flask_jwt_extended import JWTManager

from bson import json_util, ObjectId
from datetime import datetime, timedelta
from app.api.stock_api import stocks_api
from app.api.sentiment_api import sentiment_api
from app.api.prediction_api import prediction_api
from flask.json.provider import _default as _json_default
from flask_cors import CORS


def json_default(obj):
    if isinstance(obj, datetime):
        obj = obj - timedelta(hours=4)
        return obj.strftime(f"%Y-%m-%d %H:%M:%S")
    if isinstance(obj, ObjectId):
        return str(obj)
    return json_util.default(obj, json_util.CANONICAL_JSON_OPTIONS)
    
    


def create_app():

    APP_DIR = os.path.abspath(os.path.dirname(__file__))
    STATIC_FOLDER = os.path.join(APP_DIR, 'build/static')
    TEMPLATE_FOLDER = os.path.join(APP_DIR, 'build')

    app = Flask(__name__, static_folder=STATIC_FOLDER,
                template_folder=TEMPLATE_FOLDER,
                )
    app.json.default = json_default
    app.register_blueprint(stocks_api)
    app.register_blueprint(sentiment_api)
    app.register_blueprint(prediction_api)
    CORS(app)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        return "Hello World!"

    return app