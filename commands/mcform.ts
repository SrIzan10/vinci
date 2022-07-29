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
		const tlvalue = modal.fields.getTextInputValue('tlauncherInput');
		if (tlvalue === 'Si' || tlvalue === 'Si'.toLowerCase() || tlvalue === 'S' || tlvalue === 'S'.toLowerCase() || tlvalue === 'sip' || tlvalue === 'Sip'){
		// si dice que sí está permitido, no se envía el formulario y se dice que no se puede usar TLauncher porque patatín patatán
		await modal.reply({content: '**Hola! No se ha enviado el formulario porque has respondido que sí.**\nTLauncher no se puede utilizar en el servidor oficial de Minecraft debido a la gran vulnerabilidad que nos supone tenerlo no premium.\nAhora que tienes en cuenta esto, si estás en no premium, no puedes hacer nada. Si tienes MC comprado, corre de nuevo el comando respondiendo que no.\nGracias', ephemeral: true})
		} else if (tlvalue === 'No' || tlvalue === 'No'.toLowerCase() || tlvalue === 'N' || tlvalue === 'N'.toLowerCase() || tlvalue === 'Nop' || tlvalue === 'nop'){
		// si dice que no está permitido, se envía el formulario
		await modal.reply({content: 'Enviado!, Gracias por utilizar tu Mona Lisa de confianza\n~Sr Izan, 2022', ephemeral: true})
		modal.client.guilds.cache.get("928018226330337280").channels.cache.get("998195363376803850").send(`Solicitud enviada por ${modal.user}.\nUsername de Minecraft: ${value}`);
		} else {
		// si no dice ni sí ni que no, le decimos al usuario que envíe de nuevo el formulario con sí o no.
		await modal.reply({content: '**ERROR: No se ha enviado el formulario porque no has respondido ni sí ni no.**\nVuelve a intentarlo o notifica este error mencionando a Sr Izan en el servidor.', ephemeral: true})
		}

	}
});