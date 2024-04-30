from app.db import get_model_input, get_model_data, save_model_metadata, get_all_model_metadata, get_model_by_id, delete_model_by_id, get_minimum_date, get_features, get_all_saved_models
from sklearn.preprocessing import StandardScaler
import tensorflow as tf
import numpy as np
import pandas as pd
from flask import jsonify
from tensorflow.keras.layers import Input, LSTM, Dense
from tensorflow.keras.models import Model
from app.services.time_service import get_date
from app.models.model_metadata import ModelMetadata
from google.cloud import storage
import os


def extract_seqX_outcomeY(data, N, offset, y_feature):
    X, y = [], []
    for i in range(offset, len(data)):
        X.append(data[i - N : i])
        y.append(data[i][y_feature])
    return np.array(X), np.array(y)


def extract_test_data(features, data, test, window_size, scaler):
    raw = []
    for feature in features:
        raw.append(data[feature][len(data) - len(test) - window_size:].values.reshape(-1, 1))
    raw_features = np.concatenate(raw, axis=1)
    raw_features = scaler.transform(raw_features)
    
    X_test = [raw_features[i-window_size:i, :] for i in range(window_size, raw_features.shape[0])]
    X_test = np.array(X_test)
    return X_test


def calculate_rmse(y_true, y_pred):
    rmse = np.sqrt(np.mean((y_true - y_pred) ** 2))
    return rmse


def calculate_mape(y_true, y_pred):
    y_pred, y_true = np.array(y_pred), np.array(y_true)
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
    return mape


def calculate_dir(actual_prices, predicted_prices):
    total = 0
    for i, predicted in enumerate(predicted_prices[1:]):
        actual = actual_prices[i]
        prev = actual_prices[i - 1]
        if actual > prev:
            if predicted > prev:
                total += 1
        else:
            if predicted < prev:
                total += 1
    return total / (len(predicted_prices) - 1)


def create_model(X_train, layer_units=50, loss="mean_squared_error", optimizer="rmsprop"):
    inp = Input(shape=(X_train.shape[1], X_train.shape[2]))

    x = LSTM(units=layer_units, return_sequences=True)(inp)
    x = LSTM(units=layer_units)(x)
    out = Dense(1, activation="linear")(x)
    model = Model(inp, out)

    model.compile(loss=loss, optimizer=optimizer)

    return model


def get_data(symbol, features, start_date, end_date, current_date):
    df = get_model_data(symbol, current_date)
    train_data = df[(df["date"] >= start_date) & (df["date"] <= end_date)]
    test_data = df[(df["date"] > end_date) & (df["date"] < current_date)]
    train_data = train_data[features]
    test_data = test_data[features]
    df = df[(df["date"] >= start_date) & (df["date"] < current_date)]
    return df, train_data, test_data

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


def train_model(model_type, model_name, window, symbol, start_date, end_date, epochs, features):
    curr_date = get_date()
    data, train, test = get_data(symbol, features, start_date, end_date, curr_date)
    scaler = StandardScaler()
    close_scaler = StandardScaler()
    close_scaler.fit(train[["close"]])
    train_scaled = scaler.fit_transform(train)
    close_price_indx = features.index("close")
    X_train, y_train = extract_seqX_outcomeY(train_scaled, window, window, close_price_indx)
    X_test = extract_test_data(features, data, test, window, scaler)
    model = create_model(X_train)
    history = model.fit(X_train, y_train, epochs=epochs, batch_size=len(train), verbose=1, shuffle=False, validation_split=0.1)

    predicted_price = model.predict(X_test)
    predicted_price = close_scaler.inverse_transform(predicted_price)[:, 0]
    actual_price = test["close"].values
    rmse = calculate_rmse(actual_price, predicted_price)
    mape = calculate_mape(actual_price, predicted_price)
    direction = calculate_dir(actual_price, predicted_price)
    url = upload_to_bucket(model, model_name, symbol)
    actual_ret = data[["date", "close"]].to_dict(orient="records")
    predicted_ret = pd.DataFrame(data={"date": data["date"][len(train):], "close": predicted_price}).to_dict(orient="records")
    loss_dict = {
        'loss': history.history['loss'],
        'val_loss': history.history['val_loss']
    }
    model_metadata = {
        "model_name": model_name,
        "model_type": model_type,
        "symbol": symbol,
        "start_date": start_date,
        "end_date": curr_date,
        "features": features,
        "epochs": epochs,
        "window": window,
        "url": url,
        "rmse": rmse,
        "mape": mape,
        "direction": direction,
        "predicted": predicted_ret,
        "loss": loss_dict,
        "created": curr_date,
        "running_predictions": [],
        "running_rmse": 0,
        "running_mape": 0,
        "running_direction": 0,
    }
    id = save_model_metadata(model_metadata)
    return jsonify({"model_id": id})


def upload_to_bucket(model, model_name, symbol):
    model.save(f"./models/{symbol.lower()}/{model_name}.keras")
    client = storage.Client()
    bucket = client.get_bucket(os.environ.get("BUCKET_NAME"))
    blob = bucket.blob(f"models/{symbol.lower()}/{model_name}.keras")
    blob.upload_from_filename(f"./models/{symbol.lower()}/{model_name}.keras")
    os.remove(f"./models/{symbol.lower()}/{model_name}.keras")
    return blob.public_url


def get_all_models():
    model_metadata = get_all_model_metadata()
    saved_ids = get_all_saved_models()
    return jsonify({"models": model_metadata, "saved_ids": saved_ids})


def get_model_info(id):
    model = get_model_by_id(id)
    data =  get_model_data(model["symbol"], model["end_date"])
    data = data[(data["date"] >= model["start_date"]) & (data["date"] < model["end_date"])]
    prices = data[["date", "close"]].to_dict(orient="records")
    model["actual"] = prices
    return jsonify(model)


def delete_model_info(id):
    model = get_model_by_id(id)
    url = model["url"]
    client = storage.Client()
    bucket = client.get_bucket(os.environ.get("BUCKET_NAME"))
    blob = bucket.blob("/".join(url.split("/")[-3:]))
    blob.delete()
    return jsonify(delete_model_by_id(id))


def get_model_settings():
    settings = {
        "stocks": [
                {
                    "name": "NVDA",
                    "features": get_features("NVDA"),
                    "minimum_date": get_minimum_date("NVDA")
                }
            ],
        "types": [
            "LSTM"
        ]
    }
    return jsonify(settings)