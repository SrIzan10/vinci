const { commandModule, CommandType } = require('@sern/handler');
import { Context } from "@sern/handler";
import { ApplicationCommandOptionType, AttachmentBuilder, AutocompleteInteraction, EmbedBuilder } from "discord.js";
import { publish } from "../../src/plugins/publish";
const choices = ['XaviXE', 'Paula', 'William', 'Espejito2500', 'Wheelook', 'MarioCabrera', 'Paticama', 'Vinci', 'SrIzan', 'ItsAdrian', 'ByHGT', 'Irene'];

export default commandModule({
	name: 'a',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'A',
	//alias : [],
	options: [
		{
			name: 'usuario',
			description: 'Usuario que debería aparecer',
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			command: {
				onEvent: [],
				async execute(ctx: AutocompleteInteraction){
					const focusedValue = ctx.options.getFocused();
					const filtered = choices.filter(choice => choice.startsWith(focusedValue));
					await ctx.respond(
						filtered.map(choice => ({ name: choice, value: choice })),
					);
				}
			}
		}
	],
	execute: async (ctx, options) => {
		let option
		try {option = options[1].getString('usuario', true)} catch(error) {option = undefined}
			if (!option) {
				const imagesArray = [
					'./images/XaviXE.png',
					'./images/Paula.png',
					'./images/William.png',
					'./images/Espejito2500.png',
					'./images/Wheelook.png',
					'./images/MarioCabrera.png',
					'./images/Paticama.png',
					'./images/Vinci.png',
					'./images/SrIzan.png',
					'./images/ItsAdrian.png',
					'./images/ByHGT.png',
					'./images/Irene.png',
				]
				const images = imagesArray[Math.floor(Math.random() * imagesArray.length)];

				await ctx.reply({content: 'A', files: [images]});
			} else {
				if (choices.indexOf(options[1].getString('usuario', true)) > -1) {
					const attachmentbuilder = new AttachmentBuilder(`./images/${options[1].getString('usuario', true)}.png`)
					await ctx.reply({content: 'A', files: [attachmentbuilder]})
				} else {
					const embed = new EmbedBuilder()
						.setTitle("A no encontrado!")
						.setDescription(`Qué raro, no se ha encontrado ese /a...\nPorqué no pruebas a poner uno del autocompletado?`)
						.setColor("Red")
					await ctx.reply({embeds: [embed], ephemeral: true})
				}
			}
	},
});