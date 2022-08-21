const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
import { ApplicationCommandOptionType } from "discord.js";
/*
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
*/

export default commandModule({
	name: 'timeout',
    type: CommandType.Both,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'], dmPermission: false, defaultMemberPermissions: null }), ownerOnly()],
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
		const usuario = options[1].getMember('usuario', true);
		const minutos = options[1].getNumber('minutos', true);
		const razon = options[1].getString('razon', true);
		const minutosToMilisegundos = minutos * 60 * 1000

		usuario.timeout(minutosToMilisegundos, razon).then(() => {ctx.reply({content: `Se ha silenciado a ${usuario} correctamente.`, ephemeral: true})})
		const sendToMods = ctx.client.guilds.cache.get('928018226330337280')!.channels.cache.get('1004118323258208257')
		await sendToMods.send({content: `Se ha silenciado a ${usuario}.\nSlencio efectuado por ${ctx.user} con ${minutos} minutos de duración.\nRazón: ${razon}`})
	}
	},
);