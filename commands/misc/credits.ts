const { commandModule, CommandType } = require('@sern/handler');
import { Context, SlashOptions } from "@sern/handler";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { publish } from "../../src/plugins/publish";

export default commandModule({
	name: 'creditos',
    type: CommandType.Slash,
	plugins: [publish({ guildIds: ['1000400148289036298', '928018226330337280'] })],
	description: 'Créditos del bot (en inglés)',
	//alias : [],
	options: [],
	execute: async (ctx: Context, options: SlashOptions) => {
		const baseEmbed = new EmbedBuilder()
			.setColor('Blurple')
			.setTitle(`Without these people, the bot wouldn't exist!`)
			.setAuthor({name: ctx.user.username, iconURL: ctx.user.displayAvatarURL()})
			.setFooter({text: `Created by Sr Izan | This list will be expanded`, iconURL: ctx.client.user?.displayAvatarURL()})
		const page1 = baseEmbed
			.setDescription(`**Development**\n
				<@703974042700611634>: Main development.\n
				<@464397024247152640>: Trusting me and inviting the bot.\n
				**For helping me out**\n
				<@182326315813306368>: sern handler dev, such a cool guy and helper <3\n
				<@697795666373640213>: sern handler dev, also helper at WOK, helped me out a ton\n
				*Some people at the D.JS discord*: yeah\n
				**Motivation**\n
				<@719678368173523015>: WHAT ARE YOU DOING ON VINCI RN?!?!?!\n
				<@530870655005097995>: Gave some ideas on the *original* roadmap\n
				<@678000774441336842>: My good'ol friend, always has been trying new Vinci stuff\n
				<@758743564879659069>: Believe it or not, this looper has alvays been beta-testing stuff\n
				<@697146020647403651>: For always thanking all my work\n
				**And, of course, you <3**\n
				Thanks everyone, this has been an absolute ride, I don't have words to express my appreciation! <:Pepelove:1030904410307563542>
			`)
		const buttons = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setLabel('lol')
					.setURL('https://discord.com/channels/928018226330337280/928018227156643857/1030480463690731530')
					.setStyle(ButtonStyle.Link)
			)
		await ctx.reply({embeds: [page1], components: [buttons], ephemeral: true})
	},
});