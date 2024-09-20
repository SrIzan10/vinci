import { commandModule, CommandType } from '@sern/handler'
import google from 'googlethis'
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
    type: CommandType.Slash,
	plugins: [],
	description: 'Busca cosas en Google.',
	//alias : [],
	options: [
		{
			name: 'busqueda',
			description: 'Escribe qué quieres buscar',
			type: ApplicationCommandOptionType.String,
			required: true,
		}
	],
	execute: async (ctx) => {
		await ctx.interaction.deferReply()
		const prompt = ctx.options.getString('busqueda', true)

		const search = await Promise.all((await google.search(prompt)).results.map(res => {
			return `[${res.title}](<${res.url}>)`
		}).slice(0, 5))
		await ctx.interaction.editReply({
			content: `Resultados para la búsqueda \`${prompt}\`:\n${search.join('\n')}`
		})
	},
});