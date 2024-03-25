import requests
import os
import yfinance as yf
from flask import jsonify
from app.db import get_past_stocktwits, get_past_headlines, get_past_stocktwits_sentiment


def get_stocktwits(symbol):
    stocktwits = get_past_stocktwits(symbol)
    return jsonify(stocktwits)

def get_headlines(symbol):
    headlines = get_past_headlines(symbol)
    return jsonify(headlines)

def get_stocktwits_sentiment(symbol, timeframe):
    stocktwits = get_past_stocktwits_sentiment(symbol, timeframe)
    return jsonify(stocktwits)