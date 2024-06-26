from app import db
import bson
import pandas as pd
from flask import current_app, g
from werkzeug.local import LocalProxy
from flask_pymongo import PyMongo
from pymongo.errors import DuplicateKeyError, OperationFailure
from bson.objectid import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


def get_db():
    db = getattr(g, "_database", None)
    if db is None:
        db = g._database = PyMongo(current_app).db
    return db

db = LocalProxy(get_db)

def get_all_tickers():
    tickers = []
    for ticker in db.tickers.find():
        tickers.append(ticker)
    return tickers

def get_past_stocktwits(symbol, num=20):
    current_datetime = datetime.utcnow()
    current_datetime -= relativedelta(years=5)
    past_items = list(db.stocktwits.find({
        "stock": symbol,
        "created_at": {"$lt": current_datetime}
    }).sort("created_at", -1).limit(num))
    return past_items

def get_past_headlines(symbol, num=10):
    current_datetime = datetime.utcnow()
    current_datetime -= relativedelta(years=5)
    current_datetime_str = f"{current_datetime.strftime("%Y-%m-%d %H:%M:%S")}-04:00"
    past_items = list(db.news.find({
        "stock": symbol,
        "date": {"$lt": current_datetime_str}
    }).sort("date", -1).limit(num))
    return past_items

def get_past_stocktwits_sentiment(symbol, timeframe):
    current_datetime = datetime.utcnow()
    current_datetime -= relativedelta(years=5)
    end_date = current_datetime
    if timeframe == "1W":
        start_date = (current_datetime - relativedelta(weeks=1))
    elif timeframe == "1M":
        start_date = (current_datetime - relativedelta(months=1))
    elif timeframe == "3M":
        start_date = (current_datetime - relativedelta(months=3))
    else:
        start_date = datetime(current_datetime.year, 1, 1)
    past_items = list(db.stocktwits_sentiment.find({
        "date": {"$gte": start_date, "$lt": end_date}
    }).sort("date", -1))
    past_items.reverse()
    return past_items


def get_model_input(ticker, window):
    current_datetime = datetime.utcnow()
    current_datetime -= relativedelta(years=5)
    end_date = current_datetime
    start_date = current_datetime
    business_days = 0
    while business_days < window:
        if start_date.weekday() < 5:
            business_days += 1
        start_date -= relativedelta(days=1)
    if ticker == "NVDA":
        data = db.nvda_model_data.find({
            "date": {"$gte": start_date, "$lt": end_date}
        }).sort("date", 1)
    else:
        data = db.nvda_model_data.find({
            "date": {"$gte": start_date, "$lt": end_date}
        }).sort("date", 1)    
    data = list(data)
    data = pd.DataFrame(data)
    data = data[["date", "open", "high", "low", "close", "volume", "thresholded_social_media_sentiment"]]
    return data

def get_stock_prices(ticker, start_date, end_date):
    data = db.nvda_model_data.find({
        "date": {"$gte": start_date, "$lt": end_date}
    }).sort("date", 1)
    data = list(data)
    data = pd.DataFrame(data)
    data = data[["date", "open", "high", "low", "close", "volume"]]
    return data
