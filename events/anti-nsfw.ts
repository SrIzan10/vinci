import { discordEvent } from '@sern/handler';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, TextChannel } from 'discord.js';
import tf from '@tensorflow/tfjs-node'
import axios from 'axios';
import { nsfwModel } from '../index.js';

export default discordEvent({
	name: 'messageCreate',
	execute(message: Message) {
        message.attachments.forEach(async (attachment) => {
			switch (attachment.contentType) {
				case 'image/png':
					break;
				case 'image/jpeg':
					break;
				default:
					return;
			}
			const pic = await axios.get(attachment.url,
				{ responseType: 'arraybuffer' }
			)
			const image = tf.node.decodeImage(pic.data, 3) as tf.Tensor3D
			// @ts-ignore
			const predictions = await nsfwModel.classify(image)
			
			switch (predictions[0].className) {
				case 'Hentai':
				case 'Porn':
					if (predictions[0].probability > 0.75) {
						const embed = new EmbedBuilder()
							.setTitle(`Se ha detectado una imagen NSFW en tus adjuntos.`)
							.setDescription('Por eso, se ha eliminado tu mensaje.\nPor si es un falso positivo, te vamos a dejar abajo el contenido del mensaje para recuperarlo.')
							.setFields(
								{ name: 'Contenido del mensaje', value: message.content || '(nada)' },
								{ name: 'Tipo', value: predictions[0].className.toString() },
							)
							.setFooter({ text: 'Esta detección ha sido automatizada.' })
						const modLogsEmbed = new EmbedBuilder()
							.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
							.setTitle(`Se ha detectado una imagen NSFW en los adjuntos de un mensaje.`)
							.setDescription('Aquí está toda la información:')
							.setFields(
								{ name: 'Contenido del mensaje', value: message.content || '(nada)' },
								{ name: 'Tipo', value: predictions[0].className.toString() },
							)
							.setFooter({ text: 'Esta detección ha sido automatizada.' })
						const button = new ActionRowBuilder<ButtonBuilder>()
							.addComponents(
								new ButtonBuilder()
									.setLabel('Imagen adjuntada que saltó las alarmas')
									.setURL(attachment.url)
									.setStyle(ButtonStyle.Link)
							)
						await message.delete()
						await message.author.send({ embeds: [embed], components: [button] })
						await (await message.client.channels.fetch(process.env.MODLOGS_CHANNEL!) as TextChannel).send({ embeds: [modLogsEmbed], components: [button] })
					}
					break;
			}
        })
    },
});
