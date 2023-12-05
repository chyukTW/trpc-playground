import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { QueryClient } from '@tanstack/react-query';
import { createWSClient, httpLink, splitLink, wsLink } from '@trpc/client';
import { createClient } from 'graphql-ws';

import { trpc } from './trpc';

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    splitLink({
      condition(op) {
        return op.type === 'subscription';
      },
      false: httpLink({
        url: 'http://localhost:2022',
      }),
      true: wsLink({
        client: createWSClient({
          url: 'ws://localhost:2022',
        }),
      }),
    }),
  ],
});

const apolloWsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000/graphql',
  }),
);

const apolloHttpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const apolloSplitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  apolloWsLink,
  apolloHttpLink,
);

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: apolloSplitLink,
});
