const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title:{
        type:String,
    },
    subtitle:{
        type:String,
    },
    image:{
        type:String,
    },
    description:{
        type:String,
    },
    category:{
        type:String,
    },
    event_date:{
        type:String
    },
    date:{
        type:Date,
    },
    button:{
        type:String
    },
    zoom:{
        type:String
    },
    link:{
        type:String
    },
  });

  module.exports = mongoose.model('post',PostSchema);