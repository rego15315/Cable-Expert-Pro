import random
from datetime import datetime
from typing import List, Dict

class MarketService:
    _current_price = 9392.50
    _history: List[Dict] = []

    @classmethod
    def fetch_copper_price(cls):
        # 模拟市场跳动: 9000-9500 范围，带正负 2% 波动
        change_pct = random.uniform(-0.02, 0.02)
        cls._current_price = round(cls._current_price * (1 + change_pct), 2)
        
        # 限制在合理范围
        if cls._current_price < 9000: cls._current_price = 9000 + random.random() * 50
        if cls._current_price > 9500: cls._current_price = 9500 - random.random() * 50
        
        entry = {
            "time": datetime.now().strftime("%H:%M"),
            "price": cls._current_price
        }
        cls._history.append(entry)
        if len(cls._history) > 10: cls._history.pop(0)
        return cls._current_price

    @classmethod
    def get_market_data(cls):
        return {
            "price": cls._current_price,
            "history": cls._history,
            "updated_at": datetime.now().isoformat()
        }
