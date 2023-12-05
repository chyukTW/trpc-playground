import { useEffect, useState } from 'react';

import { getLocaleTimeString } from '../utils';

type Message = {id: number, message: string, timestamp: string};

const SERVER_URL = 'http://127.0.0.1:2024';

const Input = () => {
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    await fetch(`${SERVER_URL}/messages`, {
      body: JSON.stringify({ message}),
      method: 'POST',
      mode: 'no-cors'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    if(!message) return;

    e.preventDefault();

    sendMessage();

    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} type='text' value={message}/>
      <input type="submit"/>
    </form>
  );
};


const SSEChats = () => {
  const [messages, setMessages] = useState<Message[]>();

  useEffect(()=> {
    const eventSource = new EventSource(`${SERVER_URL}/messages`);
    
    eventSource.onmessage = ({data}) => {
      setMessages(JSON.parse(data));
    };
    
    return ()=> eventSource.close();
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

export const SSE = () => {
  return (
    <div>
      <SSEChats />
      <Input />
    </div>
  );
};
