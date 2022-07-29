import { EmbedBuilder, GuildMember, TextChannel } from "discord.js";

const { EventType, eventModule } = require('@sern/handler');

exports.default = eventModule({
  type: EventType.Discord,
  name: 'guildMemberAdd',
  execute(member: GuildMember) {
    	// member.guild.channels.cache.get("968572106952560670").send(`${member.user} has joined the server!`);
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