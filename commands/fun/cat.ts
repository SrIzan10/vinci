const { commandModule, CommandType } = require('@sern/handler');
import { Context } from "@sern/handler";
import axios from "axios";
import { ActionRowBuilder, APIMessageActionRowComponent, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { publish } from "../../src/plugins/publish";
/*
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
*/

export default commandModule({
	name: 'gato',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'QUIEN HA DICHO GATOS?!?!?!',
	//alias : [],
	options: [],
	execute: async (ctx: Context, options) => {
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
	},
});