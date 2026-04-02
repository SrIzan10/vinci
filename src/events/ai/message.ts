import { aiHandle } from '../../utils/aiHandle.js';
import { EventType, eventModule } from '@sern/handler';
import { ChannelType } from 'discord.js';

export default eventModule({
  type: EventType.Discord,
  name: 'messageCreate',
  execute: async (msg) => {
    await aiHandle(msg, msg.channel.type === ChannelType.PublicThread);
  }
});
