# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from services.stock_data import fetch_indices, fetch_stock_data
# from models.prediction import predict_stock
# import yfinance as yf


# app = Flask(__name__)
# CORS(app)

# @app.route('/api/indices', methods=['GET'])
# def get_indices():
#     indices = fetch_indices()
#     result = []

#     for index in indices:
#         price_data = fetch_stock_data(index["symbol"])
#         result.append({
#             "name": index["name"],
#             "symbol": index["symbol"],
#             "price": price_data["price"]
#         })

#     return jsonify(result)


# @app.route('/api/search', methods=['GET'])
# def search_stock():
#     query = request.args.get('query')
#     if not query:
#         return jsonify([])

#     try:
#         ticker = yf.Ticker(query.upper())
#         info = ticker.info

#         if 'shortName' in info:
#             return jsonify([{
#                 "symbol": query.upper(),
#                 "name": info.get("shortName", "N/A")
#             }])
#         else:
#             return jsonify([])

#     except Exception as e:
#         print("Error fetching stock:", e)
#         return jsonify([])


# @app.route('/api/predict', methods=['POST'])
# def predict():
#     symbol = request.json.get('symbol')
#     try:
#         result = predict_stock(symbol)
#         return jsonify(result)
#     except Exception as e:
#         print("Prediction Error:", e)
#         return jsonify({"error": "Internal server error"}), 500


# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
from services.stock_data import fetch_indices, fetch_stock_data, fetch_top_stocks
from models.prediction import predict_stock
import yfinance as yf

app = Flask(__name__)
CORS(app)

@app.route('/api/indices', methods=['GET'])
def get_indices():
    indices = fetch_indices()
    result = []

    for index in indices:
        ticker = yf.Ticker(index["symbol"])
        hist = ticker.history(period="2d")
        
        # Get current price
        price_data = fetch_stock_data(index["symbol"])
        
        # Calculate daily change if we have enough data
        change_percent = 0
        if len(hist) >= 2:
            prev_close = hist['Close'].iloc[-2]
            current_price = hist['Close'].iloc[-1]
            change_percent = ((current_price - prev_close) / prev_close) * 100

        result.append({
            "name": index["name"],
            "symbol": index["symbol"],
            "price": price_data["price"],
            "changePercent": round(change_percent, 2)  # Add this line
        })

    return jsonify(result)

@app.route('/api/search', methods=['GET'])
def search_stock():
    query = request.args.get('query')
    if not query:
        return jsonify([])

    try:
        ticker = yf.Ticker(query.upper())
        info = ticker.info

        if 'shortName' in info:
            return jsonify([{
                "symbol": query.upper(),
                "name": info.get("shortName", "N/A")
            }])
        else:
            return jsonify([])

    except Exception as e:
        print("Error fetching stock:", e)
        return jsonify([])

@app.route('/api/predict', methods=['POST'])
def predict():
    symbol = request.json.get('symbol')
    try:
        result = predict_stock(symbol)
        return jsonify(result)
    except Exception as e:
        print("Prediction Error:", e)
        return jsonify({"error": "Internal server error"}), 500

# ✅ New GET route to match frontend request
@app.route('/api/stocks/<symbol>/predict', methods=['GET'])
def predict_from_symbol(symbol):
    try:
        result = predict_stock(symbol)
        return jsonify(result)
    except Exception as e:
        print(f"Prediction Error for {symbol}:", e)
        return jsonify({"error": "Prediction not available yet"}), 500

@app.route('/api/top-stocks', methods=['GET'])
def get_top_stocks():
    try:
        gainers, losers = fetch_top_stocks()
        return jsonify({
            "gainers": gainers,
            "losers": losers
        })
    except Exception as e:
        print("Error fetching top stocks:", e)
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/stocks/<symbol>', methods=['GET'])
def get_stock_details(symbol):
    try:
        # Get basic price data
        stock_data = fetch_stock_data(symbol)
        
        # Get additional info from yfinance
        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="2d")
        
        # Calculate daily change if we have enough data
        change_percent = 0
        if len(hist) >= 2:
            prev_close = hist['Close'].iloc[-2]
            current_price = hist['Close'].iloc[-1]
            change_percent = ((current_price - prev_close) / prev_close) * 100

        return jsonify({
            "symbol": symbol,
            "name": info.get("shortName", symbol),
            "price": stock_data["price"],
            "changePercent": round(change_percent, 2),
            "previousClose": info.get("previousClose"),
            "open": info.get("open"),
            "dayLow": info.get("dayLow"),
            "dayHigh": info.get("dayHigh"),
            "volume": info.get("volume"),
            "marketCap": info.get("marketCap")
        })
    except Exception as e:
        print(f"Error fetching stock details for {symbol}: {e}")
        return jsonify({"error": "Failed to fetch stock details"}), 500

if __name__ == '__main__':
    app.run(debug=True)
