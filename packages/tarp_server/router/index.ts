import { initTRPC } from '@trpc/server';
import EventEmitter from 'events';
import { z } from 'zod';

import { getAllWorkspaces, getMissions } from '../db';

// custom event
const event = new EventEmitter();

// context
export const createContext = async () => ({ event });

type Context = Awaited<ReturnType<typeof createContext>>;

// initialize TRPC
const t = initTRPC.context<Context>().create();
const { procedure, router } = t;

// routers
export const appRouter = router({
  hello: procedure.input(z.object({ name: z.string() })).query(({ input: { name } }) => {
    return JSON.parse(`hello ${name}`);
  }),
  missions: procedure
    .input(
      z.object({
        end: z.string().datetime().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
        start: z.string().datetime().optional(),
      }),
    )
    .query(({ input: { end, limit, offset, start } }) => {
      return getMissions({
        end: end ? new Date(end) : undefined,
        limit,
        offset,
        start: start ? new Date(start) : undefined,
      });
    }),
  workspaces: procedure.query(() => {
    return getAllWorkspaces();
  }),
});
