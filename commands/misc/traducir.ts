import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import axios from 'axios';
import { readFileSync } from 'node:fs'
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js';
const choices = ['es', 'en', 'fr', 'de', 'hi', 'it', 'ja', 'ko', 'pl']
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
    type: CommandType.Slash,
	plugins: [publish()],
	// , '928018226330337280'
	description: 'Traduce lo que quieras!',
	//alias : [],
	options: [
		{
			name: 'frase',
			description: 'La frase que traducir',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'idioma',
			description: 'El idioma al que quieras traducir',
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
			command: {
				onEvent: [],
				execute: async (interaction) => {
					const focusedValue = interaction.options.getFocused();
					const filtered = choices.filter(choice => choice.startsWith(focusedValue))
					await interaction.respond(
						filtered.map((choice) => ({
							name: choice,
							value: choice,
						}))
					);
				}
			}
		}
	],
	execute: async (ctx, options) => {		
		const langToTranslate = options[1].getString('idioma', true)
		const stringToTranslate = options[1].getString('frase', true)
		if (choices.indexOf(langToTranslate) === -1)
			return ctx.reply({content: 'Elige un idioma del autocompletado.'})

		await ctx.interaction.deferReply()
		
		const before = performance.now()

		const request = await axios.post('https://translate.nvda.es/translate',
			{
				q: stringToTranslate,
				source: "auto",
				target: langToTranslate,
				format: "text",
				api_key: ""
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		).then(res => res.data)

		const button = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('translate-original')
					.setLabel('Texto original')
					.setStyle(ButtonStyle.Primary)
			)

		const after = performance.now()

		const embed = new EmbedBuilder()
			.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
			.setTitle(`La traducción pedida. He tardado \`${(after - before).toFixed(2)}ms\`.`)
			.setDescription(request.translatedText as string)
			.setFooter({text: 'Traducido por LibreTranslate'})
		
		const message = await ctx.interaction.editReply({embeds: [embed], components: [button]})
		const collector = message.createMessageComponentCollector({componentType: ComponentType.Button, time: 60_000})

		collector.on('collect', async (i) => {
			if (i.customId !== 'translate-original') return

			await i.reply({content: `La traducción original es:\n\`\`\`${stringToTranslate}\`\`\``, ephemeral: true})
		})
	},
});