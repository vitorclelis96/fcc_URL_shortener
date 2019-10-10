const mongoose = require('mongoose');


const ShortUrlScheme = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    short: {
        type: Number,
        required: true,
        unique: true
    }
})


module.exports = ShortUrl = mongoose.model('shorturl', ShortUrlScheme);