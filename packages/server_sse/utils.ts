import { IncomingMessage } from 'http';

const SSE = {
  PREFIX: 'data: ',
  SUFFIX: '\n\n',
};

export const getPostBodyAsync = (req: IncomingMessage): object => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        body = body ? JSON.parse(body) : {};

        resolve(body);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export const getServerSentEventResponse = <T>(data: T) => {
  return SSE.PREFIX + JSON.stringify(data) + SSE.SUFFIX;
};
