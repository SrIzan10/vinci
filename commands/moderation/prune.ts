const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly";
import { ApplicationCommandOptionType } from 'discord.js'

export default commandModule({
	name: 'prune',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] }), ownerOnly()],
	description: 'ADMIN: Elimina hasta 100 mensajes',
	options: [{
		name: 'numero',
		description: 'Escribe un número',
		type: ApplicationCommandOptionType.Number,
		required: true,
		min_value: 1,
		max_value: 100
	}],
	//alias : [],
	execute: async (ctx, options) => {
		try {
			const amount = options[1].getNumber('numero', true);
			ctx.channel.bulkDelete(amount, true).catch(err => {
				console.error(err);
				ctx.reply({content: 'Ha habido un error eliminando mensajes! (mira la consola, Sr Izan)', ephemeral: true});});
			await ctx.reply({content: `Se han eliminado ${amount} mensajes.`})
			const sendToMods = ctx.client.guilds.cache.get('928018226330337280')!.channels.cache.get('1004118323258208257')
			await sendToMods.send({content: `Se han eliminado ${amount} mensajes en ${ctx.channel}\nEfectuado por ${ctx.user}.`})
		} catch (e){
			ctx.reply({content: 'Ha habido un error eliminando mensajes! Error reportado automáticamente.', ephemeral: true})};
		}
});