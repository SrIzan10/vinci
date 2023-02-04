import { EventType, eventModule } from '@sern/handler';
import { EmbedBuilder, Message } from 'discord.js';
import db from '../schemas/afk.js';

export default eventModule({
	type: EventType.Discord,
	name: 'messageCreate',
	execute: async (message: Message) => {
        const dbEntries = await db.find()

        dbEntries.forEach(async (doc) => {
            if (!message.content.includes(`<@${doc.id}`)) return;
            const username = (await message.client.users.fetch(doc.id)).username
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`Usuario ${username} está AFK`)
                .setDescription(`El usuario que has mencionado en tu mensaje ha marcado su estado como AFK\nRazón: ${doc.reason}`)
                .setFooter({ text: 'Este mensaje se eliminará en 10 segundos (wepa, como una bomba!)' })

            const sentMessage = await message.reply({ embeds: [embed] })
            setTimeout(async () => { await sentMessage.delete() }, 10_000)
        })
    },
});
