// mock data
const users = [
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

const posts = [
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

const comments = [
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

const db = {
  users,
  posts,
  comments
};

export default db;
