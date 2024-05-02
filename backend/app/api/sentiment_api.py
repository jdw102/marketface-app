from flask import request, Blueprint, jsonify
from datetime import datetime
from app.services.sentiment_service import get_stocktwits, get_headlines, get_sentiment_timeseries_data, get_stocktwits_sentiment_score, get_headlines_sentiment_score
import re
from app.services.analyst_service import get_stats

sentiment_api = Blueprint('sentiment_api', __name__)


@sentiment_api.route('/stocktwits', methods=['GET'])
def stocktwits():
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    num = int(request.args.get('num'))
    curr_date = datetime.strptime(curr_date, "%Y-%m-%dT%H:%M:%S.%f%z")
    return get_stocktwits(symbol, curr_date, num)


@sentiment_api.route('/stocktwits_sentiment_score', methods=['GET'])
def stocktwits_sentiment_score():
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    timeframe = request.args.get('timeframe')
    curr_date = datetime.strptime(curr_date, "%Y-%m-%dT%H:%M:%S.%f%z")
    return get_stocktwits_sentiment_score(symbol, curr_date, timeframe)



@sentiment_api.route('/headlines_sentiment_score', methods=['GET'])
def headlines_sentiment_score():
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    timeframe = request.args.get('timeframe')
    curr_date = datetime.strptime(curr_date, "%Y-%m-%dT%H:%M:%S.%f%z")
    return get_headlines_sentiment_score(symbol, curr_date, timeframe)


@sentiment_api.route('/headlines', methods=['GET'])
def headlines():
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    curr_date = datetime.strptime(curr_date, "%Y-%m-%dT%H:%M:%S.%f%z")
    num = int(request.args.get('num'))
    return get_headlines(symbol, curr_date, num)


@sentiment_api.route('/sentiment_timeseries', methods=['GET'])
def sentiment_timeseries():
    timeframe = request.args.get('timeframe')
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    curr_date = datetime.strptime(curr_date, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
    curr_date = curr_date.replace(tzinfo=None)
    return get_sentiment_timeseries_data(symbol, curr_date, timeframe)


@sentiment_api.route('/analyst_stats', methods=['GET'])
def analyst_stats():
    symbol = request.args.get('symbol')
    curr_date = request.args.get('curr_date')
    curr_date = datetime.strptime(curr_date, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
    curr_date = curr_date.strftime("%m/%d/%Y")
    count, buys, neutral, sell = get_stats(symbol, curr_date)
    return jsonify({
        "count": count,
        "buys": buys,
        "neutral": neutral,
        "sell": sell
    })