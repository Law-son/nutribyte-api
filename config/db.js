const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://eyarko:%40password123@lawsonscluster.l1vqepq.mongodb.net/nutribyte';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

module.exports = mongoose;