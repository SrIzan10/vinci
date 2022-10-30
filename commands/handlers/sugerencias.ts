// import everything
import { commandModule, CommandType } from '@sern/handler'
import { EmbedBuilder } from 'discord.js';
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import { TextChannel, ThreadAutoArchiveDuration, ThreadManager } from "discord.js";

export default commandModule({
	type: CommandType.Modal,
	//alias : [],
	async execute (modal) {
		// first we get the value
		const value = modal.fields.getTextInputValue('sugerenciasInput');
		function onlySpaces(str: string) {return str.trim().length === 0}
		if (onlySpaces(value) === true) {
			modal.reply({content: 'Buen intento enviando un mensaje vacío >:D', ephemeral: true})
		} else if (value.indexOf('**') >= 0 || value.indexOf('*') >= 0 || value.indexOf('**') >= 0 || value.indexOf('__') >= 0 || value.indexOf('***') >= 0 || value.indexOf('_') >= 0) {
			modal.reply({content: 'Debido a varios problemas, el formatting de Discord ha sido desactivado.\nPara más info, visita <https://vinci.tk/k>.\nSiento las molestias!', ephemeral: true})
		} else if (value.indexOf('sugerencia') >= 0 || value.indexOf('sugerencias') >= 0 || value.indexOf('Sugerencia') >= 0 || value.indexOf('Sugerencias') >= 0) {
			modal.reply({content: 'No puedes enviar una sugerencia con la palabra sugerencia(s).'})
		} else {
			// we create the embed which will be sent when the thing is sent
			const modalEmbed = new EmbedBuilder()
				.setColor("Random")
				.setTitle('Sugerencia')
				.setAuthor({name: `${modal.user.username}`, iconURL: `${modal.user.displayAvatarURL()}`})
				.setDescription(value);
			// finally send the message to the text channel
			const message1 = modal.client.guilds.cache.get('928018226330337280')!.channels.cache.get('1007269448140476436') as TextChannel
			const message2 = (await message1.send({embeds: [modalEmbed]}))
			message2.startThread({name: `Sugerencia de ${modal.user.username}`, autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays, reason: 'AUTOMATIZADO: Hilo para discutir sobre la sugerencia.'})
			message2.react("✅")
			message2.react("❎")
			// and return the user that it worked
			modal.reply({content: '¡Enviado!\nRECUERDA QUE NO ESTÁ PERMITIDO ENVIAR MENSAJES VACÍOS.', ephemeral: true})
		}
	}
});