import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    me: User!
    post: Post!
    add(a: Float!, b: Float!): Float!
    grades: [Int!]!
    sum(numbers: [Float!]!): Float!
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
    add: (parent, args) => args.a + args.b,
    grades: (parent, args, ctx, info) => [99, 89, 87, 97, 88],
    sum: (parent, args) => {
      if (args.numbers.length === 0) {
        return 0;
      }
      return args.numbers.reduce((accom, currentValue) => accom + currentValue);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
