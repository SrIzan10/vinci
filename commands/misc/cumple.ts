import { commandModule, CommandType } from "@sern/handler";
import { publish } from "../../src/plugins/publish.js";
import { ApplicationCommandOptionType } from "discord.js";
import { readFileSync } from "node:fs";
import birthdays from "../../schemas/birthdays.js";
import { confirmation } from "../../src/plugins/acceptingBirthday.js";
/*
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
*/

export default commandModule({
	name: "cumple",
	type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298' , '928018226330337280'] }), confirmation()],
	description: "Pon tu cumpleaños en la base de datos para ser felicitado!",
	//alias : [],
	options: [
		{
			name: "fecha",
			description: "La fecha de tu cumple (D-M) (elige en el autocompletado)",
			type: ApplicationCommandOptionType.String,
			autocomplete: true,
			required: true,
			command: {
				onEvent: [],
				execute: async (autocomplete) => {
					const focusedValue = autocomplete.options.getFocused();
					let choices = JSON.parse(
						String(readFileSync("./util/daysinyear.txt"))
					) as Array<string>;
					choices = choices.filter((choice) =>
						choice.toString().startsWith(focusedValue)
					);
					choices = choices.slice(0, 25);
					await autocomplete.respond(
						choices.map((choice) => ({
							name: choice.toString(),
							value: choice,
						}))
					);
				},
			},
		},
	],
	execute: async (ctx, options) => {
		await ctx.interaction.deferReply({ephemeral: true})
		const option = ctx.interaction.options.getString("fecha")
		const array = JSON.parse(
			String(readFileSync("./util/daysinyear.txt"))
		) as Array<string>;
		if (!array.includes(option!)) return await ctx.interaction.editReply('Asegúrate que estás eligiendo una fecha del autocompletado!')
		if (await birthdays.exists({id: ctx.user.id})) return await ctx.interaction.editReply('No puedes poner tu fecha de nuevo!')
		const db = new birthdays({
			id: ctx.user.id,
			date: option,
			alreadysent: false
		});
		await db.save();
		await ctx.interaction.editReply('Ok, guardado correctamente. No puedes volver a cambiar la fecha.')
	},
});
