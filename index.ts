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

// client.on('messageCreate', (message: Message) => {})
async function nowPlayingRadio() {
        const getAPI = await axios.get("https://opml.radiotime.com/Describe.ashx?id=s67006").then((res) => res.data)
        let getsong, getartist
        var parser = new DOMParser()
        var XMLDoc = parser.parseFromString(getAPI, "text/xml");
        try {
        getsong = XMLDoc.getElementsByTagName("current_song").item(0)!.textContent
        getartist = XMLDoc.getElementsByTagName("current_artist").item(0)!.textContent
        } catch (err) {
            setTimeout("", 10000)
            getsong = XMLDoc.getElementsByTagName("current_song").item(0)!.textContent
            getartist = XMLDoc.getElementsByTagName("current_artist").item(0)!.textContent
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
    setInterval(nowPlayingRadio, 5000)
}

nowPlayingInterval()

client.login(process.env.TOKEN);