import dotenv from 'dotenv';
import { and, gte, lte } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { Client } from 'pg';

dotenv.config();

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = process.env;

const pg = new Client({
  database: DB_NAME,
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  user: DB_USER,
});

(async () => {
  try {
    await pg.connect();
  } catch {
    console.error('DB 연동 중 에러 발생');
  }
})();

const db = drizzle(pg);

export const getAllWorkspaces = async () => {
  return db.select().from(pgTable('workspace', { id: serial('id'), name: text('name') }));
};

export const getAllMissions = async () => {
  return db.select().from(pgTable('mission', { date: timestamp('date'), id: serial('id') }));
};

export const getMissions = async ({
  end = new Date(),
  limit = 10,
  offset = 0,
  start = new Date(),
}: {
  end?: Date;
  limit?: number;
  offset?: number;
  start?: Date;
}) => {
  const table = pgTable('mission', {
    date: timestamp('date'),
    eventTime: timestamp('event_time'),
    id: serial('id'),
    roadMapId: serial('road_map_id'),
  });

  console.log(start, end, offset, limit);

  return db
    .select()
    .from(table)
    .limit(limit)
    .offset(offset)
    .where(and(gte(table.date, start), lte(table.date, end)));
};
