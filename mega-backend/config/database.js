const mongoose = require('mongoose');
require('dotenv').config();



exports.connect = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('MongoDB Connected');
    }).catch((err) => {
        console.log("config/database.js: " + err);
        process.exit(1);
    });
}