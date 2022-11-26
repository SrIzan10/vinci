import { commandModule, CommandType } from '@sern/handler'
import { publish } from "../../src/plugins/publish.js";
import { ownerOnly } from "../../src/plugins/ownerOnly.js"
import { EmbedBuilder } from "discord.js";
import axios from "axios";
import prettySeconds from 'pretty-seconds-spanish'

export default commandModule({
	name: 'stats',
    type: CommandType.Slash,
	plugins: [publish()],
	description: 'Enseña estadísticas del bot.',
	//alias : [],
	options: [],
	execute: async (ctx, options) => {
		await ctx.interaction.deferReply({ ephemeral: true })
		const cpubrand = await axios(`http://192.168.1.44:7271/cpubrand`)
		const cpucores = await axios(`http://192.168.1.44:7271/cpucores`)
		const ramtotal = await axios(`http://192.168.1.44:7271/ramtotal`)
		const ramfree = await axios(`http://192.168.1.44:7271/ramfree`)
		const dockertotal = await axios(`http://192.168.1.44:7271/dockertotal`)
		const uptime = prettySeconds(process.uptime())
		const embed = new EmbedBuilder()
			.setAuthor({name: `${ctx.user.username}`, iconURL: `${ctx.user.displayAvatarURL()}`})
			.setTitle(`Estadísticas de Vinci.`)
			.setThumbnail(`https://i.imgur.com/UwC1x8T.png`)
			.setURL('https://status.vinci.tk')
			.setColor('Random')
			.addFields(
				{name: "Fabricante de CPU", value: `${cpubrand.data}`, inline: true},
				{name: `Núcleos de CPU`, value: `${cpucores.data}`, inline: true},
				{name: '\u200B', value: '\u200B', inline: true},
				{name: `RAM total`, value: `${ramtotal.data}`, inline: true},
				{name: `RAM libre`, value: `${ramfree.data}`, inline: true},
				{name: '\u200B', value: '\u200B', inline: true},
				{name: 'Contenedores de Docker', value: `${dockertotal.data}`, inline: true},
				{name: '\u200B', value: '\u200B', inline: true},
				{name: 'Tiempo encendido', value: `${uptime}`},
				// {name: '\u200B', value: '\u200B', inline: true},
				// {name: 'Uptime del servidor', value: `${prettySeconds(`${nodeuptime.data}`)}`}
				)
		await ctx.interaction.editReply({embeds: [embed]})
	},
});