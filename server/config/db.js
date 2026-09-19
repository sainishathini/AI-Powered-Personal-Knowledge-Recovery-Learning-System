const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/memorymap';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.host}`);
  } catch (error) {
    console.log(`[MongoDB Status] MongoDB connection skipped/unavailable (${error.message}). Running with In-Memory Store for competition demo.`);
  }
};

module.exports = connectDB;
