import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";

import { EventType, discordEvent, eventModule } from "@sern/handler";

export default discordEvent({
  name: 'guildMemberRemove',
  execute(member) {
    if (member.guild.id !== process.env.GUILDID) return;
	  const leaveEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Un miembro se ha ido :(")
        .setDescription(`${member.user} acaba de salir del servidor!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

    const channel = member.client.guilds.cache.get(process.env.GUILDID!)!.channels.cache.get(process.env.JOINSANDLEAVES_CHANNEL!) as unknown as TextChannel
    channel.send({embeds: [leaveEmbed]})
    }
});