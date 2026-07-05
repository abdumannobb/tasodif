const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "cache.json");

let cache = {};

try {
  if (fs.existsSync(CACHE_FILE)) {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  }
} catch {
  cache = {};
}

function has(fileName) {
  return fileName in cache;
}

function get(fileName) {
  return cache[fileName];
}

module.exports = {
  has,
  get,
};
