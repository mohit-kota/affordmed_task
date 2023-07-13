const fs = require('fs');
const path = require('path');

const localStoragePath = path.join(__dirname, 'localStorage.json');

let localStorageData = {};

// Load local storage data from file
const loadLocalStorage = () => {
  try {
    const data = fs.readFileSync(localStoragePath, 'utf-8');
    localStorageData = JSON.parse(data);
  } catch (error) {
    // File does not exist or unable to read, so use an empty object
    localStorageData = {};
  }
};

// Save local storage data to file
const saveLocalStorage = () => {
  const data = JSON.stringify(localStorageData);
  fs.writeFileSync(localStoragePath, data, 'utf-8');
};

// Get an item from local storage
const getItem = (key) => {
  loadLocalStorage();

  const item = localStorageData[key];
  if (item && item.expiresAt && item.expiresAt > Date.now()) {
    return item.value;
  }

  return null;
};

// Set an item in local storage with an expiry time
const setItem = (key, value, expiresInMs) => {
  loadLocalStorage();

  const expiresAt = Date.now() + expiresInMs;
  localStorageData[key] = { value, expiresAt };
  saveLocalStorage();
};

module.exports = { getItem, setItem };
