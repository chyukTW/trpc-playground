import Database from 'better-sqlite3';
import { desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { messages } from './schema';

const sqlite = new Database('sqlite.db');

sqlite
  .prepare(
    `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
  `,
  )
  .run();

const db = drizzle(sqlite);

export const insertMessage = async (message: string) => {
  await db.insert(messages).values({ message });
};

export const getMessages = (limit: number) => {
  return [...db.select().from(messages).orderBy(desc(messages.id)).limit(limit).all()].reverse();
};
