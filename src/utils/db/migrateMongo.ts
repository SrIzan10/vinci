import { Db, MongoClient } from 'mongodb';
import 'dotenv/config';
import prisma from './index';

export async function migrateMongo(
  uri: string,
  dbName: string,
  migrationScript: (db: Db) => Promise<void>
): Promise<void> {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    await migrationScript(db);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

if ((await prisma.aiChat.count()) === 0) {
  console.log('aichat');
  migrateMongo(process.env.MONGODB!, 'vinci', async (db) => {
    // chatgpt logic
    const aiChat = (await db.collection('chatgpt').find().toArray()) as unknown as ChatGPT[];
    for (const chat of aiChat) {
      await prisma.aiChat.create({
        data: {
          messageid: chat.messageid,
          threadid: chat.threadid,
          messages: {
            create: chat.messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          },
        },
      });
    }
  });
}

if ((await prisma.afk.count()) === 0) {
  console.log('afk');
  migrateMongo(process.env.MONGODB!, 'vinci', async (db) => {
    // afk logic
    const afk = (await db.collection('afk').find().toArray()) as unknown as AFK[];
    await prisma.afk.createMany({
      data: afk.map((afk) => ({
        userId: afk.id,
        reason: afk.reason,
      })),
    });
  });
}

if ((await prisma.birthday.count()) === 0) {
  console.log('birthday');
  migrateMongo(process.env.MONGODB!, 'vinci', async (db) => {
    // birthday logic
    const birthdays = (await db.collection('birthdays').find().toArray()) as unknown as Birthday[];

    const today = new Date();
    const todayFormatted = `${today.getDate()}-${today.getMonth() + 1}`;

    await prisma.birthday.createMany({
      data: birthdays
        .map((birthday) => {
          if (todayFormatted !== birthday.date) {
            birthday.alreadysent = false;
          }
          if (birthday.id === undefined) {
            return null;
          }

          return {
            userId: birthday.id,
            date: birthday.date,
            sent: birthday.alreadysent,
          };
        })
        .filter((data) => data !== null),
    });
  });
}

if ((await prisma.suggestion.count()) === 0) {
  console.log('suggestion');
  migrateMongo(process.env.MONGODB!, 'vinci', async (db) => {
    // suggestion logic
    const suggestions = (await db
      .collection('suggestions')
      .find()
      .toArray()) as unknown as Suggestion[];
    await prisma.suggestion.createMany({
      data: suggestions.map((suggestion) => {
        if (suggestion.upordown === undefined) {
          return null;
        }
        return {
          userId: suggestion.userid,
          msgId: suggestion.msgid,
          upDown: suggestion.upordown,
        };
      }).filter((data) => data !== null),
    });
  });
}

type ChatGPT = {
  _id: string;
  messageid: string;
  threadid: string;
  messages: AIMessage[];
};

type AIMessage = {
  _id: string;
  role: string;
  content: string;
};

type AFK = {
  _id: string;
  id: string;
  reason: string;
};

type Birthday = {
  _id: string;
  id: string;
  date: string;
  alreadysent: boolean;
};

type Suggestion = {
  _id: string;
  userid: string;
  msgid: string;
  upordown: number;
};
