import requests
import os
import yfinance as yf
from flask import jsonify
from app.db import get_past_stocktwits, get_past_headlines, get_past_stocktwits_sentiment, get_stocktwits_between, get_headlines_between, get_model_data_between, get_features
from transformers import pipeline
import torch
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta


stocktwits_classifier = pipeline("text-classification", model="zhayunduo/roberta-base-stocktwits-finetuned")
news_classifier = pipeline("text-classification", model="mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis")


def get_stocktwits(symbol, curr_date, num):
    stocktwits = get_past_stocktwits(symbol, curr_date, num)
    
    return jsonify({"twits": stocktwits})


def get_stocktwits_sentiment_score(symbol, curr_date, timeframe):
    end_date = curr_date
    if timeframe == '30MIN':
        start_date = curr_date - timedelta(minutes=30)
    elif timeframe == '1HR':
        start_date = curr_date - timedelta(hours=1)
    elif timeframe == '3HR':
        start_date = curr_date - timedelta(hours=3)
    elif timeframe == '12HR':
        start_date = curr_date - timedelta(hours=12)
    elif timeframe == '1D':
        start_date = curr_date - timedelta(days=1)
    else:
        start_date = curr_date - timedelta(minutes=30)
    stocktwits = get_stocktwits_between(symbol, start_date, end_date)
    texts = [twit['body'] for twit in stocktwits]
    scores = stocktwits_classifier(texts, truncation=True, padding=True)
    labels = []
    for data in scores:
        if data['score'] < 0.75:
            labels.append("Neutral")
        else:
            labels.append(data['label'])
    num_pos = labels.count("Positive")
    num_neg = labels.count("Negative")
    num_neu = labels.count("Neutral")
    if num_pos + num_neg + num_neu == 0:
        score = 0
    else:
        score = (num_pos - num_neg) / (num_pos + num_neg + num_neu)
    print(round(score, 4))
    return {
        "score": round(score, 4),
        "num_pos": num_pos,
        "num_neg": num_neg,
        "num_neu": num_neu
    }


def get_headlines(symbol, curr_date, num):
    headlines = get_past_headlines(symbol, curr_date, num)
    return jsonify(headlines)



def get_headlines_sentiment_score(symbol, curr_date, timeframe):
    end_date = curr_date
    if timeframe == '1D':
        start_date = curr_date - relativedelta(days=1)
    elif timeframe == '1W':
        start_date = curr_date - relativedelta(days=7)
    elif timeframe == '1M':
        start_date = curr_date - relativedelta(months=1)
    elif timeframe == '1Y':
        start_date = curr_date - relativedelta(years=1)
    else:
        start_date = curr_date - relativedelta(days=1)
    headlines = get_headlines_between(symbol, start_date, end_date)
    text = []
    for headline in headlines:
        text.append(headline['title'])
    scores = news_classifier(text, truncation=True, padding=True)
    labels = []
    for data in scores:
        labels.append(data['label'])
    num_pos = labels.count("positive")
    num_neg = labels.count("negative")
    num_neu = labels.count("neutral")
    if num_pos + num_neg + num_neu == 0:
        score = 0
    else:
        score = (num_pos - num_neg) / (num_pos + num_neg + num_neu)
    return {
        "score": round(score, 4),
        "num_pos": num_pos,
        "num_neg": num_neg,
        "num_neu": num_neu
    }


def get_sentiment_timeseries_data(symbol, curr_date, timeframe):
    end_date = curr_date
    if timeframe == '1W':
        start_date = curr_date - relativedelta(days=7)
    elif timeframe == '1M':
        start_date = curr_date - relativedelta(months=1)
    elif timeframe == '3M':
        start_date = curr_date - relativedelta(months=3)
    elif timeframe == "YTD":
        start_date = datetime(curr_date.year, 1, 1)
    elif timeframe == '1Y':
        start_date = curr_date - relativedelta(years=1)
    else:
        start_date = datetime(1950, 1, 1)
    model_data = get_model_data_between(symbol, start_date, end_date)
    features = get_features(symbol)
    sentiment_features = []
    for feature in features:
        split = feature.split('_')
        if split.count('sentiment') > 0:
            sentiment_features.append(feature)
    data = model_data[["date"] + sentiment_features].to_dict(orient='records')
    return jsonify(data)
