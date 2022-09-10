const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    number: {type: Number, required: true}
})

const db = new mongoose.Model('counting', schema)

module.exports = db;