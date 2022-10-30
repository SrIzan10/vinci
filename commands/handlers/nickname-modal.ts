// import everything
import { commandModule, CommandType } from '@sern/handler'
import { EmbedBuilder } from 'discord.js';
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import { TextChannel, ThreadAutoArchiveDuration, ThreadManager } from "discord.js";

export default commandModule({
	type: CommandType.Modal,
	//alias : [],
	async execute (modal) {
		
	}
});