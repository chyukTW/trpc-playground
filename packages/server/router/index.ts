import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';

import { db } from '../db';
import { Message, messages } from '../db/schema';

// context
export const createContext = () => {
  console.log('run context !');

  return {};
};

type Context = Awaited<ReturnType<typeof createContext>>;

// initialize TRPC
const t = initTRPC.context<Context>().create();
const { procedure, router } = t;

// routers
export const appRouter = router({
  hello: procedure.input(z.object({ name: z.string() })).query(({ input }) => {
    return {
      text: `Hello ${input.name}`,
    };
  }),
  onMessages: procedure.subscription(() => {
    return observable<{ messages: Message[] }>((emit) => {
      const timer = setInterval(() => {
        emit.next({ messages: db.select().from(messages).all() });
      }, 700);

      return () => {
        clearInterval(timer);
      };
    });
  }),
  sendMessage: procedure
    .input(z.object({ message: z.string() }))
    .mutation(({ input: { message } }) => {
      db.insert(messages).values({ message }).run();
    }),
});
