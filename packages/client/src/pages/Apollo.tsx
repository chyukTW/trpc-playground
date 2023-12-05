import { ApolloProvider, gql, useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import {  useEffect, useState } from 'react';

import { apolloClient } from '../client';
import { getLocaleTimeString } from '../utils';

const Chats = () => {
  const [messages, setMessages] = useState<{id: number, message: string, timestamp: string}[]>();

  const { data } = useSubscription(gql`
    subscription OnMessage {
      messages {
        id,
        message,
        timestamp
      }
    }
  `,);

  const [getMessages] = useLazyQuery(gql`
    query GetMessages {
      messages {
        id,
        message,
        timestamp
      }
    }
  `);

  useEffect(()=> {
    if(!data){
      return;
    }
    
    setMessages(data.messages);
  }, [data]);

  // set initial messages
  useEffect(()=> {
    (async()=> {
      const response = await getMessages();

      setMessages(response.data.messages);
    })();
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

  const [ sendMessage ] = useMutation(gql`
    mutation SendMessage($message: String!) {
      addMessage(message: $message) {
        message
      }
    }
  `);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    if(!message) return;

    e.preventDefault();

    sendMessage({ variables: { message }});

    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} type='text' value={message}/>
      <input type="submit"/>
    </form>
  );
};

export const Apollo = () => {  
  return (
    <ApolloProvider client={apolloClient}>
      <Chats />
      <Input />
    </ApolloProvider>
  );
};



