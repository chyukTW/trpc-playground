import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

// TODO
// post message
// subscribe messages

let id = 0;

const db = {
  messages: [
    {
      id: ++id,
      message: 'hi',
    },
  ],
};

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
        emit.next({ messages: db.messages });
      }, 700);

      return () => {
        clearInterval(timer);
      };
    });
  }),
  sendMessage: procedure.input(z.object({ message: z.string() })).mutation(({ input }) => {
    db.messages.push({ id: ++id, message: input.message });
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
