const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
import { ApplicationCommandOptionType } from "discord.js";
/*
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly"
*/

export default commandModule({
	name: '8ball',
    type: CommandType.Both,
	plugins: [publish(['1000400148289036298', '928018226330337280'])],
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