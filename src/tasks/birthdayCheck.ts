import { scheduledTask } from "@sern/handler";
import { ThreadAutoArchiveDuration } from "discord.js";

export default scheduledTask({
    trigger: "* * * * *",
    execute: async (context, sdt) => {
      const now = new Date();
      const today = `${now.getDate()}-${now.getMonth() + 1}`;

      // mark all non-today birthdays as not sent
      await sdt.deps.prisma.birthday.updateMany({
        where: {
          date: { not: today },
          sent: true,
        },
        data: { sent: false },
      });

      const users = await sdt.deps.prisma.birthday.findMany({
        where: {
          date: today, 
          sent: false,
        }
      });
      users.forEach(async user => {
        const channel = await sdt.deps["@sern/client"].channels.fetch(process.env.BIRTHDAY_CHANNEL!);
        const discordUser = await sdt.deps["@sern/client"].users.fetch(user.userId);
        if (channel && channel.isSendable() && channel.isTextBased()) {
          const msg = await channel.send(`<@&1039613683422208020>, hoy es el cumpleaños de <@${discordUser.id}>! 🎉🎂 ¡Muchas felicidades!`);
          msg.react('🎉');
          msg.react('<:Pog:1030169609178976346>');
          msg.startThread({
            name: `Feliz cumpleaños ${discordUser.username}!`,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
          });
          await sdt.deps.prisma.birthday.update({
            where: { id: user.id },
            data: { sent: true },
          });
        }
      });
    }
});