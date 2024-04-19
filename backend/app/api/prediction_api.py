from flask import request, Blueprint
from app.services.prediction_service import get_predictions, train_model

prediction_api = Blueprint('prediction_api', __name__)


@prediction_api.route('/predict', methods=['GET'])
def predict():
    symbol = request.args.get('symbol')
    return get_predictions(None, 10, symbol, 5)

@prediction_api.route('/train', methods=['GET'])
def train():
    print("TEST")
    return train_model()