const path = require("path");

const { getRandomImage } = require("./random");
const cache = require("./cache");

const busyUsers = new Set();

module.exports = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(msg.chat.id, "🎲 Random tugmasini bosing.", {
      reply_markup: {
        keyboard: [[{ text: "🎲 Random" }]],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });
  });

  bot.on("message", async (msg) => {
    if (msg.text !== "🎲 Random") return;

    const chatId = msg.chat.id;
    const userId = msg.from.id;

    if (busyUsers.has(userId)) return;

    busyUsers.add(userId);

    let loadingMessage = null;

    try {
      loadingMessage = await bot.sendMessage(
        chatId,
        "🎲 Tasodifiy rasm tanlanmoqda...",
      );

      await bot.sendChatAction(chatId, "upload_photo");

      await new Promise((resolve) => setTimeout(resolve, 500));

      const imagePath = getRandomImage(userId);

      const fileName = path.basename(imagePath);

      let response;

      if (cache.has(fileName)) {
        response = await bot.sendPhoto(chatId, cache.get(fileName));
      } else {
        response = await bot.sendPhoto(chatId, imagePath);

        const fileId = response.photo[response.photo.length - 1].file_id;

        cache.set(fileName, fileId);
      }

      if (loadingMessage) {
        await bot.deleteMessage(chatId, loadingMessage.message_id);
      }
    } catch (err) {
      console.log(err);

      if (loadingMessage) {
        try {
          await bot.deleteMessage(chatId, loadingMessage.message_id);
        } catch {}
      }

      await bot.sendMessage(chatId, "❌ Xatolik yuz berdi.");
    } finally {
      busyUsers.delete(userId);
    }
  });
};
