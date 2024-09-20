import { commandModule, CommandType } from '@sern/handler'
import { ApplicationCommandOptionType } from "discord.js";

export default commandModule({
	name: 'ip',
    type: CommandType.Slash,
	plugins: [],
	// 
	description: 'La IP del servidor de Minecraft',
	options: [
		{
			name: 'usuario',
			description: 'Menciona al usuario al que va dirigido el comando.',
			type: ApplicationCommandOptionType.User
		}
	],
	//alias : [],
	execute: async (ctx, options) => {
		const usuario = ctx.options.getMember('usuario');

		if (!usuario) {
			await ctx.reply({content: "La IP del servidor de Minecraft es `minecraft.maraturing.com`,\nPide acceso con el comando </mcform:1000747672690499594>.", ephemeral: true})
		} else {
			await ctx.reply({content: `${usuario}` + ", la IP del servidor de Minecraft es `minecraft.maraturing.com`,\nPide acceso con el comando </mcform:1000747672690499594>."})
		}
	},
});