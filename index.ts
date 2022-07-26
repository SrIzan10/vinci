const { Client, GatewayIntentBits } = require("discord.js");
const { Sern } = require("@sern/handler");
const dotenv = require("dotenv").config();
const sernPrefix = process.env.PREFIX
const token = process.env.TOKEN
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent]
});
const TLauncherWords = [
    "T Launcher",
    "tlauncher",
    "Tlauncher",
    "TLauncher",
    "T launcher",
    "t launcher"
]

Sern.init({client,sernPrefix,commands : './commands'});

client.on('ready', () => {
    console.log("logged on!")
})

client.on('message', message => {
    if (message.content.startsWith(TLauncherWords)) {
    	message.reply("Hola!\nTLauncher no se puede utilizar en el servidor oficial de Minecraft debido a la gran vulnerabilidad que nos supone tenerlo no premium.\nSi tienes una cuenta premium, puedes pedir permiso con el comando /mcform.\nGracias\n*Este mensaje es automatizado. Si ha sido un error, siento mucho molestar!*")
  }
})

client.login(token);