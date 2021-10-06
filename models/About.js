const mongoose = require('mongoose');
const { Schema } = mongoose;

const AboutSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    event_date:{
        type:String,
        required:true
    },
    date:{
        type:Date,
    },
    button:{
        type:String
    },
    link:{
        type:String
    },
  });

  module.exports = mongoose.model('about',AboutSchema);