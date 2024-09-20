import { commandModule, CommandType } from '@sern/handler';
import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ModalActionRowComponentBuilder,
} from 'discord.js';

export default commandModule({
	name: 'mcform',
	type: CommandType.Slash,
	plugins: [],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	execute: async (ctx) => {
		const modal = new ModalBuilder()
			.setCustomId('mcform-main')
			.setTitle('Formulario para entrar al servidor');
		const input = new TextInputBuilder()
			.setCustomId('mcUsernameInput')
			.setLabel('Cuál es tu nombre de usuario de Minecraft?')
			.setStyle(TextInputStyle.Short);
		const usernameActionRow =
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				input
			);
		modal.addComponents(usernameActionRow);
		await ctx.interaction.showModal(modal);
	},
});
