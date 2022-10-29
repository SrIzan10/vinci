import { commandModule, CommandType } from '@sern/handler'
import axios from "axios";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { publish } from "../../src/plugins/publish.js";
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: 'animal',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'Enseña un animal',
	//alias : [],
	options: [
		{
			name: 'gato',
			description: 'Enseña un gato',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'capybara',
			description: 'Enseña un capybara',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'zorro',
			description: 'Enseña un zorro',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'perro',
			description: 'what the dog doin',
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: 'mapache',
			description: 'Enseña un mapache',
			type: ApplicationCommandOptionType.Subcommand
		}
	],
	execute: async (ctx, options) => {
		switch (options[1].getSubcommand()) {
			case 'gato': {
				const request = await axios.get(`https://api.thecatapi.com/v1/images/search?api_key=${process.env.CATAPI}`).then(res => res.data)
				const embed = new EmbedBuilder()
					.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
					.setColor("Random")
					.setImage(request[0].url)
					.setFooter({text: `ID: ${request[0].id}`})
					.setTitle('Gato')
				const row = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setCustomId("cat-upvote")
							.setEmoji("⬆️")
							.setStyle(ButtonStyle.Success),
							new ButtonBuilder()
							.setCustomId("cat-downvote")
							.setEmoji("⬇️")
							.setStyle(ButtonStyle.Danger),
					)
				const rowdisabled = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setCustomId("cat-upvote")
							.setEmoji("⬆️")
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
							new ButtonBuilder()
							.setCustomId("cat-downvote")
							.setEmoji("⬇️")
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				)
				const message = await ctx.reply({embeds: [embed], components: [row]})
				const collector = message.createMessageComponentCollector({time: 30000, componentType: ComponentType.Button})
				collector.on('collect', async (i) => {
					await i.deferReply({ephemeral: true})
					if (i.customId === "cat-upvote") {
						await axios.post(`https://api.thecatapi.com/v1/votes?api_key=${process.env.CATAPI}`, {
							"image_id": request[0].id,
							"sub_id": i.user.id,
							"value": 1
						})
						i.editReply({content: "Has votado positivamente al gato con ID " + "`" + request[0].id + "`"})
					}
					if (i.customId === "cat-downvote") {
						await axios.post(`https://api.thecatapi.com/v1/votes?api_key=${process.env.CATAPI}`, {
							"image_id": request[0].id,
							"sub_id": i.user.id,
							"value": -1
						})
						i.editReply({content: "Has votado negativamente al gato con ID " + "`" + request[0].id + "`"})
					}
				})
				collector.on('end', async (i) => {
					await message.edit({components: [rowdisabled]})
				})
			}
			case 'capybara': {
				const request = await axios('https://api.capybara-api.xyz/v1/image/random').then(res => res.data)
				const requestfacts = await axios('https://api.capybara-api.xyz/v1/facts/random').then(res => res.data)
				const embed = new EmbedBuilder()
					.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
					.setTitle('Capybara')
					.setDescription(`Fun fact: ${requestfacts.fact}`)
					.setColor('Random')
					.setImage(request.image_urls.medium)
					.setFooter({text: `ID: ${request.id}`})
				await ctx.interaction.reply({embeds: [embed]})
			}
			case 'zorro': {
				const request = await axios('https://randomfox.ca/floof/').then(res => res.data)
				const embed = new EmbedBuilder()
					.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
					.setTitle('Zorro')
					.setColor('Random')
					.setImage(request.image)
				await ctx.interaction.reply({embeds: [embed]})
			}
			case 'perro': {
				const request = await axios.get(`https://api.thedogapi.com/v1/images/search?api_key=${process.env.DOGAPI}`).then(res => res.data)
				const embed = new EmbedBuilder()
					.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
					.setColor("Random")
					.setImage(request[0].url)
					.setFooter({text: `ID: ${request[0].id}`})
					.setTitle('Perro')
				const row = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setCustomId("dog-upvote")
							.setEmoji("⬆️")
							.setStyle(ButtonStyle.Success),
							new ButtonBuilder()
							.setCustomId("dog-downvote")
							.setEmoji("⬇️")
							.setStyle(ButtonStyle.Danger),
					)
				const rowdisabled = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(
						new ButtonBuilder()
							.setCustomId("dog-upvote")
							.setEmoji("⬆️")
							.setStyle(ButtonStyle.Success)
							.setDisabled(true),
							new ButtonBuilder()
							.setCustomId("dog-downvote")
							.setEmoji("⬇️")
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true),
				)
				const message = await ctx.reply({embeds: [embed], components: [row]})
				const collector = message.createMessageComponentCollector({time: 30000, componentType: ComponentType.Button})
				collector.on('collect', async (i) => {
					await i.deferReply({ephemeral: true})
					if (i.customId === "dog-upvote") {
						await axios.post(`https://api.thedogapi.com/v1/votes?api_key=${process.env.DOGAPI}`, {
							"image_id": request[0].id,
							"sub_id": i.user.id,
							"value": 1
						})
						i.editReply({content: "Has votado positivamente al gato con ID " + "`" + request[0].id + "`"})
					}
					if (i.customId === "dog-downvote") {
						await axios.post(`https://api.thedogapi.com/v1/votes?api_key=${process.env.DOGAPI}`, {
							"image_id": request[0].id,
							"sub_id": i.user.id,
							"value": -1
						})
						i.editReply({content: "Has votado negativamente al gato con ID " + "`" + request[0].id + "`"})
					}
				})
				collector.on('end', async () => {
					await message.edit({components: [rowdisabled]})
				})
			}
			case 'mapache': {
				const request = await axios('https://some-random-api.ml/animal/raccoon').then(res => res.data)
				const embed = new EmbedBuilder()
					.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
					.setTitle('Mapache')
					.setDescription(`Fun fact: ${request.fact}`)
					.setColor('Random')
					.setImage(request.image)
				await ctx.interaction.reply({embeds: [embed]})
			}
		}
	},
});