const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
import { publish } from "../src/plugins/publish";
import { ownerOnly } from "../src/plugins/ownerOnly"
import { ApplicationCommandType } from "discord.js";
const langChooser = new EmbedBuilder()
	.setColor('#00ff00')
	.setTitle('Language chooser')
	.setDescription('Choose the language to show')
	.addFields({name: ':flag_es: Spanish', value: 'click the flag', inline: true}, {name: ':flag_gb: English', value: 'click the flag', inline: true})
	.setFooter({text: 'shoutout to tormentarosa who found the english flag'});


export default commandModule({
	name: 'ban',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298']), ownerOnly()],
	description: 'ADMIN: Banea usuarios.',
	options: [{name: 'usuario', required: true,description: 'menciona al usuario al que banear.',type: ApplicationCommandType.User}],
	//alias : [],
	execute: async (ctx, args, interaction, options, member) => {
		const user = options[1]
		if (ctx.message.member.roles.highest.position < member.roles.highest.position)
		return ctx.reply({
		  content: `❌ | No puedes banear a una persona superior a tí.`
		});

	}
});