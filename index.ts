import { eventModule, EventType, SernEmitter } from "@sern/handler";

const { Client, GatewayIntentBits } = require("discord.js");
const { Sern } = require("@sern/handler");
const dotenv = require("dotenv").config();
const sernPrefix = process.env.PREFIX
const token = process.env.TOKEN
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
});

Sern.init({client,
    sernPrefix,
    commands : './commands',
    sernEmitter : new SernEmitter(),
    events : [
        { 
        absPath: process.cwd(),
        mod: eventModule({
          type: EventType.Sern,
          name : 'error',
          execute(err) {
            console.log(err);
          }
        })
        }
      ]});

client.on('ready', () => {
    console.log("logged on!")
})

client.login(token);