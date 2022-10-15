const { commandModule, CommandType } = require('@sern/handler');
import { publish } from "../../src/plugins/publish";
import { ownerOnly } from "../../src/plugins/ownerOnly";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember } from "discord.js";
const db = require('../../schemas/warn')

export default commandModule({
	name: 'warn',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] }), ownerOnly()],
	description: 'ADMIN: Avisa a usuarios.',
	//alias : [],
	options: [
		{
			name: 'leve',
			description: 'Aviso leve.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'usuario',
					description: 'el usuario al que avisar.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'razon',
					description: 'la razón aviso.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		},
		{
			name: 'grave',
			description: 'Aviso grave.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'usuario',
					description: 'el usuario al que avisar.',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'razon',
					description: 'la razón del aviso.',
					type: ApplicationCommandOptionType.String,
					required: true
				}
			]
		},
		{
			name: 'clear',
			description: 'Elimina los avisos de una persona.',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'usuario',
					description: 'el usuario al que quitar el aviso.',
					type: ApplicationCommandOptionType.User,
					required: true
				}
			]
		}
	],
	execute: async (ctx, options) => {
		const subcommand = options[1].getSubcommand()
		const user = options[1].getMember('usuario', true).id
		const usermember = options[1].getMember('usuario', true) as GuildMember
		const reason = options[1].getString('razon', true) as string
		const times = await db.findOne({id: `${user}`})
		const buttons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('1hour')
					.setLabel('1 hora')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId('30mins')
					.setLabel('30 minutos')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId('15mins')
					.setLabel('15 minutos')
					.setStyle(ButtonStyle.Danger),
				new ButtonBuilder()
					.setCustomId('pardon')
					.setLabel('Perdonar')
					.setStyle(ButtonStyle.Primary)
			);
		const dmEmbed = new EmbedBuilder()
			.setAuthor({name: `${ctx.user.username}`, iconURL: `${ctx.user.displayAvatarURL()}`})
			.setColor('Red')
			.setTitle('Tienes un aviso.')
			.setDescription(`Has sido avisado en el servidor de Discord.\nRazón: ${reason}.`)
		const dmEmbedTimeout = new EmbedBuilder()
			.setAuthor({name: `${ctx.user.username}`, iconURL: `${ctx.user.displayAvatarURL()}`})
			.setColor('Red')
			.setTitle('Acabas de ser muteado del servidor.')
			.setDescription(`Ve al servidor de Discord para ver el tiempo que estarás bloqueado.\nRazón: ${reason}.\n**Puede durar hasta una hora.**`)
		
		switch (subcommand) {
			case "leve": {
				return db.exists({id: `${user}`}, async function (err, doc) {
					if (err) {
						console.log(err)
					} else {
						if (doc === null) {
							const warn = new db({id: `${user}`, times: 1})
							warn.save()
							ctx.reply({content: `Se ha avisado a ${usermember} correctamente y añadido a la base de datos.`, ephemeral: true})
							ctx.client.users.fetch(user, false).then((user) => {
								user.send({embeds: [dmEmbed]})
							}).catch(err, async => {console.log(`couldn't send a DM to user ID ${user}.`)});
						} else {
							if (times.times > 2) {
								const msg = await ctx.reply({content: `El usuario ha excedido 3 avisos, ¿qué hacer?`, fetchReply: true, ephemeral: true, components: [buttons]})
								const collector = await msg.createMessageComponentCollector({ time: 15000, max: 1 });
								collector.on('collect', async i => {
									await i.deferReply({ephemeral: true})
									if (i.customId === '1hour') {
										await i.editReply({content: `Se ha silenciado a ${usermember} durante 1 hora correctamente. ;-;`, ephemeral: true})
										usermember.timeout(60 * 60 * 1000, reason)
										times.times = 0
										times.save()
									} else if (i.customId === '30mins') {
										await i.editReply({content: `Se ha silenciado a ${usermember} durante 30 minutos correctamente. ;-;`, ephemeral: true})
										usermember.timeout(30 * 60 * 1000, reason)
										times.times = 0
										times.save()
									} else if (i.customId === '15mins') {
										await i.editReply({content: `Se ha silenciado a ${usermember} durante 15 minutos correctamente. ;-;`, ephemeral: true})
										usermember.timeout(15 * 60 * 1000, reason)
										times.times = 0
										times.save()
									} else if (i.customId === 'pardon') {
										await i.editReply({content: `Se ha perdonado a ${usermember} correctamente.\nSeguro que la persona te lo agradecerá! :'D`, ephemeral: true})
										times.times = 0
										times.save()
									}
									ctx.client.users.fetch(user, false).then((user) => {
										user.send({embeds: [dmEmbedTimeout]})
									}).catch(console.log(`couldn't send a DM to user ID ${user}.`));
								});
							} else {
								ctx.reply({content: `se ha añadido un aviso con el motivo ${reason}.\navisos que tiene ahora: ${times.times + 1}`, ephemeral: true})
								times.times = times.times + 1
								times.save()
								ctx.client.users.fetch(user, false).then((user) => {
									user.send({embeds: [dmEmbed]});
								}).catch(console.log(`couldn't send a DM to user ID ${user}.`))
							}
						}
					}
				});	
			}
			case "grave": {
				return db.exists({id: `${user}`}, async function (err, doc) {
					if (err) {
						console.log(err)
					} else {
						if (doc === null) {
							const warn = new db({id: `${user}`, times: 2})
							warn.save()
							ctx.reply({content: `Se ha avisado a ${usermember} correctamente y añadido a la base de datos.`, ephemeral: true})
							ctx.client.users.fetch(user, false).then((user) => {
								user.send({embeds: [dmEmbed]});
							}).catch(console.log(`couldn't send a DM to user ID ${user}.`))
						} else {
							if (times.times >= 4) {
								const msg = await ctx.reply({content: `El usuario ha excedido 3 avisos, ¿qué hacer?`, fetchReply: true, ephemeral: true, components: [buttons]})
								const collector = await msg.createMessageComponentCollector({ time: 1000, max: 1 });
								collector.on('collect', async i => {
									if (i.customId === '1hour') {
										await i.channel.send({content: `Se ha silenciado a ${usermember} durante 1 hora correctamente. ;-;`, ephemeral: true})
										usermember.timeout(60 * 60 * 1000, reason)
										times.times = 0
										times.save()
									} else if (i.customId === '30mins') {
										await i.channel.send({content: `Se ha silenciado a ${usermember} durante 30 minutos correctamente. ;-;`, ephemeral: true})
										usermember.timeout(30 * 60 * 1000, reason)
										times.times = 0
										times.save()
									} else if (i.customId === '15mins') {
										await i.channel.send({content: `Se ha silenciado a ${usermember} durante 15 minutos correctamente. ;-;`, ephemeral: true})
										usermember.timeout(15 * 60 * 1000, reason)
										times.times = 0
										times.save()
									} else if (i.customId === 'pardon') {
										await i.channel.send({content: `Se ha perdonado a ${usermember} correctamente.\nSeguro que la persona te lo agradecerá! :'D`, ephemeral: true})
										times.times = 0
										times.save()
									}
									ctx.client.users.fetch(user, false).then((user) => {
										user.send({embeds: [dmEmbedTimeout]})
									}).catch(console.log(`couldn't send a DM to user ID ${user}.`));
								});
							} else {
								ctx.reply({content: `se ha añadido un aviso con el motivo ${reason}.\navisos que tiene ahora: ${times.times + 2}`, ephemeral: true})
								times.times = times.times + 2
								times.save()
								ctx.client.users.fetch(user, false).then((user) => {
									user.send({embeds: [dmEmbed]});
								}).catch(console.log(`couldn't send a DM to user ID ${user}.`))
							}
						}
					}
				});	
			}
			case "clear": {
				await db.exists({id: `${user}`}, function (err, doc) {
					if (err) {
						console.log(err)
					} else {
						if (doc === null) {
							ctx.reply({content: 'el usuario no está en la base de datos, así que no hay nada que hacer.', ephemeral: true})
						} else {
							times.times = 0
							times.save()
							ctx.reply({content: `quitados todos los avisos a ${usermember} correctamente!`, ephemeral: true})
						}
					}
				})
			}
		}
	}
})