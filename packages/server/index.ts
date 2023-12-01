import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import { z } from 'zod';

export type AppRouter = typeof appRouter;

const t = initTRPC.create();

const { procedure, router } = t;

const appRouter = router({
  hello: procedure.input(z.object({ name: z.string() })).query(({ input }) => {
    return {
      text: `Hello ${input.name}`,
    };
  }),
});

const { listen } = createHTTPServer({
  createContext: () => (console.log('context!'), {}),
  middleware: cors(),
  router: appRouter,
});

listen(2022);
