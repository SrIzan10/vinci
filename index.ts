import { SernEmitter } from "@sern/handler";
import { ActivityType, TextChannel, EmbedBuilder, Message, VoiceBasedChannel } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";
import { Sern } from "@sern/handler"
import 'dotenv/config'
import mongoose from 'mongoose'
import youtube from 'discord-bot-youtube-notifications'
import express from 'express'
const app = express();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates],
});

export const db = mongoose.connect(process.env.MONGODB as string).then(() => {console.log('Connected to MongoDB');})

Sern.init({
	client,
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