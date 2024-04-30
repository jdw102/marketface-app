from flask import request, Blueprint
from app.services.prediction_service import get_predictions, train_model, get_all_models
prediction_api = Blueprint('prediction_api', __name__)


@prediction_api.route('/predict', methods=['GET'])
def predict():
    symbol = request.args.get('symbol')
    return get_predictions(None, 10, symbol, 5)


@prediction_api.route('/train', methods=['GET'])
def train():
    return train_model(None, "test", 10, "NVDA", "2014-01-02", "2019-01-01", 5, ["open", "high", "low", "close", "volume", "thresholded_social_media_sentiment"])


@prediction_api.route('/all_models', methods=['GET'])
def all_models():
    return get_all_models()
