import { commandModule, CommandType } from '@sern/handler';
import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ModalActionRowComponentBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	ModalSubmitInteraction,
	ApplicationCommandOptionType,
} from 'discord.js';
import { publish } from '../../src/plugins/publish.js';
import { ownerOnly } from '../../src/plugins/ownerOnly.js';
import padyama from '../../schemas/padyama.js';
import { randomnumbergen } from '../../util/randomnumbergen.js';

export default commandModule({
	name: 'askjavi',
	type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'TEMP: Pregunta a Javi LO QUE SEA!',
	//alias : [],
	options: [
		{
			name: 'new',
			description: 'Haz una nueva pregunta',
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: 'get',
			description: 'Mira una pregunta, mirando su ID.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'id',
					description: 'El ID de la pregunta',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		},
		{
			name: 'you',
			description: 'Todos los IDs de las preguntas que hayas hecho',
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
	execute: async (ctx, options) => {
		switch (ctx.interaction.options.getSubcommand()) {
			case 'new': {
				const modal = new ModalBuilder()
					.setCustomId('askjavi')
					.setTitle('Sugerencias');
				const input = new TextInputBuilder()
					.setCustomId('askjavi-prompt')
					.setLabel('Qué quieres preguntarle?')
					.setStyle(TextInputStyle.Paragraph);
				const suggestionsActionRow =
					new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
						input
					);
				modal.addComponents(suggestionsActionRow);
				const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('askjavi-buttons-yes')
						.setLabel('Sí!')
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId('askjavi-buttons-no')
						.setLabel('Ok mejor no')
						.setStyle(ButtonStyle.Danger)
				);
				const message = await ctx.reply({
					content: `No puedes enviar sugerencias inútiles o spam.\nSi haces esto, serás descalificado.\nSabiendo esto, continuas?`,
					components: [buttons],
					ephemeral: true,
				});
				const collector = message.createMessageComponentCollector({
					max: 1,
					componentType: ComponentType.Button,
					time: 60_000,
				});
				collector.on('collect', async (i) => {
					if (i.customId === 'askjavi-buttons-yes') {
						const suggestionid = randomnumbergen(5);
						await i.showModal(modal);
						await ctx.interaction.editReply({
							components: [],
						});
						const submitted = (await ctx.interaction
							.awaitModalSubmit({
								time: 60000,
								filter: (i) => i.user.id === ctx.user.id,
							})
							.catch((error) => {})) as ModalSubmitInteraction;
						const db = new padyama({
							id: i.user.id,
							user: i.user.username,
							suggestionid: suggestionid,
							suggestion: submitted.fields.getTextInputValue('askjavi-prompt'),
						});
						await db.save();
						await submitted.reply({
							content: `Tu pregunta ha sido registrada en la base de datos correctamente.\nEl ID de esta pregunta es: \`${suggestionid}\`. Se te contactará por DMs cuando se responda la pregunta.\nApunta bien tu ID!`,
							ephemeral: true,
						});
					}
					if (i.customId === 'askjavi-buttons-no') {
						await ctx.interaction.editReply({
							content: 'Ok pues...',
							components: [],
						});
					}
				});
			}
			case 'get': {
					const option = options[1].getString('id')
					const db = await padyama.findOne({suggestionid: option})
					if (db?.suggestion !== undefined) return await ctx.reply({content: `La sugerencia es:\n${db?.suggestion}`, ephemeral: true})
					else return await ctx.reply({content: `Parece que ese ID no se ha encontrado...`, ephemeral: true})
			}
			case 'you': {
				const db = await padyama.find({id: ctx.user.id})
				await ctx.reply({content: `Los IDs de las preguntas que has hecho:\n${db.map((doc) => `\`${doc.suggestionid}\``)}`, ephemeral: true})
			}
		}
	},
});
