import { commandModule, CommandType } from '@sern/handler'
import { publish } from "#plugins";
import { ownerOnly } from "#plugins";
import { ApplicationCommandOptionType } from "discord.js";
/*
import { publish } from "#plugins";
import { ownerOnly } from "#plugins"
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