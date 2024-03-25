from flask import request, Blueprint
from app.services.stock_service import get_stock_data, get_tickers

stocks_api = Blueprint('stocks_api', __name__)


@stocks_api.route('/stock_data', methods=['GET'])
def stock_data():
    symbol = request.args.get('symbol')
    timeframe = request.args.get('timeframe')
    stock_data = get_stock_data(symbol, timeframe)
    return stock_data


@stocks_api.route('/tickers', methods=['GET'])
def tickers():
    tickers = get_tickers()
    return tickers
