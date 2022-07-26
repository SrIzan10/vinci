const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder } = require('discord.js');
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
	description: 'ADMIN: sends the mc server form.',
	//alias : [],
	execute: async (ctx, args, interaction) => {
	// for tomorrow
/*	this was supposed to choose between spanish and english but its too difficult (im sorry!)	
		const langChooserButtons = new ActionRowBuilder().addComponents(
			// TODO: use flags
			new ButtonBuilder()
				.setCustomId('langChooserSpanish')
				.setLabel('Spanish')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId('langChooserEnglish')
				.setLabel('English')
				.setStyle(ButtonStyle.Primary),
		)

		ctx.reply({embeds: [langChooser], components: [langChooserButtons], ephemeral: true})

		const collector = interaction.channel.createMessageComponentCollector({ max: 1, filter: interaction.isButton() && interaction.customId === 'langChooserEnglish' || interaction.customId === 'langChooserSpanish'});
 
		if (interaction.customId === 'langChooserSpanish') {
			ctx.reply("spanish")
		}
		else {
			ctx.reply("english")
		}*/
	}
});