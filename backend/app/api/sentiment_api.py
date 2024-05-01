from flask import request, Blueprint
from datetime import datetime
from app.services.sentiment_service import get_stocktwits, get_headlines, get_stocktwits_sentiment
import re

sentiment_api = Blueprint('sentiment_api', __name__)


@sentiment_api.route('/stocktwits', methods=['GET'])
def stocktwits():
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    curr_date = datetime.strptime(curr_date, "%Y-%m-%dT%H:%M:%S.%f%z")
    return get_stocktwits(symbol, curr_date)


@sentiment_api.route('/headlines', methods=['GET'])
def headlines():
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    curr_date = datetime.strptime(curr_date, "%Y-%m-%dT%H:%M:%S.%f%z")
    curr_date.isoweekday
    return get_headlines(symbol, curr_date)

@sentiment_api.route('/stocktwits_sentiment', methods=['GET'])
def stocktwits_sentiment():
    timeframe = request.args.get('timeframe')
    symbol = request.args.get('symbol')
    return get_stocktwits_sentiment(symbol, timeframe)