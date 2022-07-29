const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require('discord.js');
import { publish } from "../src/plugins/publish";
import { ownerOnly } from "../src/plugins/ownerOnly"
import { ApplicationCommandType } from "discord.js";


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