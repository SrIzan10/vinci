import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js";
import { ApplicationCommandOptionType, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'

export default commandModule({
	name: 'kick',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] }), ownerOnly()],
	description: 'ADMIN: Expulsa usuarios.',
	options: [
	{
		name: 'usuario',
		description: 'Escribe un usuario.',
		type: ApplicationCommandOptionType.User,
		required: true
	},
	{
		name: 'razon',
		description: 'Escribe la razón.',
		type: ApplicationCommandOptionType.String,
		required: true
	}
],
	//alias : [],
	execute: async (ctx, options) => {
		try {
			const userToKick = options[1].getMember('usuario');
			const reason = options[1].getString('razon') as string;
			(userToKick as GuildMember).kick(reason)
			const sendToMods = ctx.client.guilds.cache.get('928018226330337280')!.channels.cache.get('1004118323258208257') as TextChannel
			await sendToMods!.send({content: `Se ha expulsado a ${userToKick}.\nKick efectuado por ${ctx.user} con razón "${reason}."`})
			await ctx.reply({content: 'Expulsado correctamente!'})
		} catch (e) {
			await ctx.reply({content: `ERROR: No puedo hacer este comando porque a lo mejor soy inferior que el rol de esa persona o estoy usándolo contra admins.`})
		}
	},
});