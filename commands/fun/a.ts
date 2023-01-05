import { commandModule, CommandType } from '@sern/handler';
import { Context } from '@sern/handler';
import {
	ApplicationCommandOptionType,
	AttachmentBuilder,
	AutocompleteInteraction,
	EmbedBuilder,
} from 'discord.js';
import { publish } from '#plugins';
const choices = [
	'XaviXE',
	'Paula',
	'William',
	'Espejito2500',
	'Wheelook',
	'MarioCabrera',
	'Paticama',
	'Vinci',
	'SrIzan',
	'ItsAdrian',
	'ByHGT',
	'Irene',
	'Boniato64',
	'Tormentarosa',
];

export default commandModule({
	name: 'a',
	type: CommandType.Slash,
	plugins: [publish()],
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
				async execute(ctx: AutocompleteInteraction) {
					const focusedValue = ctx.options.getFocused();
					const filtered = choices.filter((choice) =>
						choice.startsWith(focusedValue)
					);
					await ctx.respond(
						filtered.map((choice) => ({ name: choice, value: choice }))
					);
				},
			},
		},
	],
	execute: async (ctx, options) => {
		const option = options[1].getString('usuario');
		if (!option) {
			const imagesArray = [
				'./images/a/XaviXE.png',
				'./images/a/Paula.png',
				'./images/a/William.png',
				'./images/a/Espejito2500.png',
				'./images/a/Wheelook.png',
				'./images/a/MarioCabrera.png',
				'./images/a/Paticama.png',
				'./images/a/Vinci.png',
				'./images/a/SrIzan.png',
				'./images/a/ItsAdrian.png',
				'./images/a/ByHGT.png',
				'./images/a/Irene.png',
				'./images/a/Boniato64.png',
				'./images/a/Tormentarosa.png',
			];
			const images =
				imagesArray[Math.floor(Math.random() * imagesArray.length)];

			await ctx.reply({ content: 'A', files: [images] });
		} else {
			if (choices.indexOf(options[1].getString('usuario', true)) > -1) {
				const attachmentbuilder = new AttachmentBuilder(
					`./images/a/${options[1].getString('usuario', true)}.png`
				);
				await ctx.reply({ content: 'A', files: [attachmentbuilder] });
			} else {
				const embed = new EmbedBuilder()
					.setTitle('A no encontrado!')
					.setDescription(
						`Qué raro, no se ha encontrado ese /a...\nPorqué no pruebas a poner uno del autocompletado?`
					)
					.setColor('Red');
				await ctx.reply({ embeds: [embed], ephemeral: true });
			}
		}
	},
});
