import EventEmitter from 'events';
import { IncomingMessage, ServerResponse } from 'http';

import { getMessages, insertMessage } from '../db';
import { getPostBodyAsync, getServerSentEventResponse } from '../utils';

const event = new EventEmitter();

const e = {
  sendMessage: 'sendMessage',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const router: Record<string, any> = {
  '/': {
    GET: (req: IncomingMessage, res: ServerResponse) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello World\n');
      return;
    },
  },
  '/messages': {
    GET: (req: IncomingMessage, res: ServerResponse) => {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream; charset=utf-8',
      });

      res.on('close', () => {
        console.log('close !');
        res.end();
      });

      const listener = () => {
        res.write(getServerSentEventResponse(getMessages(10)));
      };

      listener();

      event.on(e.sendMessage, listener);

      return;
    },
    POST: async (req: IncomingMessage, res: ServerResponse) => {
      const body = await getPostBodyAsync(req);

      if (!('message' in body) || typeof body.message !== 'string') {
        res.statusCode === 400;
        res.end('something wrong..!\n');
        return;
      }

      const { message } = body;

      await insertMessage(message);

      event.emit(e.sendMessage, message);

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(message));
      return;
    },
  },
};
