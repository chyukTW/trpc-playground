import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, httpLink, splitLink, wsLink } from '@trpc/client';
import { useState } from 'react';

import { trpc } from './trpc';

const Hello = () => {
  const response = trpc.hello.useQuery({name: 'twinny'});

  return <p>{response.data?.text}</p>;
};

const Chats = () => {
  const [messages, setMessages] = useState<{id: number, message: string}[]>();

  trpc.onMessages.useSubscription(undefined, {
    onData: ({ messages })=> {
      setMessages(messages);
    }
  });

  return <div>
    {
      messages?.map(({id, message})=> {
        return <p key={id}>{message}</p>;
      })
    }
  </div>;
};

const Input = () => {
  const [message, setMessage] = useState('');

  const sendMessage = trpc.sendMessage.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    if(!message) return;

    e.preventDefault();

    await sendMessage.mutateAsync({ message });

    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} type='text'/>
      <input type="submit"/>
    </form>
  );
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
        <Chats />
        <Input />
      </QueryClientProvider>
    </trpc.Provider>   
  );
}


export default App;
