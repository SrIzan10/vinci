import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";

import { EventType, eventModule } from "@sern/handler";

export default eventModule({
  type: EventType.Discord,
  name: 'guildMemberRemove',
  execute(member: GuildMember) {
    	// member.guild.channels.cache.get("968572106952560670").send(`${member.user} has joined the server!`);
		const leaveEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Un miembro se ha ido :(")
        .setDescription(`${member.user} acaba de salir del servidor!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

        const channel = member.client.guilds.cache.get(process.env.GUILDID!)!.channels.cache.get(process.env.JOINSANDLEAVES_CHANNEL!) as TextChannel
        channel.send({embeds: [leaveEmbed]})
    }
});