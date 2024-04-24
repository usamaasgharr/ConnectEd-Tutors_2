// mongo db connection setup
require('dotenv').config();

const mongoose = require('mongoose');

const url = process.env.MONGO_URL;

const connectDB = async () => {
  
  try {
    await mongoose.connect( url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Connection error:', error);
  }
};


module.exports = connectDB;
