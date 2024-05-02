from flask import request, Blueprint, jsonify
from app.services.prediction_service import make_prediction, train_model, get_all_models, get_model_info, delete_model_info, get_model_settings, get_ranges, clear_all_predictions
from datetime import datetime
import time
prediction_api = Blueprint('prediction_api', __name__)


@prediction_api.route('/predict', methods=['GET'])
def predict():
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    curr_date = datetime.strptime(curr_date, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
    curr_date = curr_date.replace(tzinfo=None)
    return jsonify(make_prediction(symbol, curr_date))


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
    curr_date = data.get('curr_date')
    curr_date = datetime.strptime(curr_date, '%Y-%m-%dT%H:%M:%S.%fZ')
    start_date = datetime.strptime(date_range[0], '%Y-%m-%dT%H:%M:%S.%fZ')
    end_date = datetime.strptime(date_range[1], '%Y-%m-%dT%H:%M:%S.%fZ')
    return train_model(
        model_type,
        model_name,
        window_size,
        stock,
        start_date,
        end_date,
        curr_date,
        epochs,
        features
    )


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


@prediction_api.route('/model_settings', methods=['GET'])
def settings():
    return get_model_settings()

@prediction_api.route('/get_time_ranges', methods=['GET'])
def get_time_ranges():
    return jsonify(get_ranges())


@prediction_api.route('/reset_predictions', methods=['POST'])
def clear_running_predictions():
    clear_all_predictions()
    return jsonify({'success': True})