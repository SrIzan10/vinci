import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js";
import { ApplicationCommandOptionType, TextChannel } from 'discord.js'

export default commandModule({
	name: 'prune',
    type: CommandType.Slash,
	plugins: [publish(), ownerOnly()],
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
			const amount = options[1].getNumber('numero', true) as number
			(ctx.channel as TextChannel).bulkDelete(amount).catch(err => {
				console.error(err);
				ctx.reply({content: 'Ha habido un error eliminando mensajes! (mira la consola, Sr Izan)', ephemeral: true});});
			await ctx.reply({content: `Se han eliminado ${amount} mensajes.`})
			const sendToMods = ctx.client.guilds.cache.get(process.env.GUILDID!)!.channels.cache.get(process.env.MODLOGS_CHANNEL!) as TextChannel
			await sendToMods.send({content: `Se han eliminado ${amount} mensajes en ${ctx.channel}\nEfectuado por ${ctx.user}.`})
		} catch (e){
			ctx.reply({content: 'Ha habido un error eliminando mensajes! Error reportado automáticamente.', ephemeral: true})};
		}
});