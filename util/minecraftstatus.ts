import { Client, ColorResolvable, EmbedBuilder, Message, TextChannel } from "discord.js";
import axios from 'axios'
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import https from 'node:https'

export default async function minecraftstatus(client: Client) {
    dayjs.extend(utc)
    dayjs.extend(timezone)

    const request = await axios.get('https://api.minetools.eu/ping/minecraft.maraturing.com/25565', {
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    }).then(res => res.data)
    const fetchMsg = await (await client.channels.fetch('1063944267258662922')! as TextChannel).messages.fetch('1063950406474010674') as Message
    
    let onlineorelse: string
    let colorcode: ColorResolvable
    if (request.error) {
        onlineorelse = 'Offline'
        colorcode = '#8B0000'
    } else {
        onlineorelse = 'Online'
        colorcode = 'Green'
    }

    let embed = new EmbedBuilder()
        .setThumbnail('https://api.minetools.eu/favicon/minecraft.maraturing.com/25565')
        .setColor(colorcode)
        .setTitle('Estado del servidor')
        .setFooter({ text: `Última actualización: ${dayjs().tz('Europe/Madrid').format('DD/MM/YYYY HH:mm:ss')}` })
    
    if (onlineorelse === 'Offline') {
        embed = embed.setFields(
            { name: 'Estado', value: onlineorelse, inline: true }
        )
    } else {
        embed = embed.setFields(
            { name: 'Estado', value: onlineorelse, inline: true },
            { name: 'Ping', value: parseInt(request.latency.toString()).toString(), inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: 'Jugadores online', value: request.players.online.toString(), inline: true },
            { name: 'Jugadores máximos', value: request.players.max.toString(), inline: true },
        )
    }
    await fetchMsg.edit({
        content: '',
        embeds: [embed]
    })
}