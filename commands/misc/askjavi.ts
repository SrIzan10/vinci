import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import { ApplicationCommandOptionType } from "discord.js";
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: 'askjavi',
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'DESACTIVADO: Pregunta a Javi LO QUE SEA!',
	//alias : [],
	execute: async (ctx, options) => {
		await ctx.reply({content: `Este comando ha sido desactivado ya que era para un evento que ya ha ocurrido.\nGracias por haber participado!`, ephemeral: true})
	},
});