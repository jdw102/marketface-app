from flask import request, Blueprint, jsonify
from app.services.prediction_service import get_predictions, train_model, get_all_models, get_model_info, delete_model_info
from datetime import datetime
import time
prediction_api = Blueprint('prediction_api', __name__)


@prediction_api.route('/predict', methods=['GET'])
def predict():
    symbol = request.args.get('symbol')
    return get_predictions(None, 10, symbol, 5)


@prediction_api.route('/train', methods=['POST'])
def train():
    data = request.json
    model_name = data.get('model_name')
    model_type = data.get('model_type')
    stock = data.get('stock')
    date_range = data.get('date_range')
    features = data.get('features')
    epochs = data.get('epochs')
    window_size = data.get('window_size')
    start_date = datetime.strptime(date_range[0], '%Y-%m-%dT%H:%M:%S.%fZ')
    end_date = datetime.strptime(date_range[1], '%Y-%m-%dT%H:%M:%S.%fZ')
    return train_model(
        model_type,
        model_name,
        window_size,
        stock,
        start_date,
        end_date,
        epochs,
        features
    )
    # time.sleep(5)
    # return jsonify(
    #     {
    #         "model_name": model_name,
    #     }
    # )


@prediction_api.route('/all_models', methods=['GET'])
def all_models():
    return get_all_models()


@prediction_api.route('/model', methods=['GET'])
def get_model():
    id = request.args.get('id')
    return get_model_info(id)


@prediction_api.route('/delete_model', methods=['DELETE'])
def delete_model():
    id = request.args.get('id')
    return delete_model_info(id)