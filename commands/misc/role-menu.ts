import { commandModule, CommandType } from "@sern/handler";
import type { APISelectMenuComponent, GuildMember } from "discord.js";

export default commandModule({
	type: CommandType.MenuSelect,
    name: 'role-menu',
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const roles = interaction.values;

		const menuRoles: string[] = (
			interaction.message.components[0].components[0]
				.data as Readonly<APISelectMenuComponent>
		).options.map((o: { label: string; value: string }) => o.value);

		const member = interaction.member as GuildMember;
		if (!member) return;

		let content = `Los roles han sido actualizados. Te he dado estos::\n${roles
			.map((r) => `<@&${r}>`)
			.join("\n")}`;
		if (roles.length === 0) content = "Se han actualizado los roles a ninguno o no se han seleccionado roles...";

		const existing = member.roles.cache
			.filter((r) => r.id !== interaction.guildId)
			.map((r) => r.id)
			.filter((r) => !menuRoles.includes(r));

		await member.roles.set(roles.concat(existing)).catch(() => null);

		await interaction.editReply(content);
	},
});