const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"


export default commandModule({
	name: 'sugerencias',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280'])],
	description: 'Sugerencias para el bot.',
	//alias : [],
	execute: async (ctx, args, interaction) => {
		const modal = new ModalBuilder()
		.setCustomId('sugerencias')
		.setTitle('Sugerencias. (SE ENVIA A SR IZAN)');

			// Create the text input components
			const input = new TextInputBuilder()
				.setCustomId('sugerenciasInput')
				// The label is the prompt the user sees for this input
				.setLabel("Algunas sugerencias para Vinci?")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Paragraph);
			// An action row only holds one text input,
			// so you need one action row per text input.
			const suggestionsActionRow = new ActionRowBuilder().addComponents(input);
			// Add inputs to the modal
			modal.addComponents(suggestionsActionRow);
			await ctx.interaction.showModal(modal);
	}
});