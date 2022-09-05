import { SernEmitter } from "@sern/handler";
import axios from "axios";
import { ActivityType, TextChannel, EmbedBuilder, Message, VoiceBasedChannel } from "discord.js";
import { DOMParser } from "@xmldom/xmldom";
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

client.on('rateLimit', async () => {
	console.log(`I just got ratelimited!`)
})

async function twitchNotifications() {
	try {
	const fetch = require('node-superfetch');
	const users = ['SrIzan10'];
	for (const user of users) {

		if (user === 'SrIzan10') {
			var uptime = await fetch.get(`https://decapi.me/twitch/uptime/SrIzan10`)
			var avatar = await fetch.get(`https://decapi.me/twitch/avatar/SrIzan10`)
			var viewers = await fetch.get(`https://decapi.me/twitch/viewercount/SrIzan10`)
			var title = await fetch.get(`https://decapi.me/twitch/title/SrIzan10`)
			var game = await fetch.get(`https://decapi.me/twitch/game/SrIzan10`)
			// console.log(`[TWITCH] Starting to watch ${user}.`)
			let twitch = require('./twitchSchemas/SrIzan10');
			let data = twitch.findOne({title: title.body})
			if (uptime.body === `${user} is offline`) {} else {
				const embed = new EmbedBuilder()
				.setColor("Random")
				.setAuthor({name: `${user}`, iconURL: `${avatar.body}`})
				.setTitle(`${title.body}`)
				.setURL(`https://twitch.tv/${user}`)
				.setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-620x378.jpg`)
				.setFooter({text: `Viewers: ${viewers.body} | Juego: ${game.body}`});

				if (!data) {
					const newdata = new twitch({
						title: `${title.body}`
					})
					return await newdata.save()
				}

				if (data.title === title.body) return;

				const message1 = client.guilds.cache.get('928018226330337280').channels.cache.get('1013375527509295115') as TextChannel
				await message1.send({embeds: [embed]})

				await twitch.findOneAndUpdate({title: data.title}, {title: title.body})
			}
		}
	}
} catch (err) {console.log("[TWITCH] Twitch Errored out! " + err)}
}

async function twitchNotificationsInterval() {setInterval(await twitchNotifications, 120000)}

twitchNotificationsInterval()

/*async function nowPlayingRadio() {
		const getAPI = await axios.get("https://opml.radiotime.com/Describe.ashx?id=s67006", {validateStatus: function (status) {return status === 200|| status === 403}}).then((res) => res.data).catch((err) => {console.log("now playing radio errored out? diesofcringe")})
		var parser = new DOMParser()
		var XMLDoc = parser.parseFromString(getAPI, "text/xml");
		let getsong, getartist;
		try {
		getsong = XMLDoc.getElementsByTagName("current_song").item(0)!.textContent
		getartist = XMLDoc.getElementsByTagName("current_artist").item(0)!.textContent
		} catch (err) {
		getsong = "Anuncios o cambio de canción"
		getartist = "catJAM"
		}
		const embed = new EmbedBuilder()
			.setColor("Blurple")
			.setTitle(`Ahora reproduciendo: ${getsong}`)
			.setAuthor({name: 'Rock FM', iconURL: 'https://cdn-profiles.tunein.com/s67006/images/logoq.png'})
			.setDescription(`Artista: ${getartist}`)
			.setFooter({text: `El nombre no cambia al instante, aparece 10 segundos después de terminar una canción.`})
		const guild = await client.guilds.fetch("928018226330337280");
		const channel = await guild.channels.fetch("1008730592835281009");
		const edit = (await channel.messages.fetch("1008778179252596736"))
		await edit.edit({content: '', embeds: [embed]})
}

function nowPlayingInterval() {
	setInterval(nowPlayingRadio, 4000)
}

nowPlayingInterval()*/

client.login(process.env.TOKEN);