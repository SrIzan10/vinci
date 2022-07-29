import { SernEmitter } from "@sern/handler";
const { EconomyManager } = require('quick.eco');
const { Client, GatewayIntentBits } = require("discord.js");
const { Sern } = require("@sern/handler");
const dotenv = require("dotenv").config();
const sernPrefix = process.env.PREFIX
const token = process.env.TOKEN
const mongo = process.env.ECONOMY_MONGODB
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    restTimeOffset: 0
});
/*const eco = new EconomyManager({
    adapter: 'mongo',
    adapterOptions: {
        collection: 'money', // => Collection Name
        uri: mongo // => Mongodb uri
    }
});*/

Sern.init({client,
    sernPrefix,
    commands : './commands',
    sernEmitter : new SernEmitter(),
    events: './events'});

client.on('ready', async (messages) => {
    console.log("logged on!")
})

client.login(token);