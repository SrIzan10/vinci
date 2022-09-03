const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
import axios from "axios";

export default commandModule({
    type: CommandType.Modal,
	plugins: [],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	async execute (modal) {
		const value = modal.fields.getTextInputValue('mcUsernameInput');
		try {
			const res = await axios(`https://api.mojang.com/users/profiles/minecraft/${value}`)
			const data = res.data
			await modal.reply({content: 'Enviado!, Gracias por utilizar tu Mona Lisa de confianza\n~Sr Izan, 2022', ephemeral: true})
			modal.client.guilds.cache.get("928018226330337280").channels.cache.get("998195363376803850").send(`Solicitud enviada por ${modal.user}.\nUsername de Minecraft: ${value}`);
		} catch (err) {
			await modal.reply({content: 'ERROR: No se ha podido enviar ya que eres un usuario no premium o de MC Bedrock.\nAsegúrate que has puesto bien el nombre de usuario.', ephemeral: true})
		}
	}
});