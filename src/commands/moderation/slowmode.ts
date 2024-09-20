import { commandModule, CommandType } from '@sern/handler'

import { ownerOnly } from "#plugins";
import { ApplicationCommandOptionType, TextChannel } from "discord.js";

export default commandModule({
	name: 'slowmode',
    type: CommandType.Slash,
	plugins: [ownerOnly()],
	description: 'ADMIN: Pon modo lento a canales de texto',
	options: [
		{
			name: "segundos",
			description: "Los segundos de modo lento",
			type: ApplicationCommandOptionType.Number,
			required: true
		},
		{
			name: "razon",
			description: "La razón del modo lento",
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	//alias : [],
	execute: async (ctx) => {
		try {
			const seconds = ctx.options.getNumber("segundos", true);
			const reason = ctx.options.getString("razon", true);

			(ctx.channel as unknown as TextChannel).setRateLimitPerUser(seconds, reason)

			ctx.reply({content: `Se han añadido ${seconds} segundos de modo lento al canal de voz actual`})
			const sendToMods = ctx.client.guilds.cache.get(process.env.GUILDID!)!.channels.cache.get(process.env.MODLOGS_CHANNEL!) as unknown as TextChannel
			await sendToMods.send({content: `Se ha aplicado modo lento al canal ${ctx.channel}.\nEfectuado por ${ctx.user} con ${seconds} segundos de retardo.\nRazón: ${reason}`})
		} catch {
			ctx.reply({content: `No se ha podido aplicar modo lento al canal.`})
		}
	},
});