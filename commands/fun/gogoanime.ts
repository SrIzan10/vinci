import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../../src/plugins/publish.js';
import { ANIME } from '@consumet/extensions';
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
} from 'discord.js';
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'busca cosas en gogoanime',
	//alias : [],
	options: [
		{
			name: 'buscar',
			description: 'Busca un anime',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'palabra-clave',
					description: 'La palabra clave',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: 'capitulo',
			description: 'Mira los links de directo de cualquier capítulo (con su ID)',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'id-serie',
					description: 'El ID de la serie (búscalo primero)',
					type: ApplicationCommandOptionType.String,
					required: true
				},
				{
					name: 'id-capitulo',
					description: 'El ID del capítulo (usa el autocompletado)',
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
					command: {
						onEvent: [],
						execute: async (autocomplete) => {
							try {
								const focusedOption = autocomplete.options.getFocused();
								const gogoanime = new ANIME.Gogoanime();
								const serieOption = autocomplete.options.getString('id-serie', true)
								const fetch = await gogoanime.fetchAnimeInfo(serieOption)
								let choices = fetch.episodes!.filter((choice) => choice.number.toString().startsWith(focusedOption))
								choices = choices.slice(0, 25)
								await autocomplete.respond(
									choices.map((choice) => ({
										name: choice.number.toString(),
										value: choice.id.toString(),
									}))
								)
							} catch (err) {
								await autocomplete.respond([{name: 'Algo malo ha ocurrido! Asegúrate que hayas puesto el ID correctamente', value: 'error'}])
							}
						}
					}
				}
			],
		},
		{
			name: 'info',
			description: 'INGLÉS: Consigue información sobre alguna serie con su ID.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'id',
					description: 'El nombre de la serie',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		}
	],
	execute: async (ctx, options) => {
		const gogoanime = new ANIME.Gogoanime();
		const doubleslashregex = new RegExp('(?<!:)\/\/+')
		switch (options[1].getSubcommand()) {
			case 'buscar': {
				await ctx.interaction.deferReply()
				const option = options[1].getString('palabra-clave', true);
				const search = await gogoanime.search(option);
				const editedarray = await Promise.all(
					search.results
						.map((results) => {
							return `[${results.title}](<${results.url!.replace(doubleslashregex, '/')}>)`;
						})
						.slice(0, 5)
				);
				const editedarrayids = await Promise.all(
					search.results
						.map((results) => {
							return `[${results.id}](<${results.url!.replace(doubleslashregex, '/')}>)`;
						})
						.slice(0, 5)
				);
				const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('gogoanime-search-toid')
						.setLabel('Cambiar a ID')
						.setStyle(ButtonStyle.Secondary)
				);
				if (editedarray.length === 0) return await ctx.interaction.editReply({content: 'No se ha encontrado nada con ese resultado de búsqueda, prueba a ser más general o concreto idk'})
				const message = await ctx.interaction.editReply({
					content: `Resultados de la búsqueda \`${option}\`:\n${editedarray.join('\n')}`,
					components: [button],
				});
				const collector = message.createMessageComponentCollector({max: 1, componentType: ComponentType.Button, time: 30000})
				collector.on('collect', async (i) => {
					if (i.customId !== 'gogoanime-search-toid') return;
					await ctx.interaction.editReply({
						content: `Resultados de la búsqueda \`${option}\` (modo ID):\n${editedarrayids.join('\n')}`,
						components: []
					})
					await i.deferUpdate()
				})
			} break;
			case 'capitulo': {
				const selepisode = options[1].getString('id-capitulo', true)
				try {
					const search = await gogoanime.fetchEpisodeServers(selepisode)
					const arrayed = await Promise.all(search.map((server) => `[${server.name}](<${server.url!.replace(doubleslashregex, '/')}>)`))
					await ctx.reply({content: `Todos los servidores de \`${selepisode}\` (Vinci no se hace cargo de los enlaces):\n${arrayed.join('\n')}`})
				} catch (err) {
					await ctx.reply({content: 'Ha ocurrido un error! Asegúrate que hayas seleccionado bien un capítulo.'})
				}
			} break;
			case 'info': {
				try {
					const option = options[1].getString('id', true)
					const info = await gogoanime.fetchAnimeInfo(option)
					const embed = new EmbedBuilder()
						.setColor('Random')
						.setTitle(`${info.title}`)
						.setURL(info.url!.replace(doubleslashregex, '/'))
						.setThumbnail(info.image!)
						.setFields(
							{name: 'Géneros', value: `${info.genres!.join(', ')}`},
							{name: 'Fecha de salida', value: `${info.releaseDate!}`, inline: true},
							{name: 'Capítulos totales', value: `${info.totalEpisodes!}`, inline: true},
							{name: '\u200B', value: '\u200B', inline: true},
							{name: 'Tipo', value: `${info.type!}`, inline: true},
						)

					await ctx.reply({embeds: [embed]})
				} catch (err) {
					await ctx.reply({content: 'Algo malo ha ocurrido, asegúrate que hayas escrito el ID correctamente\nTip: Usa el comando de buscar y conviértelos a ID.'})
				}
			} break;
		}
	},
});
