import { SernEmitter } from "@sern/handler";
import { ActivityType } from "discord.js";
const { Client, GatewayIntentBits } = require("discord.js");
const { Sern } = require("@sern/handler");
require("dotenv").config();
const sernPrefix = process.env.PREFIX
const mongoose = require('mongoose');
const youtube = require('discord-bot-youtube-notifications');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates],
    restTimeOffset: 0
});

export const db = mongoose.connect(process.env.MONGODB, {useNewUrlParser: true,useUnifiedTopology: true}).then(async => {console.log('Connected to MongoDB');})

Sern.init({
    client,
    sernPrefix,
    commands : './commands',
    sernEmitter : new SernEmitter(),
    events: './events'
});


client.on('ready', async () => {
    console.log("logged on!");
    setInterval(() => {
    const statuses = [
        { name: "Minecraft", type: ActivityType.Playing },
        { name: "cómo escribe Javi", type: ActivityType.Watching },
        { name: "a Hermes", type: ActivityType.Watching },
        { name: "tus comandos", type: ActivityType.Listening },
        { name: "tu voz", type: ActivityType.Listening }
    ]
        var randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(randomStatus);
      }, 10000);
});

const Notifier = new youtube.notifier(client, {
    // Default message
    message: "@everyone **¡HAY NUEVO VIDEO EN EL CANAL DE MARA!**\nRecomiendo verlo, es muy chulo.\nURL: {url}",

    // Time interval to check for new uploads
    updateTime: 60000, // in milliseconds,

    // Give the mongo URI if you wanna save data in mongoose otherwise quick.db is used
    mongoURI: process.env.MONGODB,

    // Auto send the embed to the provided channel
    autoSend: true, // if false you will get A "upload" event

    // The youtube data v3 API key, Send this if you want updates to be fast and precise because without the key it take 10-15 minutes more time to get latest videos
    apiKey: process.env.YOUTUBE_API,
});
const youtube_channel_id = "UC9G2yvrtrPeJFEzwlshg5HA";
const discord_channel_id = "948690278498320404";
Notifier.addNotifier(youtube_channel_id, discord_channel_id);

client.login(process.env.TOKEN);