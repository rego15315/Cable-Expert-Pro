import os
from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from api.bot import setup_bot
from api.services.calculator import CableCalculatorService
from api.services.market import MarketService
from api.services.ai import AIService
from telegram import Update
import uvicorn
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="WireExpert Pro Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

bot_app = setup_bot()

scheduler = AsyncIOScheduler()
# 每小时抓取一次真实价格
scheduler.add_job(MarketService.fetch_copper_price, 'interval', hours=1)
# 每天清理一次旧数据
scheduler.add_job(MarketService.cleanup_old_data, 'cron', hour=3)

@app.on_event("startup")
async def on_startup():
    if bot_app:
        await bot_app.initialize()
        webhook_url = os.getenv("WEBHOOK_URL")
        if webhook_url:
            await bot_app.bot.set_webhook(url=webhook_url)
    scheduler.start()
    # 启动时先抓取一次
    MarketService.fetch_copper_price()

@app.post("/tg-webhook")
async def telegram_webhook(request: Request):
    if not bot_app: return {"ok": False}
    data = await request.json()
    update = Update.de_json(data, bot_app.bot)
    await bot_app.process_update(update)
    return {"ok": True}

@app.post("/api/calculate")
async def calculate_api(data: dict):
    return CableCalculatorService.calculate(data)

@app.get("/api/market/price")
async def market_api(range: str = Query("1h")):
    """行情数据接口，支持 range=1h, 1d, 1m"""
    return MarketService.get_market_data(range)

@app.post("/api/chat")
async def chat_api(data: dict):
    prompt = data.get('prompt', '')
    lang = data.get('lang', 'cn')
    answer = await AIService.chat(prompt, lang)
    return {"text": answer}

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)
