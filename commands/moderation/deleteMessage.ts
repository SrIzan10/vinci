const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
import { ApplicationCommandOptionType, TextChannel } from "discord.js";
/*
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
*/

export default commandModule({
	name: 'eliminarmensaje',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280']), ownerOnly()],
	description: 'ADMIN: Elimina comandos por su ID.',
	//alias : [],
	options: [
		{
			name: 'canal',
			type: ApplicationCommandOptionType.Channel,
			description: 'El canal de texto.',
			required: true
		},
		{
			name: 'id',
			type: ApplicationCommandOptionType.String,
			description: 'El ID del mensaje.',
			required: true
		}
	],
	execute: async (ctx, options) => {
		const idMensaje = options[1].getString('id', true);
		const channelID = options[1].getChannel('canal', true).id || ctx.channel.id
		const guildId = ctx.guild.id
		const guild = await ctx.client.guilds.fetch(guildId);
		const channel = await guild.channels.fetch(channelID);
		(await channel.messages.fetch(idMensaje)).delete();
		await ctx.reply({content: 'Mensaje eliminado correctamente.', ephemeral: true});
	},
});