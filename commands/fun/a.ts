const { commandModule, CommandType } = require('@sern/handler');
import { Context } from "@sern/handler";
import { ApplicationCommandOptionType, AttachmentBuilder, EmbedBuilder } from "discord.js";
import { publish } from "../../src/plugins/publish";
const choices = ['XaviXE', 'Paula', 'William', 'Espejito2500', 'Wheelook', 'MarioCabrera', 'Paticama', 'Vinci', 'SrIzan', 'ItsAdrian', 'ByHGT'];

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
				async execute(ctx){
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
		try {
			if (choices.indexOf(options[1].getString('usuario', true)) > -1) {
				const attachmentbuilder = new AttachmentBuilder(`./images/${options[1].getString('usuario', true)}.png`)
				const embed = new EmbedBuilder()
					.setTitle("A")
					.setImage(`attachment://${options[1].getString('usuario', true)}.png`)
					.setColor("Random")
				await ctx.reply({embeds: [embed], files: [attachmentbuilder]})
			} else {
				const embed = new EmbedBuilder()
					.setTitle("A no encontrado!")
					.setDescription(`Qué raro, no se ha encontrado ese /a...\nPorqué no pruebas a poner uno del autocompletado?`)
					.setColor("Red")
				await ctx.reply({embeds: [embed], ephemeral: true})
			}
			if (!options[1].getString('usuario', true)) {
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
					'./images/ByHGT.png'
				]
				const images = imagesArray[Math.floor(Math.random() * imagesArray.length)];

				await ctx.reply({content: 'A', files: [images]});
			}
	} catch (err) {}
	},
});