import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, httpLink, splitLink, wsLink } from '@trpc/client';
import { useState } from 'react';

import { trpc } from './trpc';

const Hello = () => {
  const response = trpc.hello.useQuery({name: 'twinny'});

  return <p>{response.data?.text}</p>;
};

const Number = () => {
  const [number, setNumber] = useState<number>();

  trpc.randomNumber.useSubscription(undefined, {
    onData: ({randomNumber})=> {
      setNumber(randomNumber);
    }
  });

  return <p>{number}</p>;
};

function App() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
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
            })
          })
        }),
        
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hello />
        <Number />
      </QueryClientProvider>
    </trpc.Provider>   
  );
}


export default App;
