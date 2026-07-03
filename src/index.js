require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

require("./bot")(bot);

console.log("✅ Bot ishga tushdi...");
