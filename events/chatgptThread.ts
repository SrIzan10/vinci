import { discordEvent } from '@sern/handler';
import { ThreadChannel } from 'discord.js';
import database from '../schemas/chatgpt.js';
import { fetchEventSource } from '@ai-zen/node-fetch-event-source';

export default discordEvent({
	name: 'messageCreate',
	async execute(message) {
        const thread = message.channel as ThreadChannel
        if (thread.parentId !== process.env.CHATGPT_CHANNEL) return;
        if (message.author.bot) return;
        if (message.content.includes('ig')) return;

        try {
            await thread.sendTyping()
            const newObj = [{ role: 'user', content: message.content }]
            const db = await database.findOne({ threadid: thread.id }).exec()
            const messages = db!.messages.map((message) => {
                const { _id, ...rest } = message.toObject();
                return rest
            })

            const ctrl = new AbortController();
            let msg = ''
            let isDone = false

            const sentMsg = await message.reply(':sparkles: Pensando...')
            const sendInterval = setInterval(() => {
                if (msg.length > 2000 || msg.length === 0) return
                thread.sendTyping()
                sentMsg.edit(msg)
                if (isDone) {
                    clearTimeout(sendInterval)
                    ctrl.abort()
                    return
                }
            }, 1000)
            fetchEventSource(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_AI_ACC}/ai/run/@hf/mistral/mistral-7b-instruct-v0.2`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.CF_AI_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    stream: true,
                    messages: messages.concat(newObj)
                }),
                onmessage: async (ev) => {
                    if (ev.data === '[DONE]') {
                        ctrl.abort()
                        isDone = true
                        newObj.push({ role: 'assistant', content: msg })
                        await database.findOneAndUpdate({ threadid: thread.id }, {
                            $push: {
                                messages: newObj
                            }
                        }).exec()
                        await sentMsg.edit({ content: msg })
                    } else {
                        const data = JSON.parse(ev.data)
                        msg = msg + data.response
                    }
                },
                signal: ctrl.signal
            })
        } catch (e) {
            await message.reply('Algo ha ido mal.')
            console.log(e)
        }
    },
});