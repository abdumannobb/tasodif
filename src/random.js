// random.js
const fs = require("fs");
const path = require("path");

const imagesFolder = path.join(__dirname, "..", "images");

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const images = fs
  .readdirSync(imagesFolder)
  .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()))
  .map((file) => path.join(imagesFolder, file));

if (images.length === 0) {
  throw new Error("images papkasida rasm topilmadi.");
}

const users = new Map();

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function createQueue(lastImage = null) {
  const queue = shuffle(images);

  if (lastImage && queue.length > 1 && queue[0] === lastImage) {
    [queue[0], queue[1]] = [queue[1], queue[0]];
  }

  return queue;
}

function getRandomImage(userId) {
  let user = users.get(userId);

  if (!user) {
    user = {
      queue: createQueue(),
      last: null,
    };

    users.set(userId, user);
  }

  if (user.queue.length === 0) {
    user.queue = createQueue(user.last);
  }

  const image = user.queue.pop();

  user.last = image;

  return image;
}

module.exports = {
  getRandomImage,
};
