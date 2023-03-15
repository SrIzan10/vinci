import { discordEvent } from '@sern/handler';
import axios from 'axios';
import { TextChannel } from 'discord.js';
import db from '../schemas/chatgpt.js';

export default discordEvent({
	name: 'messageCreate',
	async execute(message) {
        if (message.channel.id !== process.env.CHATGPT_CHANNEL) return;
        if (message.author.bot) return;

        try {
            await (message.channel as TextChannel).sendTyping()
            const response = await axios.post('https://chatgpt-api.shn.hk/v1/', {
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": message.content }]
            }).then(res => res.data)
            const titleResponse = await axios.post('https://chatgpt-api.shn.hk/v1/', {
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": `Generate a title in less than 6 words for the following message, also remove the quotes if you are going to add them AND don't put Title in the beginning:\nUser: ${message.content}\nAssistant: ${response.choices[0].message.content}` }]
            }).then(res => res.data.choices[0].message.content.replaceAll('"', '') as string)
            
            const botMsg = await message.reply({ content: response.choices[0].message.content.slice(0, 2000) })
            const thread = await botMsg.startThread({ name: titleResponse })

            const dbData = new db({
                messageid: message.id,
                threadid: thread.id,
                messages: [
                    { role: 'user', content: message.content },
                    { role: 'assistant', content: response.choices[0].message.content.replace(/^\n{2}/, '') }
                ]
            })
            await dbData.save()
        } catch (e) {
            await message.reply({ content: 'Algo ha ido mal.' }).catch(() => {})
            console.log(e)
        }
    },
});
