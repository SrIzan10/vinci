import { Message, OmitPartialGroupDMChannel, PublicThreadChannel } from 'discord.js';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { openai } from './openai';
import prisma from './db';

export async function aiHandle(msg: OmitPartialGroupDMChannel<Message<boolean>>, isThread = false) {
  if (msg.author.bot) return;
  const threadCh = msg.channel as PublicThreadChannel<false>;
  if (isThread && (threadCh.parentId !== process.env.CHATGPT_CHANNEL)) return;
  if (!isThread && (msg.channelId !== process.env.CHATGPT_CHANNEL)) return;
  if (msg.content.startsWith('!')) return;

  let aiChatId;
  const newMessages: { role: string; content: string }[] = [];
  const systemMsg =
    'You are Vinci, a friendly and helpful Discord bot assistant dedicated to answering all user questions clearly and naturally, as if texting a friend. Avoid mentioning that you are an assistant, since users already know this. When it is useful, you can use markdown. You will interact with Spanish-speaking users, so all your responses, including any future ones, must be written exclusively in Spanish without exception.';

    const messages: ChatCompletionMessageParam[] = [];

    if (isThread) {
      const dbMsgs = await prisma.aiChat.findFirst({
        where: { threadid: threadCh.id },
        select: { messages: true, id: true },
      });
      if (dbMsgs) {
        messages.push(
          ...dbMsgs.messages.map((m) => ({
            content: m.content,
            role: m.role as 'user' | 'assistant' | 'system',
          }))
        );
      }
      messages.push({ role: 'user', content: msg.content });
      newMessages.push({ role: 'user', content: msg.content });
      aiChatId = dbMsgs?.id;
    } else {
      messages.push({ role: 'system', content: systemMsg }, { role: 'user', content: msg.content });
    }

    const sentMsg = await msg.reply(':sparkles: Razonando...');
    const stream = await openai.chat.completions.create({
      model: 'google/gemini-3-pro-preview',
      messages,
      max_tokens: 2000,
      max_completion_tokens: 2000,
      temperature: 0.7,
      stream: true,
    });

    let message = '';
    let lastEdit = Date.now();

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      message += content;

      if (Date.now() - lastEdit > 1000 && message.length > 0) {
        await sentMsg.edit(message.slice(0, 2000));
        lastEdit = Date.now();
      }
    }

    await sentMsg.edit(message.slice(0, 2000));

    messages.push({ role: 'assistant', content: message.replace(/^\n{2}/, '') });
    if (isThread) {
      newMessages.push({ role: 'assistant', content: message.replace(/^\n{2}/, '') });
    }

    if (!isThread) {
      const titleMessage = (
        await openai.chat.completions.create({
          model: 'google/gemini-3-pro-preview',
          messages: [
            { role: 'system', content: systemMsg },
            {
              role: 'user',
              content: `Give a short title for the following AI prompt. Do NOT use markdown. USE SPANISH:\n\n${message}`,
            },
          ],
          max_tokens: 50,
          temperature: 0.7,
        })
      ).choices[0].message
        .content!.trim()
        .slice(0, 100);
      const thread = await sentMsg.startThread({
        name: titleMessage || 'Nuevo hilo',
      });

      await prisma.aiChat.create({
        data: {
          messageid: msg.id,
          threadid: thread.id,
          messages: {
            createMany: {
              data: messages as { role: string; content: string }[],
            },
          },
        },
      });
    } else {
      await prisma.aiMessage.createMany({
        data: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
          aiChatId: aiChatId!,
        })) as { role: string; content: string; aiChatId: number }[],
      });
    }
}
