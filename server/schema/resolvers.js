const { Parent } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const resolvers = {
  Query: {
    parents: async () => {
      return await Parent.find({});
    },
  },
};
module.exports = resolvers;
