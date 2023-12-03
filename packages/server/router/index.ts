import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import EventEmitter from 'events';
import { z } from 'zod';

import { getMessages, insertMessage } from '../db';
import { Message } from '../db/schema';

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
  fetchMessages: procedure.input(z.object({ limit: z.number() })).query(({ input: { limit } }) => {
    return getMessages(limit);
  }),
  sendMessage: procedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ ctx: { event }, input: { message } }) => {
      await insertMessage(message);

      event.emit(e.sendMessage, message);

      return message;
    }),
  subscribeMessages: procedure.subscription(({ ctx: { event } }) => {
    return observable<{ messages: Message[] }>((emit) => {
      const listener = () => {
        emit.next({ messages: getMessages(10) });
      };

      event.on(e.sendMessage, listener);

      return () => {
        event.off(e.sendMessage, listener);
      };
    });
  }),
});
