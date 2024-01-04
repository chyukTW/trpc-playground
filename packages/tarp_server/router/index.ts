import { initTRPC } from '@trpc/server';
import EventEmitter from 'events';
import { z } from 'zod';

import { getAllMissions, getAllWorkspaces } from '../db';

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
  missions: procedure.query(() => {
    return getAllMissions();
  }),
  workspaces: procedure.query(() => {
    return getAllWorkspaces();
  }),
});
