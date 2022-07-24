const { commandModule, CommandType } = require('@sern/handler');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, EmbedBuilder } = require('discord.js');
import { publish } from "../src/plugins/publish";
import { ownerOnly } from "../src/plugins/ownerOnly"

export default commandModule({
	name: 'ping',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298']), ownerOnly()],
	description: 'ADMIN: sends the mc server form.',
	//alias : [],
	execute: async (ctx, args) => {
		
	},
});