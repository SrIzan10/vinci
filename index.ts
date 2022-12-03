import { SernEmitter } from '@sern/handler';
import { ActivityType } from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { Sern } from '@sern/handler';
import { config as dotenv } from 'dotenv';
import mongoose from 'mongoose';
import youtubenotifications from './util/youtubenotifications.js';
import { setIntervalAsync } from 'set-interval-async';
import birthdays from './util/birthdays.js';
import twitternotifications from './util/twitternotifications.js';
import webserver from './util/web/webserver.js'

let devMode
if (process.argv[2] === '--dev') {
	devMode = true
	dotenv({path: '.env.dev'})
	console.clear()
} else {
	dotenv()
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildVoiceStates,
	],
});

mongoose.connect(process.env.MONGODB!).then(() => {
	console.log('Connected to MongoDB');
});

Sern.init({
	client,
	commands: './dist/commands',
	sernEmitter: new SernEmitter(),
	events: './dist/events',
	defaultPrefix: process.env.PREFIX,
});

client.on('ready', async () => {
	console.log('Logged on!');
	setInterval(() => {
		const statuses = [
			{ name: 'Minecraft', type: ActivityType.Playing },
			{ name: 'cómo escribe Javi', type: ActivityType.Watching },
			{ name: 'quinto libro when', type: ActivityType.Watching },
			{ name: 'a Hermes', type: ActivityType.Watching },
			{ name: 'tus comandos', type: ActivityType.Listening },
			{ name: 'tu voz', type: ActivityType.Listening },
			{ name: 'ahora v1.0!', type: ActivityType.Playing },
		];
		const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
		// @ts-ignore
		client.user!.setActivity(randomStatus);
	}, 10000);

	if (!devMode) {
		setIntervalAsync(async () => {
			await youtubenotifications(client);
		}, 120_000);

		// setIntervalAsync(async () => {
		// 	await twitternotifications(client);
		// }, 120_000);

		setIntervalAsync(async () => {
			await birthdays(client);
		}, 3_600_000);
		webserver()
	} else {
		console.log('DevMode got activated, there are no checkers or webserver in this version.')
	}
});

client.on('rateLimit', async () => {
	console.log(`I just got ratelimited!`);
});

client.login(process.env.TOKEN);
