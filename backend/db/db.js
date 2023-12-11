const { config } = require('dotenv');
const mongoose = require('mongoose');
require('dotenv').config();

const db = async () => {
    try {
        // Parse the MongoDB URL using the URL module
        const mongoURL = process.env.MONGO_URL
        
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('DB connected');
    } catch (error) {
        console.log('DB connection error:', error);
    }
}

module.exports = db;
