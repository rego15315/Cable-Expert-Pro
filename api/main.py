import os
from fastapi import FastAPI, Request
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

# 配置 CORS，允许本地开发联调
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 Bot
bot_app = setup_bot()

# 初始化定时任务
scheduler = AsyncIOScheduler()
scheduler.add_job(MarketService.fetch_copper_price, 'interval', minutes=30)

@app.on_event("startup")
async def on_startup():
    if bot_app:
        await bot_app.initialize()
        webhook_url = os.getenv("WEBHOOK_URL")
        if webhook_url:
            await bot_app.bot.set_webhook(url=webhook_url)
    scheduler.start()

@app.post("/tg-webhook")
async def telegram_webhook(request: Request):
    """接收来自 Telegram 的 Webhook 推送"""
    if not bot_app: return {"ok": False}
    data = await request.json()
    update = Update.de_json(data, bot_app.bot)
    await bot_app.process_update(update)
    return {"ok": True}

@app.post("/api/calculate")
async def calculate_api(data: dict):
    """电缆选型接口"""
    return CableCalculatorService.calculate(data)

@app.get("/api/market/price")
async def market_api():
    """行情数据接口"""
    return MarketService.get_market_data()

@app.post("/api/chat")
async def chat_api(data: dict):
    """AI 代理接口"""
    prompt = data.get('prompt', '')
    lang = data.get('lang', 'cn')
    answer = await AIService.chat(prompt, lang)
    return {"text": answer}

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)
