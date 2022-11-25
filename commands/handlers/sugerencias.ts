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
		const row = new ActionRowBuilder<ButtonBuilder>()
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
		const row2 = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('suggestions-yes-who')
					.setEmoji('✅')
					.setLabel('Quién')
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder()
					.setCustomId('suggestions-no-who')
					.setEmoji('❎')
					.setLabel('Quién')
					.setStyle(ButtonStyle.Secondary),
			)
		
		const message1 = await (await modal.client.guilds.fetch(process.env.GUILDID!))
			.channels.fetch(process.env.SUGGESTIONS_CHANNEL!) as TextChannel;
		const message2 = await message1.send({ embeds: [embed], components: [row, row2] });
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
