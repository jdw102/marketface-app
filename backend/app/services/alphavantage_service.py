import requests
import os
import yfinance as yf
from flask import jsonify


def get_stock_data(ticker, start_date, end_date):
    if start_date is None or end_date is None:
        return jsonify({'error': 'Please provide both start_date and end_date parameters.'}), 400

    stock = yf.Ticker(ticker)
    data = stock.history(start=start_date, end=end_date)
    
    if data.empty:
        return jsonify({'error': 'No data available for the specified time range.'}), 404
    data.index = data.index.astype(str)
    return jsonify(data.to_dict())


def get_tickers():
    return [
        {
            "name": "Apple Inc.",
            "symbol": "AAPL",
            "image": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
        },
        {
            "name": "Amazon.com Inc.",
            "symbol": "AMZN",
            "image": "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        },
        {
            "name": "Tesla Inc.",
            "symbol": "TSLA",
            "image": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
        },
        {
            "name": "Meta Platforms Inc.",
            "symbol": "META",
            "image": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png"
        },
        {
            "name": "NVIDIA Corporation",
            "symbol": "NVDA",
            "image": "https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg"
        }
    ]


def main():
    ticker = 'AAPL'
    start_date = '2022-01-01'
    end_date = '2022-01-31'
    
    print(get_stock_data(ticker, start_date, end_date))

if __name__ == '__main__':
    main()