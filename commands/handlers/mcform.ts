import { commandModule, CommandType } from '@sern/handler';
import axios from 'axios';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	TextChannel,
} from 'discord.js';

export default commandModule({
	name: 'mcform-main',
	type: CommandType.Modal,
	plugins: [],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	async execute(modal) {
		const value = modal.fields.getTextInputValue('mcUsernameInput');
		const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
		if (value.length > 16 || value.length < 3 || specialChars.test(value)) {
			modal.reply({
				content: `ERROR: El nombre de usuario no es válido.`,
				ephemeral: true,
			});
		} else {
			try {
				const request = await axios
					.get(`https://api.mojang.com/users/profiles/minecraft/${value}`, {
						validateStatus: function (status) {
							return status === 200 || status === 400;
						},
					})
					.then((res) => res.data);
				await modal.reply({
					content:
						'Enviado!, Gracias por utilizar tu Mona Lisa de confianza\n~Sr Izan, 2022',
					ephemeral: true,
				});
				const embed = new EmbedBuilder()
					.setAuthor({
						name: modal.user.username,
						iconURL: modal.user.displayAvatarURL(),
					})
					.setColor('Green')
					.setTitle('Nueva solicitud de entrada al servidor!')
					.setDescription(
						`Su nombre de usuario en Minecraft es: \`${value}\`\nSu UUID: \`${request.id}\``
					)
					.setFooter({ text: `Discord ID: ${modal.user.id}` });
				const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId('mcform-dm')
						.setLabel('Añadido a la whitelist!')
						.setStyle(ButtonStyle.Success)
				);
				(
					(await (
						await modal.client.guilds.fetch(process.env.GUILDID!)
					).channels.fetch(process.env.MCFORM_CHANNEL!)) as TextChannel
				).send({ embeds: [embed], components: [button] });
			} catch {
				await modal.reply({
					content:
						'ERROR: No se ha podido enviar ya que eres un usuario no premium o de MC Bedrock.\nAsegúrate que has puesto bien el nombre de usuario.',
					ephemeral: true,
				});
			}
		}
	},
});
