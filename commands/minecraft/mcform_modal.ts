import { commandModule, CommandType } from '@sern/handler'
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder } from 'discord.js'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"


export default commandModule({
	name: 'mcform',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	execute: async (ctx) => {
		const modal = new ModalBuilder()
		.setCustomId('mcform')
		.setTitle('Formulario para entrar al servidor');
				// Create the text input components
				const input = new TextInputBuilder()
					.setCustomId('mcUsernameInput')
					// The label is the prompt the user sees for this input
					.setLabel("Cuál es tu nombre de usuario de Minecraft?")
					// Short means only a single line of text
					.setStyle(TextInputStyle.Short);
			// An action row only holds one text input,
			// so you need one action row per text input.
			const usernameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input);
	
			// Add inputs to the modal
			modal.addComponents(usernameActionRow);
			await ctx.interaction.showModal(modal);
	}
});