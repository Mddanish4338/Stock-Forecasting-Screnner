import yfinance as yf
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_absolute_error, mean_absolute_percentage_error
import warnings
import numpy as np

warnings.filterwarnings("ignore")

def predict_stock(symbol):
    stock = yf.Ticker(symbol)
    history = stock.history(period='6mo')  # 6 months of data

    if history.empty or len(history) < 30:
        return {"error": "Not enough data for prediction"}

    close_prices = history['Close'].dropna()

    # ✅ Get the latest actual price
    current_price = close_prices.iloc[-1]

    # ✅ Moving Average (20-day)
    ma = close_prices.rolling(window=20).mean().iloc[-1]

    # ✅ RSI Calculation
    delta = close_prices.diff()
    gain = delta.where(delta > 0, 0).rolling(window=14).mean()
    loss = -delta.where(delta < 0, 0).rolling(window=14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs.iloc[-1]))

    # ✅ ARIMA Model for Forecasting
    model = ARIMA(close_prices, order=(5, 1, 0))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=5).tolist()

    # ✅ Evaluate Model Accuracy
    train_size = int(len(close_prices) * 0.9)
    train, test = close_prices[:train_size], close_prices[train_size:]

    test_model = ARIMA(train, order=(5, 1, 0))
    test_fit = test_model.fit()
    predictions = test_fit.forecast(steps=len(test))

    mae = mean_absolute_error(test, predictions)
    mape = mean_absolute_percentage_error(test, predictions) * 100

    # ✅ Additional Performance Data from yfinance
    info = stock.info
    performance_data = {
        "open_price": info.get("open"),
        "previous_close": info.get("previousClose"),
        "today_low": info.get("dayLow"),
        "today_high": info.get("dayHigh"),
        "week52_low": info.get("fiftyTwoWeekLow"),
        "week52_high": info.get("fiftyTwoWeekHigh")
    }

    return {
        "current_price": round(current_price, 2),
        "moving_average": round(ma, 2),
        "rsi": round(rsi, 2),
        "forecast": [round(price, 2) for price in forecast],
        "mae": round(mae, 2),
        "mape": round(mape, 2),
        **{key: round(val, 2) if val is not None else None for key, val in performance_data.items()}
    }
