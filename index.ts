import { SernEmitter } from "@sern/handler";
import { ActivityType } from "discord.js";
const { Client, GatewayIntentBits } = require("discord.js");
const { Sern } = require("@sern/handler");
require("dotenv").config();
const sernPrefix = process.env.PREFIX
const mongoose = require('mongoose');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions],
    restTimeOffset: 0
});

export const db = mongoose.connect(process.env.MONGODB, {useNewUrlParser: true,useUnifiedTopology: true}).then(async => {console.log('Connected to MongoDB');})

Sern.init({client,
    sernPrefix,
    commands : './commands',
    sernEmitter : new SernEmitter(),
    events: './events'});


client.on('ready', async () => {
    console.log("logged on!");
    setInterval(() => {
    const statuses = [
        { name: "Minecraft", type: ActivityType.Playing },
        { name: "cómo escribe Javi", type: ActivityType.Watching },
        { name: "a Hermes", type: ActivityType.Watching },
        { name: "tus comandos", type: ActivityType.Listening },
    ]
        var randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        client.user.setActivity(randomStatus);
      }, 10000);
});

client.login(process.env.TOKEN);