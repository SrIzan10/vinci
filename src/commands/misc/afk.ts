import { commandModule, CommandType } from '@sern/handler'
import db from '../../schemas/afk.js';
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';

export default commandModule({
    type: CommandType.Slash,
	plugins: [],
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
		},
		{
			name: 'lista',
			description: 'Listado de todas las personas AFK',
			type: ApplicationCommandOptionType.Subcommand
		}
	],
	execute: async (ctx) => {
		switch (ctx.options.getSubcommand()) {
			case 'añadir': {
				if (await db.exists({ id: ctx.user.id })) return ctx.reply({ content: 'Ya existes en la base de datos!', ephemeral: true })
				const reason = ctx.options.getString('motivo');

				await (new db({ id: ctx.user.id, reason: reason })).save()
				const embed = new EmbedBuilder()
					.setAuthor({ name: ctx.user.username, iconURL: ctx.user.displayAvatarURL() })
					.setTitle('AFK añadido!')
					.setColor('Green')
					.setDescription(`Razón: ${reason}`)
				
				await ctx.reply({ embeds: [embed] })
			} break;
			case 'eliminar': {
				if (!await db.exists({ id: ctx.user.id })) return ctx.reply({ content: 'No existes en la base de datos!', ephemeral: true })
				
				await db.deleteOne({ id: ctx.user.id })

				await ctx.reply('Ok, has sido eliminado correctamente de la base de datos.')
			} break;
			case 'lista': {
				const map = await Promise.all((await db.find()).map(async (doc) => {
					return `${await ctx.client.users.fetch(doc.id)}`
				}))

				await ctx.reply({
					content: `Lista de usuarios AFK:\n${(map.length === 0) ? 'Nadie' : map.join(', ')}`,
					allowedMentions: { repliedUser: false }
				})
			} break;
		}
	},
});