require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');

const CONNECTION_URI = process.env.CONNECTION_URI; // Read from .env

if (!CONNECTION_URI) {
  console.error('CONNECTION_URI is missing. Check your .env file.');
  process.exit(1);
}

async function testMongoDBConnection() {
  try {
    await mongoose.connect(CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

testMongoDBConnection();
