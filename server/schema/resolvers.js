const { signToken } = require("../utils/auth");
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const user = User.findOne({ _id: context.user._id });
        return user;
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw new AuthenticationError("You wrong");
      }

      const isCorrectPassword = await user.isCorrectPassword(password);
      if (!isCorrectPassword) {
        throw new AuthenticationError("You wrong");
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: args.bookData } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError("You must be logged in to save a book");
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findByIdAndDelete(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );

        return user;
      }

      throw new AuthenticationError("You must be logged in to remove a book");
    },
  },
};

module.exports = resolvers;
