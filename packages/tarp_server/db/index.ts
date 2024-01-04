import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
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
  return db.select().from(pgTable('mission', { id: serial('id') }));
};
