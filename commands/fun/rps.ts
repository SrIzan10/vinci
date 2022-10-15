const { commandModule, CommandType } = require('@sern/handler');
import { Context, SlashOptions } from "@sern/handler";
import axios from "axios";
import { ActionRowBuilder, APIMessageActionRowComponent, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, GuildMember } from "discord.js";
import { publish } from "../../src/plugins/publish";
import rockpaperscissors from "rockpaperscissors-checker";
import { setNonEnumerableProperties } from "got/dist/source";

export default commandModule({
	name: 'rps',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'Juega piedra papel tijeras con los panas',
	//alias : [],
	options: [
		{
			name: 'usuario',
			description: 'El usuario con el que enfrentarse',
			type: ApplicationCommandOptionType.User,
			required: true
		}
	],
	execute: async (ctx: Context, options: SlashOptions) => {
		// also the code is mine, I didn't steal from anyone
        let player1, player2, winner, bothResponded
		const option = options[1].getMember('usuario') as GuildMember
		if (ctx.user.id === option.id) {
			return await ctx.reply({content: `no puedes jugar contigo mismo 💀`, ephemeral: true})
		} else if (option.user.bot) {
			return await ctx.reply({content: `no puedes seleccionar a un bot.`, ephemeral: true})
		}
		const waitingEmbed = new EmbedBuilder()
			.setColor('Red')
			.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
			.setTitle(`Piedra, papel o tijera? <:PauseChamp:1030169623070519388>`)
            .setDescription(`Esperando a que ambos jugadores eligan...\nJugador 1: ${ctx.user}\nJugador 2: ${option}`)
            .setFooter({text: `Hay un máximo de 30 segundos para elegir.`})
		const winEmbed = new EmbedBuilder()
			.setColor('Green')
			.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
			.setFooter({text: `Gracias por jugar!`})
		const tieEmbed = new EmbedBuilder()
			.setColor('Yellow')
			.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
			.setTitle(`Ha habido un empate <:Sadge:1015764348385382451>`)
			.setDescription(`Qué sadge, ha habido un empate...`)
			.setFooter({text: `Volvemos a intentarlo?`})
		const timeUpEmbed = new EmbedBuilder()
			.setColor('Red')
			.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
			.setTitle(`Se acabó!`)
			.setDescription(`Uno de los dos jugadores no han respondido en los 30 segundos, así que se acabó la partida!`)
			.setFooter({text: `Volvemos a intentarlo?`})
		const buttons = ["Piedra", "Papel", "Tijera"].map(choice => {
			return new ButtonBuilder()
				.setLabel(choice)
				.setCustomId(`rps-${choice.toLowerCase()}`)
				.setStyle(ButtonStyle.Secondary)		
		})
		const row = new ActionRowBuilder<ButtonBuilder>();
		const message = await ctx.interaction.reply({content: `${option}, te han retado a Piedra Papel o Tijera!`, embeds: [waitingEmbed], fetchReply: true, components: [row.setComponents(buttons)]})
		const collector = message.createMessageComponentCollector({time: 30_000, componentType: ComponentType.Button, filter: (i) => [ctx.user.id, option.id].includes(i.user.id),})
		collector.on('collect', async (i) => {
			await i.deferReply({ephemeral: true})
			if (i.customId === "rps-piedra") {
				if (i.user.id === ctx.user.id) {
					player1 = 1
					await i.editReply({content: `Se ha respondido **piedra** correctamente, buena suerte!\n[Volver al mensaje](${message.url})`})
				} else if (i.user.id === option.id) {
					player2 = 1
					await i.editReply({content: `Se ha respondido **piedra** correctamente, buena suerte!\n[Volver al mensaje](${message.url})`})
				}
			} else if (i.customId === "rps-papel") {
				if (i.user.id === ctx.user.id) {
					player1 = 2
					await i.editReply({content: `Se ha respondido **papel** correctamente, buena suerte!\n[Volver al mensaje](${message.url})`})
				} else if (i.user.id === option.id) {
					player2 = 2
					await i.editReply({content: `Se ha respondido **papel** correctamente, buena suerte!\n[Volver al mensaje](${message.url})`})
				}
			} else if (i.customId === "rps-tijera") {
				if (i.user.id === ctx.user.id) {
					player1 = 3
					await i.editReply({content: `Se ha respondido **tijera** correctamente, buena suerte!\n[Volver al mensaje](${message.url})`})
				} else if (i.user.id === option.id) {
					player2 = 3
					await i.editReply({content: `Se ha respondido **tijera** correctamente, buena suerte!\n[Volver al mensaje](${message.url})`})
				}
			}
			if (player1 && player2) {
				const checker = rockpaperscissors(player1, player2)
				bothResponded = true
				if (checker === "player1") {
					winner = ctx.user.username
					const setDescription = winEmbed.setDescription(`Tenemos resultados!\n**${winner}** ha ganado.`).setTitle(`Ha ganado ${winner}! <:Pog:1030169609178976346>`)
					await message.edit({embeds: [setDescription], components: [], content: ``})
				} else if (checker === "player2") {
					winner = option.user.username
					const setDescription = winEmbed.setDescription(`Tenemos resultados!\n**${winner}** ha ganado.`).setTitle(`Ha ganado ${winner}! <:Pog:1030169609178976346>`)
					await message.edit({embeds: [setDescription], components: [], content: ``})
				} else if (checker === "tie") {
					await message.edit({embeds: [tieEmbed], components: [], content: ``})
				}
			}
		})
		collector.on('ignore', async (i) => {
			await i.reply({content: 'No estás jugando!', ephemeral: true})
		})
		collector.on('end', async () => {
			if (bothResponded) return;
			await message.edit({embeds: [timeUpEmbed], components: [], content: ``})
		})
	},
});