import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import { ApplicationCommandOptionType, GuildMember, TextChannel } from "discord.js";
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: 'timeout',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] }), ownerOnly()],
	description: 'ADMIN: Silencia a usuarios.',
	options: [
		{
			name: "usuario",
			description: "Escribe el usuario que silenciar.",
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: "razon",
			description: "Escribe el razon que vas a silenciar.",
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "minutos",
			description: "Escribe los minutos que estará silenciado.",
			type: ApplicationCommandOptionType.Number,
			min_value: 0,
			required: true
		}
	],
	//alias : [],
	execute: async (ctx, options) => {
		try {
			const usuario = options[1].getMember('usuario') as GuildMember
			const minutos = options[1].getNumber('minutos') as number
			const razon = options[1].getString('razon', true);
			const minutosToMilisegundos = minutos * 60 * 1000
			usuario.timeout(minutosToMilisegundos, razon).then(() => {ctx.reply({content: `Se ha silenciado a ${usuario} correctamente.`, ephemeral: true})})
			const sendToMods = ctx.client.guilds.cache.get('928018226330337280')!.channels.cache.get('1004118323258208257') as TextChannel
			await sendToMods.send({content: `Se ha silenciado a ${usuario}.\nSlencio efectuado por ${ctx.user} con ${minutos} minutos de duración.\nRazón: ${razon}`})
		} catch (e) {
			await ctx.reply({content: `ERROR: No puedo hacer este comando porque a lo mejor soy inferior que el rol de esa persona o estoy usándolo contra admins.`})
		}
	},
});