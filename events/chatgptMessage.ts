import { discordEvent } from '@sern/handler';
import axios from 'axios';
import { TextChannel } from 'discord.js';
import db from '../schemas/chatgpt.js';
import { fetchEventSource } from '@ai-zen/node-fetch-event-source';
import database from '../schemas/chatgpt';
import { devMode } from '../index.js';

export default discordEvent({
	name: 'messageCreate',
	async execute(message) {
		if (message.channel.id !== process.env.CHATGPT_CHANNEL) return;
		if (message.author.bot) return;
		if (message.content.includes('v!ig')) return;

		const systemMsg =
			"You are Vinci, a helpful Discord bot assistant which tries to answer all questions that your users ask. You MUST speak naturally, if you were texting somebody. Don't tell the user that you are an assistant as they already know. Markdown is supported, including headers, codeblocks, etc. You will also chat with spanish speaking users, so your responses MUST, without exception, be in the spanish language, including your responses down the line.";
		try {
			await (message.channel as TextChannel).sendTyping();
			/*const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_AI_ACC}/ai/run/@cf/meta/llama-2-7b-chat-int8`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.CF_AI_TOKEN}`
              },
              body: JSON.stringify({
                messages: [{ role: 'system', content: systemMsg }, { role: "user", content: message.content }]
              })
            }).then(async res => (await res.json()).result.response as string)*/

			const messages = [
				{ role: 'system', content: systemMsg },
				{ role: 'user', content: message.content },
			];

			const ctrl = new AbortController();
			let msg = '';
			let isDone = false;

			const sentMsg = await message.reply(':sparkles: Pensando...');
      message.channel.sendTyping();
			const sendInterval = setInterval(() => {
				if (msg.length > 2000 || msg.length === 0) return;
				message.channel.sendTyping();
				sentMsg.edit(msg);
				if (isDone) {
					clearTimeout(sendInterval);
					ctrl.abort();
					return;
				}
			}, 1000);
			fetchEventSource(
				`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_AI_ACC}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${process.env.CF_AI_TOKEN}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						stream: true,
						messages,
					}),
					onmessage: async (ev) => {
						if (ev.data === '[DONE]') {
							ctrl.abort();
							isDone = true;
							await sentMsg.edit({ content: msg });
							messages.push({ role: 'assistant', content: msg });
							const titleResponse = await fetch(
								`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_AI_ACC}/ai/run/@cf/meta/llama-3-8b-instruct`,
								{
									method: 'POST',
									headers: {
										Authorization: `Bearer ${process.env.CF_AI_TOKEN}`,
									},
									body: JSON.stringify({
										messages: [
											{
												role: 'user',
                        // the "else you'll die" part actually works well for the prompt!
												content: `Generate a title for the following conversation. Only respond with the title, else you'll die:\\nUser: ${message.content}\\nAssistant: ${msg}`,
											},
										],
									}),
								}
							).then(
								async (res) =>
									(await res.json()).result.response.replaceAll('"', '') as string
							);
							const thread = await sentMsg.startThread({ name: titleResponse });

							const dbData = new db({
								messageid: message.id,
								threadid: thread.id,
								devServer: devMode,
								messages: [
									{ role: 'system', content: systemMsg },
									{ role: 'user', content: message.content },
									{ role: 'assistant', content: msg.replace(/^\n{2}/, '') },
								],
							});
							await dbData.save();
						} else {
							const data = JSON.parse(ev.data);
							msg = msg + data.response;
						}
					},
					signal: ctrl.signal,
				}
			);
		} catch (e) {
			await message.reply({ content: 'Algo ha ido mal :(' }).catch(() => {});
			console.log(e);
		}
	},
});
