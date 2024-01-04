import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { Client } from 'pg';

dotenv.config();

const client = new Client({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT as unknown as number,
  user: process.env.DB_USER,
});

client
  .connect()
  .then(() => {
    const db = drizzle(client);

    return db.select().from(pgTable('workspace', { id: serial('id'), name: text('name') }));
  })
  .then((res) => {
    console.log(res);
  });

export const sayHello = async (name: string) => {
  // await db.insert(messages).values({ message });
  console.log('hello ', name);
};
