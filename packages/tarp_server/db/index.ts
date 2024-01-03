// import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { Client } from 'pg';

// DATABASE_URL = 'postgresql://postgres:postgres@localhost:5455/postgres';

const client = new Client({
  database: 'postgres',
  // host: '0.0.0.1',
  host: 'localhost',
  password: 'postgres',
  port: 5455,
  user: 'postgres',
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
