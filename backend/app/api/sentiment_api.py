from flask import request, Blueprint
from app.services.sentiment_service import get_stocktwits, get_headlines, get_stocktwits_sentiment

sentiment_api = Blueprint('sentiment_api', __name__)


@sentiment_api.route('/stocktwits', methods=['GET'])
def stock_data():
    symbol = request.args.get('symbol')
    print(symbol)
    return get_stocktwits(symbol)

@sentiment_api.route('/headlines', methods=['GET'])
def headlines():
    symbol = request.args.get('symbol')
    return get_headlines(symbol)

@sentiment_api.route('/stocktwits_sentiment', methods=['GET'])
def stocktwits_sentiment():
    timeframe = request.args.get('timeframe')
    symbol = request.args.get('symbol')
    return get_stocktwits_sentiment(symbol, timeframe)