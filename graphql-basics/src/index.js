import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    me: User!
    post: Post!
    add(a: Float!, b: Float!): Float!
  }

  # custom type
  type User {
    id: ID!
    name: String!
    email:String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

const resolvers = {
  Query: {
    me: () => {
      return {
        id: '1234',
        name: 'Teerapat',
        email: 'teerapat@example.com'
      };
    },
    post: () => {
      return {
        id: 'post_id_01',
        title: 'My first try graphql.',
        body: 'GraphQL is awesome!',
        published: true
      };
    },
    greeting: (parent, args) => {
      return args.name && args.position
        ? `Hi, ${args.name}! you're ${args.position}`
        : `Hello!`;
    },
    add: (parent, args) => args.a + args.b
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
