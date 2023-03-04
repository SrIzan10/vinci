import { discordEvent } from '@sern/handler';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	TextChannel,
} from 'discord.js';
import { scamLinks } from '../index.js';

export default discordEvent({
	name: 'messageCreate',
	async execute(message) {
		if (!message.content.includes('https://')) return;

		const index = message.content.indexOf("https://");
		let link = 'some goofy ahh string that is gonna be replaced'
		if (index !== -1) {
			let endIndex = message.content.indexOf(" ", index);
			if (endIndex === -1) {
				endIndex = message.content.length;
			}
			link = message.content.substring(index, endIndex);
		}
		const url = new URL(link);
		if (scamLinks.includes(url.hostname)) {
			const embed = new EmbedBuilder()
				.setTitle(`Se ha detectado un enlace scam en tu mensaje.`)
				.setDescription('Por eso, se ha eliminado tu mensaje.\nPor si es un falso positivo, te vamos a dejar abajo el contenido del mensaje para recuperarlo.')
				.setFields(
					{ name: 'Contenido del mensaje', value: message.content || '(nada)' },
				)
				.setFooter({ text: 'Esta detección ha sido automatizada por Vinci.' })
			const modLogsEmbed = new EmbedBuilder()
				.setTitle(`Se ha detectado un enlace scam el mensaje de un usuario.`)
				.setDescription('Por eso, se ha eliminado el mensaje.')
				.setFields(
					{ name: 'Contenido del mensaje', value: message.content || '(nada)' },
				)
				.setFooter({ text: 'Esta detección ha sido automatizada por Vinci.' })
				const button = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setLabel('Enlace que saltó las alarmas.')
						.setURL(link)
						.setStyle(ButtonStyle.Link)
				)
			await message.delete()
			await message.author.send({ embeds: [embed], components: [button] })
			await (await message.client.channels.fetch(process.env.MODLOGS_CHANNEL!) as TextChannel).send({ embeds: [modLogsEmbed], components: [button] })
		}
	},
});
