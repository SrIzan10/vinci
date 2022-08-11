const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"

export default commandModule({
    type: CommandType.Modal,
	plugins: [],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	async execute (modal) {
		const value = modal.fields.getTextInputValue('sugerenciasInput');

		modal.client.users.fetch('703974042700611634').then(u => {u.send(value + `\n enviado por ${modal.user}`)})

		modal.reply({content: 'Enviado!', ephemeral: true})
	}
});