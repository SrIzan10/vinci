const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly";
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'

export default commandModule({
	name: 'kick',
    type: CommandType.Both,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'], dmPermission: false, defaultMemberPermissions: null }), ownerOnly()],
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
	execute: async (ctx, options, message) => {
		const userToBan = options[1].getMember('usuario', true);
		const reason = options[1].get('razon', true).value;
		const kickEmbed = new EmbedBuilder()
			.setTitle('Nuevo kick.')
			.setDescription(`Kick efectuado por <@${ctx.author}>.\nRazón: ${reason}.`);
		userToBan.kick(reason)
		const sendToMods = ctx.client.guilds.cache.get('928018226330337280')!.channels.cache.get('1004118323258208257')
		await sendToMods.send({content: `Se ha expulsado a ${userToBan}.\nKick efectuado por ${ctx.user} con razón "${reason}."`})
		await ctx.reply({content: 'Expulsado correctamente!'})
	},
});