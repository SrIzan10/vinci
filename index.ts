import { DefaultLogging, makeDependencies, single, Singleton } from '@sern/handler';
import { ActivityOptions, ActivityType } from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { Sern } from '@sern/handler';
import { config as dotenv } from 'dotenv';
import mongoose from 'mongoose';
import youtubenotifications from './util/youtubenotifications.js';
import { setIntervalAsync } from 'set-interval-async';
import birthdays from './util/birthdays.js';
import minecraftstatus from './util/minecraftstatus.js';
import Spotify from 'spotify-api.js';
// import giveawaychecker from './util/giveawaychecker.js';

let devMode: boolean
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

const spotifyClient = await Spotify.Client.create({
	token: { clientID: process.env.SPOTIFY_CLIENT!, clientSecret: process.env.SPOTIFY_SECRET! },
})

interface MyDependencies extends Dependencies {
    '@sern/client' : Singleton<Client>;
    '@sern/logger' : Singleton<DefaultLogging>
}

await makeDependencies<MyDependencies>({
    build: (root) => root
		.add({ '@sern/client': single(() => client) })
		.add({ 'spotify-api-client': single(() => spotifyClient) })
});

Sern.init({
	commands: 'dist/commands',
	events: 'dist/events',
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
		] as ActivityOptions[];
		const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
		client.user.setActivity(randomStatus);
	}, 10000);

	if (!devMode) {
		setIntervalAsync(async () => {
			await youtubenotifications(client);
		}, 120_000);

		setIntervalAsync(async () => {
			await birthdays(client);
		}, 3_600_000);

		setIntervalAsync(async () => {
			await minecraftstatus(client);
		}, 20_000);
	} else {
		console.log('DevMode got activated, there are no checkers in this version.')
	}
});

// export const scamLinks = await axios.get('https://api.hyperphish.com/gimme-domains').then(res => res.data as Array<string>)

client.login(process.env.TOKEN);
