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

def get_past_day_stocktwits(symbol, curr_date):
    day_before = curr_date - timedelta(days=1)
    print(day_before, curr_date)
    past_items = list(db.stocktwits.find({
        "stock": symbol,
        "created_at": {"$gt": day_before, "$lt": curr_date}
    }).sort("created_at", -1))
    return past_items


def get_past_headlines(symbol, curr_date, num=10):
    current_datetime_str = f"{curr_date.strftime("%Y-%m-%d %H:%M:%S")}-04:00"
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



def update_running_predictions(model_id, prediction):
    db.model_metadata.update_one(
        {"_id": model_id},
        {"$push": {"running_predictions": model_id}}
    )



def get_model_data(symbol, end_date):
    if symbol == "NVDA":
        data = db.nvda_model_data.find({
            "date": {
                "$lt": end_date
                }
        }).sort("date", 1)
    elif symbol == "AAPL":
        data = db.aapl_model_data.find({
            "date": {
                "$lt": end_date
                }
        }).sort("date", 1)
    elif symbol == "META":
        data = db.meta_model_data.find({
            "date": {
                "$lt": end_date
                }
        }).sort("date", 1)
    elif symbol == "AMZN":
        data = db.amzn_model_data.find({
            "date": {
                "$lt": end_date
                }
        }).sort("date", 1)
    elif symbol == "TSLA":
        data = db.tsla_model_data.find({
            "date": {
                "$lt": end_date
                }
        }).sort("date", 1)
    else:
        data = None
    data = list(data)
    data = pd.DataFrame(data)
    return data


def save_model_metadata(model_metadata):
    try:
        result = db.model_metadata.insert_one(model_metadata)
        model_id = result.inserted_id
    except DuplicateKeyError:
        return None
    return model_id


def get_all_model_metadata():
    metadata = []
    for data in db.model_metadata.find():
        metadata.append(data)
    return metadata



def get_all_saved_models():
    models = {}
    for ticker in db.tickers.find():
        if "model_id" in ticker:
            models[ticker["symbol"]] = ticker["model_id"]
    return models


def get_saved_model(ticker):
    ticker = db.tickers.find_one({"symbol": ticker})
    model_id = ticker.get("model_id")
    return model_id


def get_model_by_id(id):
    try:
        model = db.model_metadata.find_one({"_id": ObjectId(id)})
    except InvalidId:
        return None
    return model


def delete_model_by_id(id):
    try:
        result = db.model_metadata.delete_one({"_id": ObjectId(id)})
    except InvalidId:
        return None
    return result.deleted_count


def get_minimum_date(symbol):
    if symbol == "NVDA":
        data = db.nvda_model_data.find().sort("date", 1).limit(1)
    elif symbol == "AAPL":
        data = db.aapl_model_data.find().sort("date", 1).limit(1)
    elif symbol == "META":
        data = db.meta_model_data.find().sort("date", 1).limit(1)
    elif symbol == "AMZN":
        data = db.amzn_model_data.find().sort("date", 1).limit(1)
    elif symbol == "TSLA":
        data = db.tsla_model_data.find().sort("date", 1).limit(1)
    else:
        return None
    data = list(data)
    if len(data) == 0:
        return None
    return data[0]["date"]


def get_maximum_date(symbol):
    if symbol == "NVDA":
        data = db.nvda_model_data.find().sort("date", -1).limit(1)
    elif symbol == "AAPL":
        data = db.aapl_model_data.find().sort("date", -1).limit(1)
    elif symbol == "META":
        data = db.meta_model_data.find().sort("date", -1).limit(1)
    elif symbol == "AMZN":
        data = db.amzn_model_data.find().sort("date", -1).limit(1)
    elif symbol == "TSLA":
        data = db.tsla_model_data.find().sort("date", -1).limit(1)
    else:
        return None
    data = list(data)
    if len(data) == 0:
        return None
    return data[0]["date"]


def get_features(symbol):
    if symbol == "NVDA":
        data = db.nvda_model_data.find().sort("date", 1).limit(1)
    elif symbol == "AAPL":
        data = db.aapl_model_data.find().sort("date", 1).limit(1)
    elif symbol == "META":
        data = db.googl_model_data.find().sort("date", 1).limit(1)
    elif symbol == "AMZN":
        data = db.amzn_model_data.find().sort("date", 1).limit(1)
    elif symbol == "TSLA":
        data = db.tsla_model_data.find().sort("date", 1).limit(1)
    else:
        return None
    data = list(data)
    if len(data) == 0:
        return None
    keys = list(data[0].keys())
    keys.remove("date")
    keys.remove("_id")
    return keys


def update_ticker_model(symbol, model_id):
    try:
        result = db.tickers.find_one_and_update(
            {"symbol": symbol},
            {"$set": {"model_id": model_id}}
        )
    except Exception as e:
        return None
    return result