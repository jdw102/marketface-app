import requests
import os
import yfinance as yf
from flask import jsonify
from app.db import get_all_tickers, get_stock_prices, update_ticker_model
from datetime import datetime
from dateutil.relativedelta import relativedelta



def get_stock_data(ticker, curr_date, timeframe):
    if timeframe is None:
        return jsonify({'error': 'Please provide a timeframe parameter.'}), 400
    end_date = curr_date
    if timeframe == "1W":
        start_date = (curr_date - relativedelta(weeks=1))
    elif timeframe == "1M":
        start_date = (curr_date - relativedelta(months=1))
    elif timeframe == "3M":
        start_date = (curr_date - relativedelta(months=3))
    elif timeframe == "YTD":
        start_date = datetime(curr_date.year, 1, 1)
    elif timeframe == "1Y":
        start_date = (curr_date - relativedelta(years=1))
    else:
        start_date = datetime(1950, 1, 1)
    data = get_stock_prices(ticker, start_date, end_date)
    data['date'] = data['date'].dt.strftime('%Y-%m-%d')
    return jsonify(data.to_dict(orient="records"))


def get_tickers():
    try:
        tickers = get_all_tickers()
        return jsonify(tickers)
    except Exception as e:
        print("An error occurred:", e)
        return None
    

def update_ticker_model_id(symbol, model_id):
    try:
        data = update_ticker_model(symbol, model_id)
        return jsonify(data)
    except Exception as e:
        print("An error occurred:", e)
        return None