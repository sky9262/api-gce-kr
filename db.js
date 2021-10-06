const mongoose = require('mongoose')
const dotenv = require('dotenv');


dotenv.config();


const connectToMongo = ()=>{
    mongoose.connect(process.env.MONGODB_URI, ()=>{
        console.log("Connected to mongoose :-)");
    })
}

module.exports = connectToMongo