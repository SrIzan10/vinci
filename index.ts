import { SernEmitter } from "@sern/handler";
import { ActivityType, TextChannel, EmbedBuilder, Message, VoiceBasedChannel } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import { Sern } from "@sern/handler"
import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import youtubenotifications from "./util/youtubenotifications.js";
import { setIntervalAsync } from "set-interval-async";
import birthdays from "./util/birthdays.js";
const app = express();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates],
});

export const db = mongoose.connect(process.env.MONGODB as string).then(() => {console.log('Connected to MongoDB');})

Sern.init({
	client,
	commands : './commands',
	sernEmitter : new SernEmitter(),
	events: './events',
	defaultPrefix: process.env.PREFIX
});


client.on('ready', async () => {
	console.log("Logged on!");
	setInterval(() => {
	const statuses = [
		{ name: "Minecraft", type: ActivityType.Playing },
		{ name: "cómo escribe Javi", type: ActivityType.Watching },
		{ name: "a Hermes", type: ActivityType.Watching },
		{ name: "tus comandos", type: ActivityType.Listening },
		{ name: "tu voz", type: ActivityType.Listening },
		{ name: "ahora v1.0!", type: ActivityType.Playing }
	]
		const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
		// @ts-ignore
		client.user!.setActivity(randomStatus);
	  }, 10000);
});

client.on('rateLimit', async () => {
	console.log(`I just got ratelimited!`)
})

app.use(express.static("public"))

app.get("/", function (req, res) {
    res.send("<p>This is the monitoring server for the Vinci discord bot!</p><br><p>If you see this, the bot is up and running.</p>")
})

app.listen(process.env.PORT || 7272,
    () => console.log("The webserver is listening"));

client.login(process.env.TOKEN);

setIntervalAsync(async () => {
	await youtubenotifications(client)
}, 120_000);

setIntervalAsync(async () => {
	await birthdays(client)
}, 100);
// 3_600_000