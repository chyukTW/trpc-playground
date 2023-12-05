import { useEffect, useState } from 'react';

type Message = {id: number, message: string};

export const SSEChats = () => {
  const [messages, setMessages] = useState<Message[]>();

  useEffect(()=> {
    const eventSource = new EventSource('http://127.0.0.1:2024/messages');
    
    eventSource.onmessage = ({data}) => {
      setMessages(JSON.parse(data));
    };
    
    return ()=> eventSource.close();
  }, []);

  return (
    <div>
      {
        messages?.map(({ id, message })=> {
          return <p key={id}>{message}</p>;
        })
      }
    </div>
  );
};
