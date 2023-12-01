import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { observable } from '@trpc/server/observable';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { z } from 'zod';

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
  randomNumber: procedure.subscription(() => {
    return observable<{ randomNumber: number }>((emit) => {
      const timer = setInterval(() => {
        emit.next({ randomNumber: Math.random() });
      }, 700);

      return () => {
        clearInterval(timer);
      };
    });
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
