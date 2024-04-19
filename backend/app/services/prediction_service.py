from app.db import get_model_input
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
import numpy as np
import pandas as pd
from flask import jsonify


# lstm_model = tf.keras.models.load_model("lstm_model.h5")
columns = ["date", "open", "high", "low", "close", "volume", "thresholded_social_media_sentiment"]

def get_predictions(model, window, symbol, days):
    df = get_model_input(symbol, window)
    # data = df.drop(columns=["date"]).values
    # scaler = StandardScaler()
    # data = scaler.fit_transform(data)
    # curr_window = data
    # predictions = []
    # for _ in range(days):
    #     prediction = lstm_model.predict(curr_window.reshape((1, curr_window.shape[0], curr_window.shape[1])))
    #     curr_window = curr_window[1:]
    #     curr_window = np.append(curr_window, prediction, axis=0)
    #     predictions.append(prediction[0])
    # predictions = np.array(predictions)
    # predictions = scaler.inverse_transform(predictions)
    latest_date = df["date"].max() + pd.DateOffset(days=1)
    date_range = pd.date_range(start=latest_date, periods=days, freq="B").strftime("%Y-%m-%d").tolist()
    new_df = pd.DataFrame(data=np.array([[200] * len(columns)] * len(date_range)), columns=columns)
    new_df["date"] = date_range
    new_df = new_df[columns]
    return jsonify(new_df.to_dict(orient="records"))


def train_model():
    print("STARTING TRAINING")
    new_model = tf.keras.models.load_model("lstm_model.h5")
    print("LOADED MODEL")
    new_model.compile(optimizer='adam', loss='mean_squared_error')
    print("COMPILED MODEL")
    df = get_model_input("NVDA", 10)
    data = df.drop(columns=["date"]).values
    scaler = StandardScaler()
    data = scaler.fit_transform(data)
    X = data.reshape((1, data.shape[0], data.shape[1]))
    y = data[3].reshape((1, data.shape[1]))
    print(X.shape)
    print(y.shape)
    new_model.fit(X, y, epochs=100, batch_size=32)
    print("DONE TRAINING")