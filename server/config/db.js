// mongo db connection setup

const mongoose = require('mongoose');

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/connectedTutors'

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
