const mongoose = require("mongoose")

const twitchModel = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})

const twitch = mongoose.model("SrIzan10-twitch-schema", twitchModel)

module.exports = twitch;