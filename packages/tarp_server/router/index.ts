import { initTRPC } from '@trpc/server';
import { z } from 'zod';

import { sayHello } from '../db';

// context
export const createContext = async () => ({ event });

type Context = Awaited<ReturnType<typeof createContext>>;

// initialize TRPC
const t = initTRPC.context<Context>().create();
const { procedure, router } = t;

// routers
export const appRouter = router({
  hello: procedure.input(z.object({ name: z.string() })).query(({ input: { name } }) => {
    return sayHello(name);
  }),
});
