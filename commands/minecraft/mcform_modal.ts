const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"


export default commandModule({
	name: 'mcform',
    type: CommandType.Both,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'], dmPermission: false, defaultMemberPermissions: 0n })],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	execute: async (ctx, args, interaction) => {
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
	
				const tlinput = new TextInputBuilder()
				.setCustomId('tlauncherInput')
				// The label is the prompt the user sees for this input
				.setLabel("TLauncher está permitido? Di Si o No.")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Short);
			// An action row only holds one text input,
			// so you need one action row per text input.
			const usernameActionRow = new ActionRowBuilder().addComponents(input);
			const tlActionRow = new ActionRowBuilder().addComponents(tlinput);
	
			// Add inputs to the modal
			modal.addComponents(usernameActionRow, tlActionRow);
			await ctx.interaction.showModal(modal);
	}
});