import { getMessages, insertMessage } from './db';

export const resolvers = {
  Mutation: {
    addMessage: async (_: unknown, { message }: { message: string }) => {
      await insertMessage(message);

      return { message };
    },
  },
  Query: {
    messages: () => {
      return getMessages(10) ?? [];
    },
  },
};
