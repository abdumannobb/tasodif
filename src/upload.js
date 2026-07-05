require("dotenv").config();

const fs = require("fs");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false,
});

const CHAT_ID = 1075248041;

const imagesFolder = path.join(__dirname, "..", "images");
const cacheFile = path.join(__dirname, "cache.json");

const cache = fs.existsSync(cacheFile)
  ? JSON.parse(fs.readFileSync(cacheFile, "utf8"))
  : {};

(async () => {
  const files = fs.readdirSync(imagesFolder);

  for (const file of files) {
    if (cache[file]) {
      console.log(`⏩ ${file} o'tkazildi`);
      continue;
    }

    const imagePath = path.join(imagesFolder, file);

    try {
      const msg = await bot.sendPhoto(CHAT_ID, imagePath);

      const fileId = msg.photo[msg.photo.length - 1].file_id;

      cache[file] = fileId;

      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));

      console.log(`✅ ${file}`);
    } catch (err) {
      console.log(`❌ ${file}`, err.message);
    }
  }

  console.log("🎉 Tugadi");
  process.exit();
})();
