import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import express from 'express';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

const PORT = 4000;

const schema = makeExecutableSchema({ resolvers, typeDefs });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  schema,
});

server.start().then(() => {
  app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));
});

httpServer.listen(PORT, () => {
  console.log(`Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(`Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
});
