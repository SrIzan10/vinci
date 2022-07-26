const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
import { publish } from "../src/plugins/publish";
import { ownerOnly } from "../src/plugins/ownerOnly"

export default commandModule({
    type: CommandType.Modal,
	plugins: [],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	async execute (modal) {
		const value = modal.fields.getTextInputValue('mcUsernameInput');
		await modal.reply({content: 'Enviado!, Gracias por utilizar tu Mona Lisa de confianza\n~Sr Izan, 2022', ephemeral: true})
		modal.client.guilds.cache.get("928018226330337280").channels.cache.get("998195363376803850").send(`Solicitud enviada por ${modal.user}.\nUsername de Minecraft: ${value}`);
	}
});