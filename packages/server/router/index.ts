import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { desc } from 'drizzle-orm';
import EventEmitter from 'events';
import { z } from 'zod';

import { db } from '../db';
import { Message, messages } from '../db/schema';

// custom event
const event = new EventEmitter();

const e = {
  sendMessage: 'sendMessage',
};

// context
export const createContext = async () => ({ event });

type Context = Awaited<ReturnType<typeof createContext>>;

// initialize TRPC
const t = initTRPC.context<Context>().create();
const { procedure, router } = t;

// routers
export const appRouter = router({
  sendMessage: procedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ ctx: { event }, input: { message } }) => {
      await db.insert(messages).values({ message });

      event.emit(e.sendMessage, message);

      return message;
    }),
  subscribeMessages: procedure.subscription(({ ctx: { event } }) => {
    return observable<{ messages: Message[] }>((emit) => {
      const listener = () => {
        emit.next({
          messages: [
            ...db.select().from(messages).orderBy(desc(messages.id)).limit(10).all(),
          ].reverse(),
        });
      };

      event.on(e.sendMessage, listener);

      return () => {
        event.off(e.sendMessage, listener);
      };
    });
  }),
});
