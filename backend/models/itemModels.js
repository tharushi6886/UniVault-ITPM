const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({

  item_id:{
    type:String,
    required:true
  },

  item_name:{
    type:String,
    required:true
  },

  description:{
    type:String
  },

  category:{
    type:String
  },

  item_condition:{
    type:String,
    enum:["new","used","damaged"]
  },

  brand:{
    type:String
  },

  colour:{
    type:String
  },

  item_type:{
    type:String,
    enum:["sell","lost","found"],
    required:true
  },

  availability_status:{
    type:String,
    enum:["available","not_available"],
    default:"available"
  },

  approval_status:{
    type:String,
    enum:["pending","approved","rejected"],
    default:"pending"
  },

  price:{
    type:Number
  },

  quantity:{
    type:Number
  }

});

module.exports = mongoose.model("Item", itemSchema);