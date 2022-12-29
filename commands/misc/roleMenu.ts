import { commandModule, CommandType } from '@sern/handler'
import { publish } from "#plugins";
import { ownerOnly } from "#plugins";
import { ActionRowBuilder, ApplicationCommandOptionType, ChannelType, Collection, EmbedBuilder, Role, SelectMenuBuilder, TextChannel } from "discord.js";
import { Resolver } from "../../util/resolver.js";

export default commandModule({
	name: 'rolemenu',
    type: CommandType.Slash,
	plugins: [publish(), ownerOnly()],
	description: 'ADMIN: Spawnea un menú de roles',
	//alias : [],
	options: [
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "The channel to send the message to",
			channelTypes: [ChannelType.GuildText],
			required: true,
		},
		{
			name: "role",
			type: ApplicationCommandOptionType.String,
			description: "The roles to attach (upto 25)",
			required: true,
		},
		{
			name: "message",
			type: ApplicationCommandOptionType.String,
			description: "The message to send",
			required: true,
		},
	],
	execute: async (ctx, options) => {
		const channel = options[1].getChannel("channel", true) as TextChannel;
		const role = new Resolver(options[1].getString("role", true), ctx.interaction)
			.roles;
		const message = options[1].getString("message", true);

		if (role.size > 25) return ctx.reply("Too many roles");

		const cdn = role.filter(
			(r) =>
				r.managed ||
				r.position > (ctx.guild?.members.me)!.roles.highest.position
		).size;
		if (cdn) {
			return ctx.reply(
				`Some roles are managed by integration or higher than my highest role.\nPlease try again`
			);
		}
		await ctx.interaction.deferReply();
		const row = createMenu(channel, role);
		const embed = new EmbedBuilder()
			.setTitle(message)
			.setDescription(
				`Por favor selecciona los roles que quieras.\nPuedes seleccionar varios roles también!`
			)
			.setColor(0xcc5279);
		await channel.send({
			embeds: [embed],
			components: [row],
		});
		await ctx.interaction.editReply("✅ Done!");
	},
});

function createMenu(channel: TextChannel, role: Collection<string, Role>) {
	if (!channel || !role) throw new Error("Missing channel or role");
	const menu = new SelectMenuBuilder()
		.setCustomId("role-menu")
		.setMaxValues(role.size)
		.setMinValues(0)
		.setPlaceholder("Pick some roles here!")
		.setOptions(
			role.map((r) => {
				return {
					label: r.name,
					value: r.id,
				};
			})
		);
	const row = new ActionRowBuilder<SelectMenuBuilder>().setComponents(menu);
	return row;
};