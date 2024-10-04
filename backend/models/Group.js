const mongoose = require("mongoose");
 
const GroupSchema = new mongoose.Schema({
  name: String,
  emoji: String,
  desc: String,
  background: String,
}, {timestamps: true});


module.exports = mongoose.model('Group', GroupSchema)