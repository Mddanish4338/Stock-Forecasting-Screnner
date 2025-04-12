import yfinance as yf
import pandas as pd

def fetch_indices():
    return [
        {"name": "NIFTY 50", "symbol": "^NSEI"},
        {"name": "SENSEX", "symbol": "^BSESN"},
        {"name": "BANK NIFTY", "symbol": "^NSEBANK"}
    ]

def fetch_stock_data(symbol):
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="1d")

        if not data.empty:
            price = data["Close"].iloc[-1]
        else:
            price = ticker.info.get('regularMarketPrice', "N/A")

        return {
            "symbol": symbol,
            "price": round(price, 2) if isinstance(price, (int, float)) else "N/A"
        }

    except Exception as e:
        print(f"Error fetching price for {symbol}: {e}")
        return {"symbol": symbol, "price": "N/A"}

def fetch_top_stocks():
    # Commonly tracked top NIFTY stocks (you can expand this list)
    nifty_stocks = [
        "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "ICICIBANK.NS",
        "ITC.NS", "KOTAKBANK.NS", "LT.NS", "HINDUNILVR.NS", "VEDL.NS",
        "SBIN.NS", "WIPRO.NS", "BAJFINANCE.NS", "HCLTECH.NS", "TATAMOTORS.NS"
    ]

    data = []

    for symbol in nifty_stocks:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="2d")  # fetch 2 days to calculate change

            if len(hist) >= 2:
                today = hist['Close'].iloc[-1]
                yesterday = hist['Close'].iloc[-2]
                change = ((today - yesterday) / yesterday) * 100
                info = ticker.info
                data.append({
                    "symbol": symbol,
                    "name": info.get("shortName", symbol),
                    "price": round(today, 2),
                    "changePercent": round(change, 2)
                })
        except Exception as e:
            print(f"Error fetching top stock data for {symbol}: {e}")

    # Sort gainers and losers
    sorted_data = sorted(data, key=lambda x: x["changePercent"], reverse=True)
    top_gainers = sorted_data[:5]
    top_losers = sorted_data[-5:][::-1]

    return top_gainers, top_losers
