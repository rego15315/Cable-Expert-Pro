import yfinance as yf
from sqlalchemy import create_engine, Column, Float, DateTime, Integer, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import os

Base = declarative_base()

class CopperPrice(Base):
    __tablename__ = 'copper_prices'
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    price = Column(Float)

# 使用 SQLite 存储
engine = create_engine('sqlite:///wireexpert.db')
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

class MarketService:
    @classmethod
    def fetch_copper_price(cls):
        """抓取最新的铜价并存入数据库"""
        try:
            # HG=F 是纽约商品交易所(COMEX)的铜期货，通常作为全球参考
            ticker = yf.Ticker("HG=F")
            data = ticker.history(period="1d")
            if not data.empty:
                latest_price = round(data['Close'].iloc[-1] * 2204.62, 2) # 从 每磅 转换为 每公吨
                
                session = Session()
                new_record = CopperPrice(price=latest_price)
                session.add(new_record)
                session.commit()
                session.close()
                return latest_price
        except Exception as e:
            print(f"Fetch Error: {e}")
            return None

    @classmethod
    def get_market_data(cls, range_type='1h'):
        """根据范围获取历史数据"""
        session = Session()
        now = datetime.utcnow()
        
        if range_type == '1d':
            start_time = now - timedelta(days=1)
        elif range_type == '1m':
            start_time = now - timedelta(days=30)
        else: # 1h
            start_time = now - timedelta(hours=24) # 默认展示过去24小时的小时级数据

        query = session.query(CopperPrice).filter(CopperPrice.timestamp >= start_time).order_by(CopperPrice.timestamp.asc())
        records = query.all()
        
        # 获取最新单价
        latest = session.query(CopperPrice).order_by(CopperPrice.timestamp.desc()).first()
        current_price = latest.price if latest else 9392.50
        
        history = [
            {
                "time": r.timestamp.strftime("%m-%d %H:%M" if range_type == '1m' else "%H:%M"),
                "price": r.price
            } for r in records
        ]
        
        session.close()
        return {
            "price": current_price,
            "history": history,
            "updated_at": latest.timestamp.isoformat() if latest else now.isoformat()
        }

    @classmethod
    def cleanup_old_data(cls):
        """清理超过一年的数据"""
        session = Session()
        one_year_ago = datetime.utcnow() - timedelta(days=365)
        session.query(CopperPrice).filter(CopperPrice.timestamp < one_year_ago).delete()
        session.commit()
        session.close()
