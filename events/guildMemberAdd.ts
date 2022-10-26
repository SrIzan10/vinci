import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";

import { EventType, eventModule } from "@sern/handler";

export default eventModule({
  type: EventType.Discord,
  name: 'guildMemberAdd',
  execute(member: GuildMember) {
		const newMemberEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Nuevo miembro!")
            .setDescription(`${member.user} acaba de entrar al servidor!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        const channel = member.client.guilds.cache.get('928018226330337280')!.channels.cache.get('993599947364634694') as TextChannel
        channel.send({embeds: [newMemberEmbed]})
    }
});