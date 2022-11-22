import { commandModule, CommandType } from '@sern/handler';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import {
	TextChannel,
	ThreadAutoArchiveDuration,
} from 'discord.js';

export default commandModule({
	type: CommandType.Modal,
	async execute(modal) {
		const value = modal.fields.getTextInputValue('sugerenciasInput');
		function onlySpaces(str: string) {
			return str.trim().length === 0;
		}
		if (onlySpaces(value) === true)
			return await modal.reply({
				content: 'Buen intento enviando un mensaje vacío >:D',
				ephemeral: true,
			});
		const embed = new EmbedBuilder()
			.setColor('Random')
			.setTitle('Sugerencia')
			.setAuthor({
				name: `${modal.user.username}`,
				iconURL: `${modal.user.displayAvatarURL()}`,
			})
			.setDescription(value);
		const buttons = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('suggestions-yes')
					.setEmoji('✅')
					.setLabel('0')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('suggestions-no')
					.setEmoji('❎')
					.setLabel('0')
					.setStyle(ButtonStyle.Danger),
			)
		const message1 = await (await modal.client.guilds.fetch('928018226330337280'))
			.channels.fetch('1007269448140476436') as TextChannel;
		const message2 = await message1.send({ embeds: [embed], components: [buttons] });
		message2.startThread({
			name: `Sugerencia de ${modal.user.username}`,
			autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
			reason: 'AUTOMATIZADO: Hilo para discutir sobre la sugerencia.',
		});
		modal.reply({
			content:
				'¡Enviado!\nRECUERDA QUE NO ESTÁ PERMITIDO ENVIAR MENSAJES VACÍOS.',
			ephemeral: true,
		});
	},
});
