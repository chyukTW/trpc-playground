import { QueryClient } from '@tanstack/react-query';
import { createWSClient, httpLink, splitLink, wsLink } from '@trpc/client';

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
