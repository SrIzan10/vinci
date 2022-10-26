import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import { ApplicationCommandOptionType } from "discord.js";
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: '8ball',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'Preguntale a la 8-ball cosas.',
	//alias : [],
	options: [{
		name: "pregunta",
		description: "Escribe lo que le quieres preguntar.",
		type: ApplicationCommandOptionType.String,
		required: true
	}],
	execute: async (ctx, options) => {
		// yes, the question argument is never used. There is no reason to use it in the code.
		var eightballwords = [
			'Probablemente',
			'Sí',
			'No',
			'Dudable',
			'Como lo veo, todo indica a que sí',
			'A lo mejor',
			'No cuentes con ello',
			'Buena suerte'
		]
		await ctx.reply({content: `La bola tiene respuesta: ${eightballwords[Math.floor(Math.random() * eightballwords.length)]}.`, ephemeral: true})
	},
});