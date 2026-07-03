const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "cache.json");

let cache = {};

if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    cache = {};
  }
}

function save() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function has(fileName) {
  return Object.prototype.hasOwnProperty.call(cache, fileName);
}

function get(fileName) {
  return cache[fileName];
}

function set(fileName, fileId) {
  cache[fileName] = fileId;
  save();
}

module.exports = {
  has,
  get,
  set,
};
