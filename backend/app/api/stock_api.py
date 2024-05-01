from flask import request, Blueprint
from datetime import datetime
from app.services.stock_service import get_stock_data, get_tickers, update_ticker_model_id

stocks_api = Blueprint('stocks_api', __name__)


@stocks_api.route('/stock_data', methods=['GET'])
def stock_data():
    symbol = request.args.get('symbol')
    timeframe = request.args.get('timeframe')
    curr_date = request.args.get('curr_date')
    curr_date = datetime.strptime(curr_date, "%a %b %d %Y %H:%M:%S GMT%z (%Z)")
    stock_data = get_stock_data(symbol, curr_date, timeframe)
    return stock_data


@stocks_api.route('/tickers', methods=['GET'])
def tickers():
    tickers = get_tickers()
    return tickers


@stocks_api.route('/save_model', methods=['POST'])
def update_model():
    symbol = request.args.get('symbol')
    model_id = request.args.get('model_id')
    return update_ticker_model_id(symbol, model_id)
