import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';
import Database from 'better-sqlite3';
import cors from 'cors';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

// table
const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  message: text('message').notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// database
const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

export type AppRouter = typeof appRouter;

type Context = Awaited<ReturnType<typeof createContext>>;

// init
const t = initTRPC.context<Context>().create();
const { procedure, router } = t;

// router
const appRouter = router({
  hello: procedure.input(z.object({ name: z.string() })).query(({ input }) => {
    return {
      text: `Hello ${input.name}`,
    };
  }),
  onMessages: procedure.subscription(() => {
    return observable<{ messages: { id: number; message: string }[] }>((emit) => {
      const timer = setInterval(() => {
        // emit.next({ messages: selectMessages.all() as { id: number; message: string }[] });
        emit.next({ messages: db.select().from(messages).all() });
      }, 700);

      return () => {
        clearInterval(timer);
      };
    });
  }),
  sendMessage: procedure.input(z.object({ message: z.string() })).mutation(({ input }) => {
    // insertMessage.run({ message: input.message });
    db.insert(messages).values({ message: input.message }).run();
  }),
});

// context
const createContext = () => {
  console.log('context !');

  return {};
};

// http
const { listen, server } = createHTTPServer({
  createContext,
  middleware: cors(),
  router: appRouter,
});

// wss
const wss = new WebSocketServer({ server });

applyWSSHandler<AppRouter>({ createContext, router: appRouter, wss });

// run
listen(2022);
