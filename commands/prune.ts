const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../src/plugins/publish";
import { ownerOnly } from "../src/plugins/ownerOnly";
import { ApplicationCommandOptionType } from 'discord.js'

export default commandModule({
	name: 'prune',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280']), ownerOnly()],
	description: 'ADMIN: Elimina hasta 100 mensajes',
	options: [{
		name: 'numero',
		description: 'Escribe un número',
		type: ApplicationCommandOptionType.Number,
		required: true,
		min_value: 2,
		max_value: 100
	}],
	//alias : [],
	execute: async (ctx, options) => {
		const amount = options[1].getNumber('numero', true);
		ctx.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			ctx.reply({content: 'Ha habido un error eliminando mensajes! (mira la consola, Sr Izan)', ephemeral: true});});
		await ctx.reply({content: `Se han eliminado ${amount} mensajes.`})
	},
});