const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
import { publish } from "../src/plugins/publish";
import { ownerOnly } from "../src/plugins/ownerOnly"
const langChooser = new EmbedBuilder()
	.setColor('#00ff00')
	.setTitle('Language chooser')
	.setDescription('Choose the language to show')
	.addFields({name: ':flag_es: Spanish', value: 'click the flag', inline: true}, {name: ':flag_gb: English', value: 'click the flag', inline: true})
	.setFooter({text: 'shoutout to tormentarosa who found the english flag'});


export default commandModule({
	name: 'mcform',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280'])],
	description: 'Envia el formulario para entrar al servidor.',
	//alias : [],
	execute: async (ctx, args, interaction) => {
		const modal = new ModalBuilder()
		.setCustomId('mcform')
		.setTitle('Formulario para entrar al servidor');

				// Create the text input components
				const input = new TextInputBuilder()
				.setCustomId('mcUsernameInput')
				// The label is the prompt the user sees for this input
				.setLabel("Cuál es tu nombre de usuario de Minecraft?")
				// Short means only a single line of text
				.setStyle(TextInputStyle.Short);
	
			// An action row only holds one text input,
			// so you need one action row per text input.
			const usernameActionRow = new ActionRowBuilder().addComponents(input);
	
			// Add inputs to the modal
			modal.addComponents([usernameActionRow]);
			await ctx.interaction.showModal(modal);
	}
});