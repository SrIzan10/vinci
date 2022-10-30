import { commandModule, CommandType } from '@sern/handler'
import axios from "axios";
import { GuildBasedChannel, TextChannel } from 'discord.js';

export default commandModule({
    type: CommandType.Modal,
	plugins: [],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	async execute (modal) {
		const value = modal.fields.getTextInputValue('mcUsernameInput') as any
		var specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
		if (value > 16 || value < 3 || specialChars.test(value)) {
			modal.reply({content: `ERROR: El nombre de usuario no es válido.`, ephemeral: true});
		} else {
			try {
				const request = await axios(`https://api.mojang.com/users/profiles/minecraft/${value}`, {validateStatus: function (status) {return status === 200 || status === 400; }})
				const data = request.data
				await modal.reply({content: 'Enviado!, Gracias por utilizar tu Mona Lisa de confianza\n~Sr Izan, 2022', ephemeral: true});
				(modal.client.guilds.cache.get("928018226330337280")!.channels.cache.get("998195363376803850") as TextChannel).send(`Solicitud enviada por ${modal.user}.\nUsername de Minecraft: ${value}`);
			} catch (err) {
				await modal.reply({content: 'ERROR: No se ha podido enviar ya que eres un usuario no premium o de MC Bedrock.\nAsegúrate que has puesto bien el nombre de usuario.', ephemeral: true})
			}
	}
	}
});