import { commandModule, CommandType } from '@sern/handler'
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder } from 'discord.js'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"


export default commandModule({
	name: 'sugerencias',
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'Envia una sugerencia.',
	//alias : [],
	execute: async (ctx) => {
		const modal = new ModalBuilder()
		.setCustomId('sugerencias')
		.setTitle('Sugerencias');

			// Create the text input components
			const input = new TextInputBuilder()
				.setCustomId('sugerenciasInput')
				// The label is the prompt the user sees for this input
				.setLabel("Tienes sugerencias?")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Paragraph);
			// An action row only holds one text input,
			// so you need one action row per text input.
			const suggestionsActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);
			// Add inputs to the modal
			modal.addComponents(suggestionsActionRow);
			await ctx.interaction.showModal(modal);
	}
});