from flask import Blueprint, request
from app.services.alphavantage_service import get_stock_data, get_tickers


api_app = Blueprint('api', __name__)


@api_app.route('/stock_data', methods=['GET'])
def stock_data():
    symbol = request.args.get('symbol')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    stock_data = get_stock_data(symbol, start_date, end_date)
    return stock_data


@api_app.route('/tickers', methods=['GET'])
def tickers():
    return get_tickers()
