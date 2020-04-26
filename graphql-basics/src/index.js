import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuid } from 'uuid';

// mock data
let users = [
  {
    id: '1',
    name: 'Teerapat Prommarak',
    email: 'teerapat@test.com',
    age: 34
  },
  {
    id: '2',
    name: 'Andrew Mead',
    email: 'andrew@test.com',
    age: 29
  },
  {
    id: '3',
    name: 'Stephen Grider',
    email: 'stephen@test.com',
    age: 30
  },
  {
    id: '4',
    name: 'Colt Steele',
    email: 'colt@test.com',
    age: 28
  }
];

let posts = [
  {
    id: '1',
    title: 'Today, I learned graphql',
    body:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'Graphql is great',
    body:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'How to migrate from REST API to graphql',
    body:
      'Contrary to popular belief, Lorem Ipsum is not simply random text. Today is a great time to learn graphql',
    published: true,
    author: '2'
  },
  {
    id: '4',
    title: 'Create new graphql schema',
    body:
      'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested..',
    published: false,
    author: '3'
  }
];

let comments = [
  {
    id: '6',
    text: 'Awesome!',
    author: '2',
    post: '3'
  },
  {
    id: '7',
    text: 'That is great!',
    author: '2',
    post: '2'
  },
  {
    id: '8',
    text: 'Looking good!',
    author: '1',
    post: '4'
  },
  {
    id: '9',
    text: 'It is OK!',
    author: '3',
    post: '1'
  },
  {
    id: '10',
    text: 'Great article',
    author: '4',
    post: '1'
  }
];

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  # custom type
  type User {
    id: ID!
    name: String!
    email:String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput): Comment!
    deleteComment(id: ID!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
    users: (parent, args, ctx, info) => {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts: (parent, args, ctx, info) => {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return isTitleMatch || isBodyMatch;
      });
    },
    comments: (parent, args, ctx, info) => {
      return comments;
    }
  },

  Post: {
    author: (parent, args, ctx, info) => {
      return users.find(user => user.id === parent.author);
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter(comment => parent.id === comment.post);
    }
  },
  User: {
    posts: (parent, args, ctx, info) => {
      return posts.filter(post => parent.id === post.author);
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter(comment => parent.id === comment.author);
    }
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find(user => user.id === parent.author);
    },
    post: (parent, args, ctx, info) => {
      return posts.find(post => post.id === parent.post);
    }
  },

  Mutation: {
    createUser: (parent, args, ctx, info) => {
      const isEmailTaken = users.some(user => user.email === args.data.email);

      if (isEmailTaken) {
        throw new Error('Email already taken.');
      }

      const user = {
        id: uuid(),
        ...args.data
      };

      users.push(user);

      return user;
    },

    deleteUser: (parent, args, ctx, info) => {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        const isMatch = post.author === args.id;

        if (isMatch) {
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !isMatch;
      });
      comments = comments.filter(comment => comment.author !== args.id);

      return deletedUsers[0];
    },

    createPost: (parent, args, ctx, info) => {
      const userExists = users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error('User not found.');
      }

      const post = {
        id: uuid(),
        ...args.data
      };

      posts.push(post);

      return post;
    },

    deletePost: (parent, args, ctx, info) => {
      const deletedPost = posts.find(post => post.id === args.id);

      if (!deletedPost) {
        throw new Error('Post not found');
      }

      posts = posts.filter(post => post.id !== args.id);
      comments = comments.filter(comment => comment.post !== args.id);

      return deletedPost;
    },

    createComment: (parent, args, ctx, info) => {
      const userExists = users.some(user => user.id === args.data.author);
      const postExists = posts.some(
        post => post.id === args.data.post && post.published
      );

      if (!userExists) {
        throw new Error('User not found.');
      }
      if (!postExists) {
        throw new Error('Post not found.');
      }

      const comment = {
        id: uuid(),
        ...args.data
      };

      comments.push(comment);

      return comment;
    },

    deleteComment: (parent, args, ctx, info) => {
      const deletedComment = comments.find(comment => comment.id === args.id);

      if (!deletedComment) {
        throw new Error('Comment not found');
      }

      comments = comments.filter(comment => comment.id !== args.id);

      return deletedComment;
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log('Server is running on localhost:4000'));
