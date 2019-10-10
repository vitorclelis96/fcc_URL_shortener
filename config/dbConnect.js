const mongoose = require('mongoose');
require('dotenv').config();


const mongoUri = process.env.MONGO_URI;


const dbConnect = async () => {
    try {
        const dbConfig = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
        await mongoose.connect(mongoUri, dbConfig);
        console.log("DB Connected");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}


module.exports = dbConnect;
