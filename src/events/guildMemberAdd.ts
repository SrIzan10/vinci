import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";

import { EventType, discordEvent, eventModule } from "@sern/handler";

export default discordEvent({
  name: 'guildMemberAdd',
  execute(member) {
    if (member.guild.id !== process.env.GUILDID) return;
	  const newMemberEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Nuevo miembro!")
        .setDescription(`${member.user} acaba de entrar al servidor!`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

    const channel = member.client.guilds.cache.get(process.env.GUILDID!)!.channels.cache.get(process.env.JOINSANDLEAVES_CHANNEL!) as unknown as TextChannel
    channel.send({embeds: [newMemberEmbed]})
    }
});