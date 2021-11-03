const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeamSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    name:{
        type:String,
        required:true
    },
    post_name:{
        type:String
    },
    post_place:{
        type:String
    },
    image1:{
        type:String,
        required:true
    },
    image2:{
        type:String,
        required:true
    },
    portfolio:{
        type:String
    },
    facebook:{
        type:String
    },
    instagram:{
        type:String
    },
    telegram:{
        type:String
    },
    linkedin:{
        type:String
    },
    email:{
        type:String
    },
    campus_profile:{
        type:String
    },
    github:{
        type:String
    },
  });

  module.exports = mongoose.model('team',TeamSchema);