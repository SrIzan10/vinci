import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import { ApplicationCommandOptionType, TextChannel } from "discord.js";
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: 'eliminarmensaje',
    type: CommandType.Slash,
	plugins: [publish(), ownerOnly()],
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
		try {
			const idMensaje = options[1].getString('id', true);
			const guildId = ctx.guild.id
			const guild = await ctx.client.guilds.fetch(guildId);
			const channel = await guild.channels.fetch(ctx.channel!.id);
			(await (channel as TextChannel).messages.fetch(idMensaje)).delete();
			await ctx.reply({content: 'Mensaje eliminado correctamente.', ephemeral: true});
		} catch {
			await ctx.reply({content: `ERROR: No se ha podido eliminar el mensaje, asegúrate que estás usando el ID y el canal correcto.`})
		}
	},
});