import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';

import { appRouter, createContext } from './router';

dotenv.config();

const { PORT } = process.env;

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
listen(PORT);

console.log('listening on ' + PORT);

// export router type
export type AppRouter = typeof appRouter;
