import { PubSub } from 'graphql-subscriptions';

import { getMessages, insertMessage } from './db';

const e = {
  sendMessage: 'sendMessage',
};

const pubsub = new PubSub();

const publishMessages = () => {
  pubsub.publish(e.sendMessage, {
    messages: getMessages(10) ?? [],
  });
};

export const resolvers = {
  Mutation: {
    addMessage: async (_: unknown, { message }: { message: string }) => {
      await insertMessage(message);

      publishMessages();

      return { message };
    },
  },
  Query: {
    messages: () => {
      return getMessages(10) ?? [];
    },
  },
  Subscription: {
    messages: {
      subscribe: () => pubsub.asyncIterator(e.sendMessage),
    },
  },
};
