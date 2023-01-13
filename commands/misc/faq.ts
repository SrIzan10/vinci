import { commandModule, CommandType } from '@sern/handler'
import { ApplicationCommandOptionType, ColorResolvable, EmbedBuilder } from 'discord.js';
import { publish } from "../../plugins/publish.js";
import fs from 'node:fs';
import mctags from '../../util/tags/minecraft.json' assert { type: 'json' }

export default commandModule({
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'Preguntas normalmente preguntadas :pepega:',
	//alias : [],
	options: [
		{
			name: 'minecraft',
			description: 'Preguntas normalmente preguntadas de Minecraft',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'pregunta',
					description: 'La pregunta',
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true,
					command: {
						onEvent: [],
						execute: async (ctx) => {
							const query = ctx.options.getFocused()
							const filter = mctags.filter(obj => obj.title.includes(query))
							await ctx.respond(
								filter.map(map => ({ name: map.title.toString(), value: map.title.toString() }))
							)
						}
					}
				},
				{
					name: 'para',
					description: 'Menciona a la persona a la que vaya esto.',
					type: ApplicationCommandOptionType.User,
				}
			]
		}
	],
	execute: async (ctx, options) => {
		switch (options[1].getSubcommand()) {
			case 'minecraft': {
				const option = options[1].getString('pregunta', true)
				const forusr = options[1].getMember('para')
				const filter = mctags.filter(obj => obj.title.includes(option))[0]
				
				const embed = new EmbedBuilder()
					.setAuthor({ name: ctx.user.username, iconURL: ctx.user.displayAvatarURL() })
					.setColor(filter.color as ColorResolvable)
					.setTitle(filter.title)
					.setDescription(filter.text)
				if (forusr) {
					await ctx.reply({
						content: `Esto es para tí ${forusr}:`,
						embeds: [embed]
					})
				} else {
					await ctx.reply({ embeds: [embed] })
				}
			} break;
		}
	},
});