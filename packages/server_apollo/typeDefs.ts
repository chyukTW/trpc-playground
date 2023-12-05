import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Message {
    id: ID!
    message: String
    timestamp: String!
  }
  type MessageCreated {
    message: String
  }
  type Query {
    messages: [Message]
  }
  type Subscription {
    messages: [Message]
  }
  type Mutation {
    addMessage(message: String!): MessageCreated
  }
`;
