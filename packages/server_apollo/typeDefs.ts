export const typeDefs = `#graphql
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
