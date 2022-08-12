const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
import { ApplicationCommandOptionType } from "discord.js";

export default commandModule({
	name: 'slowmode',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280']), ownerOnly()],
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
	execute: async (ctx, options) => {
		const seconds = options[1].getNumber("segundos", true);
		const reason = options[1].getString("razon", true);

		ctx.channel.setRateLimitPerUser(seconds, reason)

		ctx.reply({content: `Se han añadido ${seconds} segundos de modo lento al canal de voz actual`})
		const sendToMods = ctx.client.guilds.cache.get('928018226330337280')!.channels.cache.get('1004118323258208257')
		await sendToMods.send({content: `Se ha aplicado modo lento al canal ${ctx.channel}.\nEfectuado por ${ctx.user} con ${seconds} segundos de retardo.\nRazón: ${reason}`})
	},
});