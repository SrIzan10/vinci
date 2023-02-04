import { commandModule, CommandType } from '@sern/handler'
import { publish } from "#plugins";
import { ownerOnly } from "#plugins"
import db from '../../schemas/afk.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
/*
import { publish } from "#plugins";
import { ownerOnly } from "#plugins"
*/

export default commandModule({
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'afk command',
	//alias : [],
	options: [
		{
			name: 'añadir',
			description: 'Di que estás AFK o inactivo por la razón que quieras.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'motivo',
					description: 'El motivo por el que estarás AFK',
					type: ApplicationCommandOptionType.String,
					required: true,
				}
			]
		},
		{
			name: 'eliminar',
			description: 'Elimina tu AFK',
			type: ApplicationCommandOptionType.Subcommand
		}
	],
	execute: async (ctx, options) => {
		switch (options[1].getSubcommand()) {
			case 'añadir': {
				if (await db.exists({ id: ctx.user.id })) return ctx.reply({ content: 'Ya existes en la base de datos!', ephemeral: true })
				const reason = options[1].getString('motivo', true);

				await (new db({ id: ctx.user.id, reason: reason })).save()
				const embed = new EmbedBuilder()
					.setAuthor({ name: ctx.user.username, iconURL: ctx.user.displayAvatarURL() })
					.setTitle('AFK añadido!')
					.setColor('Green')
					.setDescription(`AFK añadido!\nRazón: ${reason}`)
				
				await ctx.reply({ embeds: [embed] })
			} break;
			case 'eliminar': {
				if (!await db.exists({ id: ctx.user.id })) return ctx.reply({ content: 'No existes en la base de datos!', ephemeral: true })
				
				await db.deleteOne({ id: ctx.user.id })

				await ctx.reply('Ok, has sido eliminado correctamente de la base de datos.')
			} break;
		}
	},
});