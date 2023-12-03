import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import cors from 'cors';
import { WebSocketServer } from 'ws';

import { appRouter, createContext } from './router';

// create http server instance
const { listen, server } = createHTTPServer({
  createContext,
  middleware: cors(),
  router: appRouter,
});

// create web socket server instance
const wss = new WebSocketServer({ server });
applyWSSHandler<AppRouter>({ createContext, router: appRouter, wss });

// run server
listen(2022);

// export router type
export type AppRouter = typeof appRouter;
