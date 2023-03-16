import { discordEvent } from '@sern/handler';
import axios from 'axios';
import { ThreadChannel } from 'discord.js';
import database from '../schemas/chatgpt.js';

export default discordEvent({
	name: 'messageCreate',
	async execute(message) {
        const thread = message.channel as ThreadChannel
        if (thread.parentId !== process.env.CHATGPT_CHANNEL) return;
        if (message.author.bot) return;
        if (message.content.includes('ig')) return;

        try {
            await thread.sendTyping()
            let newObj = { role: 'user', content: message.content }
            let db = await database.findOneAndUpdate({ threadid: thread.id }, {
                $push: {
                    messages: newObj
                }
            })
            const messages = db!.messages.map((message) => {
                const { _id, ...rest } = message.toObject(); // Convert Mongoose document to plain object and remove _id field
                return rest
            })

            const response = await axios.post('https://chatgpt-api.shn.hk/v1/', {
                "model": "gpt-3.5-turbo",
                "messages": messages
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.data.choices[0].message.content as string)

            newObj = { role: 'assistant', content: response }
            db = await database.findOneAndUpdate({ threadid: thread.id }, {
                $push: {
                    messages: newObj
                }
            })

            await message.reply({ content: response.slice(0, 2000) })
        } catch (e) {
            await message.reply('Algo ha ido mal.')
            console.log(e)
        }
    },
});

function replacer(key, value) {
    return value.replace(/[^\w\s]/gi, '');
}