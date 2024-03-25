import requests
import os
import yfinance as yf
from flask import jsonify
from app.db import get_all_tickers
from datetime import datetime
from dateutil.relativedelta import relativedelta



def get_stock_data(ticker, timeframe):
    if timeframe is None:
        return jsonify({'error': 'Please provide a timeframe parameter.'}), 400
    current_datetime = datetime.utcnow()
    current_datetime -= relativedelta(years=5)
    end_date = current_datetime.strftime('%Y-%m-%d')
    if timeframe == "1W":
        start_date = (current_datetime - relativedelta(weeks=1)).strftime('%Y-%m-%d')
    elif timeframe == "1M":
        start_date = (current_datetime - relativedelta(months=1)).strftime('%Y-%m-%d')
    elif timeframe == "3M":
        start_date = (current_datetime - relativedelta(months=3)).strftime('%Y-%m-%d')
    elif timeframe == "YTD":
        start_date = datetime(current_datetime.year, 1, 1).strftime('%Y-%m-%d')
    elif timeframe == "1Y":
        start_date = (current_datetime - relativedelta(years=1)).strftime('%Y-%m-%d')
    else:
        start_date = "1950-01-01"
    stock = yf.Ticker(ticker)
    data = stock.history(start=start_date, end=end_date)
    if data.empty:
        return jsonify({'error': 'No data available for the specified time range.'}), 404
    data.index = data.index.astype(str)
    return jsonify(data.to_dict())


def get_tickers():
    try:
        tickers = get_all_tickers()
        return jsonify(tickers)
    except Exception as e:
        print("An error occurred:", e)
        return None


