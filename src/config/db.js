const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const os = require('os');

let fallbackDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'db');
try {
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
} catch (e) {
  fallbackDir = path.join(os.tmpdir(), 'sankalp-db');
  if (!fs.existsSync(fallbackDir)) {
    fs.mkdirSync(fallbackDir, { recursive: true });
  }
}

let isFallbackMode = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is empty. Activating Local JSON File Fallback DB.');
    isFallbackMode = true;
    return;
  }

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas successfully.');
  } catch (error) {
    console.error('❌ Mongoose connection failed:', error.message);
    console.warn('⚠️ Activating Local JSON File Fallback DB.');
    isFallbackMode = true;
  }
};

// Simple helper to read JSON database files
const getLocalData = (collectionName) => {
  const filePath = path.join(fallbackDir, `${collectionName}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

// Simple helper to write JSON database files
const saveLocalData = (collectionName, data) => {
  const filePath = path.join(fallbackDir, `${collectionName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Generic JSON Fallback Query Engine
const fallbackQuery = {
  isFallback: () => isFallbackMode,
  
  find: (collection) => {
    return getLocalData(collection);
  },
  
  findById: (collection, id) => {
    const items = getLocalData(collection);
    return items.find(item => item._id === id);
  },
  
  create: (collection, doc) => {
    const items = getLocalData(collection);
    const newDoc = {
      _id: doc._id || Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      ...doc
    };
    items.push(newDoc);
    saveLocalData(collection, items);
    return newDoc;
  },
  
  findByIdAndUpdate: (collection, id, update) => {
    const items = getLocalData(collection);
    const index = items.findIndex(item => item._id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...update, updatedAt: new Date().toISOString() };
      saveLocalData(collection, items);
      return items[index];
    }
    return null;
  },
  
  findByIdAndDelete: (collection, id) => {
    const items = getLocalData(collection);
    const index = items.findIndex(item => item._id === id);
    if (index !== -1) {
      const removed = items.splice(index, 1);
      saveLocalData(collection, items);
      return removed[0];
    }
    return null;
  }
};

module.exports = { connectDB, fallbackQuery };
