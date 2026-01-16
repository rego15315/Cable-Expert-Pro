import os
from telegram import Update, WebAppInfo, MenuButtonWebApp
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

async def start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """处理 /start 命令"""
    webapp_url = os.getenv("WEBAPP_URL", "https://your-frontend-url.com")
    user_name = update.effective_user.first_name if update.effective_user else "用户"
    
    welcome_text = (
        f"👋 你好, {user_name}!\n\n"
        "欢迎使用 **WireExpert Pro** 官方 Bot。\n"
        "这是为您量身定制的 IEC 标准电工专家工具。\n\n"
        "⚡️ 电缆选型 | 🛡️ 国标防伪 | 📈 实时铜价"
    )
    
    # 设置左下角菜单按钮打开 WebApp
    await context.bot.set_chat_menu_button(
        chat_id=update.effective_chat.id,
        menu_button=MenuButtonWebApp(
            text="打开 WebApp",
            web_app=WebAppInfo(url=webapp_url)
        )
    )
    
    await update.message.reply_text(welcome_text, parse_mode="Markdown")

def setup_bot():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        print("Error: TELEGRAM_BOT_TOKEN not found.")
        return None
        
    application = ApplicationBuilder().token(token).build()
    application.add_handler(CommandHandler("start", start_handler))
    return application
