import requests
import os
import yfinance as yf
from flask import jsonify
from app.db import get_past_day_stocktwits, get_past_headlines, get_past_stocktwits_sentiment
from transformers import pipeline


stocktwits_classifier = pipeline("text-classification", model="zhayunduo/roberta-base-stocktwits-finetuned")
news_classifier = pipeline("text-classification", model="mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis")


def get_stocktwits(symbol):
    stocktwits = get_past_day_stocktwits(symbol)
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
    score = (num_pos - num_neg) / (num_pos + num_neg + num_neu)
    return jsonify({"twits": stocktwits[:10], "sentiment": score})

def get_headlines(symbol):
    headlines = get_past_headlines(symbol)
    return jsonify(headlines)

def get_stocktwits_sentiment(symbol, timeframe):
    stocktwits = get_past_stocktwits_sentiment(symbol, timeframe)
    return jsonify(stocktwits)