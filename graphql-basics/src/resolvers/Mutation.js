import { v4 as uuid } from 'uuid';
const Mutation = {
  createUser: (parent, args, { db }, info) => {
    const isEmailTaken = db.users.some(user => user.email === args.data.email);

    if (isEmailTaken) {
      throw new Error('Email already taken.');
    }

    const user = {
      id: uuid(),
      ...args.data
    };

    db.users.push(user);

    return user;
  },

  deleteUser: (parent, args, { db }, info) => {
    const userIndex = db.users.findIndex(user => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(post => {
      const isMatch = post.author === args.id;

      if (isMatch) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }

      return !isMatch;
    });
    db.comments = db.comments.filter(comment => comment.author !== args.id);

    return deletedUsers[0];
  },

  createPost: (parent, args, { db }, info) => {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error('User not found.');
    }

    const post = {
      id: uuid(),
      ...args.data
    };

    db.posts.push(post);

    return post;
  },

  deletePost: (parent, args, { db }, info) => {
    const deletedPost = db.posts.find(post => post.id === args.id);

    if (!deletedPost) {
      throw new Error('Post not found');
    }

    db.posts = db.posts.filter(post => post.id !== args.id);
    db.comments = db.comments.filter(comment => comment.post !== args.id);

    return deletedPost;
  },

  createComment: (parent, args, { db }, info) => {
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExists = db.posts.some(
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

    db.comments.push(comment);

    return comment;
  },

  deleteComment: (parent, args, { db }, info) => {
    const deletedComment = db.comments.find(comment => comment.id === args.id);

    if (!deletedComment) {
      throw new Error('Comment not found');
    }

    db.comments = db.comments.filter(comment => comment.id !== args.id);

    return deletedComment;
  }
};

export default Mutation;
