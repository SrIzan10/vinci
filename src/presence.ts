import { Presence } from '@sern/handler'
import { ActivityType, ClientPresenceStatus } from 'discord.js';

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return [...array];
}

const statuses: Statuses = [
  [ActivityType.Playing, "Minecraft", "online"],
  [ActivityType.Watching, "cómo escribe Javi", "online"],
  [ActivityType.Playing, "séptimo libro", "online"],
  [ActivityType.Watching, "a Hermes", "online"],
  [ActivityType.Listening, "tus comandos", "online"],
  [ActivityType.Playing, "ahora v2!", "online"],
];
type Statuses = [ActivityType, string, ClientPresenceStatus][];

export default Presence.module({
  execute: () => {
    const [type, name, status] = statuses.at(0)!;
    return Presence
      .of({ activities: [ { type, name } ],  status })
      .repeated(() => {
        const [type, name, status] = [...shuffleArray(statuses)].shift()!;
        return {
          status,
          activities: [{ type, name }]
        };
      }, 60_000);
  }
})