import http from 'node:http';

import { router } from './router';

const hostname = '127.0.0.1';
const port = 2024;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (url && method && router[url]) {
    router[url][method](req, res);
  } else {
    res.statusCode = 404;
    res.end('Not Found\n');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
