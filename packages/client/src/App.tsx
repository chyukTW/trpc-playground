import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { queryClient, trpcClient } from './client';
import { trpc } from './trpc';

const Chats = () => {
  const [messages, setMessages] = useState<{id: number, message: string}[]>();

  trpc.subscribeMessages.useSubscription(undefined, {
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
      <input onChange={handleChange} type='text' value={message}/>
      <input type="submit"/>
    </form>
  );
};

function App() {  
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Chats />
        <Input />
      </QueryClientProvider>
    </trpc.Provider>   
  );
}


export default App;
