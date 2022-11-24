import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js";
import { ApplicationCommandOptionType, EmbedBuilder, GuildMember, TextChannel } from 'discord.js'

export default commandModule({
	name: 'ban',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] }), ownerOnly()],
	description: 'ADMIN: Banea usuarios.',
	options: [{
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
	}],
	//alias : [],
	execute: async (ctx, options) => {
		try {
			const userToBan = options[1].getMember('usuario') as GuildMember
			const reason = options[1].getString('razon') as string
			userToBan.ban({reason: reason})
			const sendToMods = ctx.client.guilds.cache.get(process.env.GUILDID!)!.channels.cache.get(process.env.MODLOGS_CHANNEL!) as TextChannel
			await sendToMods.send({content: `Se ha baneado a ${userToBan}.\nBan efectuado por ${ctx.user} con razón "${reason}."`})
			await ctx.reply({content: 'Baneado correctamente!', ephemeral: true})
		} catch (e) {
			await ctx.reply({content: `ERROR: No puedo hacer este comando porque a lo mejor soy inferior que el rol de esa persona o estoy usándolo contra admins.`})
		}
	},
});