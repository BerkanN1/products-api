const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  
  urlCode: String,
  longUrl: String,
  shortUrl: String,
  date: { type: String, default: Date.now },
  deadline: { type: Number, default: Date.now },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  tag: String,
  user:{
    type:mongoose.Schema.Types.ObjectId,
  }
  

});

module.exports = mongoose.model("Product", ProductSchema);
