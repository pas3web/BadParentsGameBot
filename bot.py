from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackContext
from dotenv import load_dotenv
import os
import asyncio

load_dotenv(dotenv_path=".env_badparents")

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
print(f"Loaded Telegram Token: {TELEGRAM_TOKEN}")  # Для отладки

async def start(update: Update, context: CallbackContext) -> None:
    keyboard = [[InlineKeyboardButton("Start App", web_app=WebAppInfo(url="https://pas3web.github.io/BadParentsGameBot/"))]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text('Welcome to BadParents Game!', reply_markup=reply_markup)

async def main():
    application = Application.builder().token(TELEGRAM_TOKEN).build()

    application.add_handler(CommandHandler("start", start))

    await application.initialize()
    await application.start()
    await application.updater.start_polling()

    # Это важно, чтобы приложение не завершалось сразу
    while True:
        await asyncio.sleep(3600)  # Бесконечный цикл ожидания

    await application.stop()
    await application.updater.stop()
    await application.shutdown()

if __name__ == '__main__':
    asyncio.run(main())

