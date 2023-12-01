import { trpc } from "./trpc";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpLink } from '@trpc/client';
import { useState } from 'react';

const Hello = () => {
  const response = trpc.hello.useQuery({name: 'twinny'});

  return <p>{response.data?.text}</p>
}

function App() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: 'http://localhost:2022',
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hello />
      </QueryClientProvider>
    </trpc.Provider>   
  );
}


export default App;
