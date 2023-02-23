import { commandModule, CommandType } from '@sern/handler'
import { publish } from "#plugins";
import { ApplicationCommandOptionType } from 'discord.js';
import { getWikipedia, searchWikipedia, SearchWikipediaObject } from '../../util/wikipedia.js';

export default commandModule({
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'Busca cosas por wikipedia',
	//alias : [],
	options: [
		{
			name: 'español',
			description: 'Busca cosas por Wikipedia en español',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'busqueda',
					description: 'Escribe qué buscar.',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
					command: {
						onEvent: [],
						execute: async (ctx) => {
							const search = await searchWikipedia('es', ctx)
							await ctx.respond(
								search.map(res => ({ name: res.title.toString(), value: res.pageid.toString() }))
							)
						}
					}
				}
			]
		},
		{
			name: 'ingles',
			description: 'Busca cosas por Wikipedia en inglés',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'search',
					description: 'Escribe qué buscar.',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
					command: {
						onEvent: [],
						execute: async (ctx) => {
							const search = await searchWikipedia('en', ctx)
							await ctx.respond(
								search.map(res => ({ name: res.title.toString(), value: res.pageid.toString() }))
							)
						}
					}
				}
			]
		}
	],
	execute: async (ctx, [, options]) => {
		switch (options.getSubcommand()) {
			case 'español': {
				getWikipedia('es', ctx, options)
			} break;
			case 'ingles': {
				getWikipedia('en', ctx, options)
			} break;
		}
	},
});