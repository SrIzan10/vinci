const mongoose = require('mongoose');
const schema = new mongoose.Schema({ 
  id: {type: String, required: true},
  times: {type: Number, required: true}
});
const db = mongoose.model("warn", schema);
module.exports = db;