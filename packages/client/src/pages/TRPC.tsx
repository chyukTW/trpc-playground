import { QueryClientProvider } from '@tanstack/react-query';
import {  useEffect, useState } from 'react';

import { queryClient, trpcClient } from '../client';
import { trpc } from '../trpc';

const getLocaleTimeString = (timestamp: string) => {
  return new Date(new Date(timestamp).getTime() - new Date().getTimezoneOffset() * 60 * 1000).toLocaleTimeString();
};

const Chats = () => {
  const [messages, setMessages] = useState<{id: number, message: string, timestamp: string}[]>();

  const { refetch } = trpc.fetchMessages.useQuery({ limit: 10 }, { enabled: false });

  // subscribe messages
  trpc.subscribeMessages.useSubscription(undefined, {
    onData: ({ messages })=> {
      setMessages(messages);
    },
  });

  // set initial messages
  useEffect(()=> {
    refetch().then(({ data: initialMessages })=> {
      setMessages(initialMessages);
    });
  }, []);

  return (
    <div>
      {
        messages?.map(({ id, message,timestamp })=> {
          return (
            <p key={id}>
              {message}
              <time style={{ fontSize: '10px', marginLeft: '12px'}}>{getLocaleTimeString(timestamp)}</time>
            </p>
          );
        })
      }
    </div>
  );
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
      <input onChange={handleChange} type='text' value={message}/>
      <input type="submit"/>
    </form>
  );
};

export const TRPC = () => {  
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Chats />
        <Input />
      </QueryClientProvider>
    </trpc.Provider>   
  );
};



