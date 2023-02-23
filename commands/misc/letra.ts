import { commandModule, CommandType } from '@sern/handler'
import { publish } from "#plugins";
import Genius from 'genius-lyrics'
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

const genius = new Genius.Client(process.env.GENIUS)

export default commandModule({
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'Busca la letra de una canción (Genius)',
	//alias : [],
	options: [
		{
			name: 'busqueda',
			description: 'Qué buscar',
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
			command: {
				onEvent: [],
				execute: async (ctx) => {
					const input = ctx.options.getFocused();
					const choices = (await genius.songs.search(input)).map(res => {
						return `${res.title} - ${res.artist.name}|${res.id}`
					})
					await ctx.respond(
						choices.map(choice => {
							const [title, id] = choice.split('|')
							return ({name: title, value: id})
						})
					)
				}
			}
		}
	],
	execute: async (ctx, options) => {
		await ctx.interaction.deferReply({ ephemeral: true })
		const prompt = options[1].getString('busqueda', true)

		const result = await genius.songs.get(Number(prompt))

		const embed = new EmbedBuilder()
			.setTitle(`${result.title} - ${result.artist.name}`)
			.setColor('Random')
			.setDescription((await result.lyrics()).slice(0, 3000))
		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setLabel('URL de Genius')
					.setStyle(ButtonStyle.Link)
					.setURL(result.url)
			)

		await ctx.interaction.editReply({
			embeds: [embed],
			components: [button]
		})
	},
});