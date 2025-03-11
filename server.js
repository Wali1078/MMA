// server.js
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { AppDataSource } = require("./DBConnection/Database");

// 1. Import your split/merged resolvers and type definitions
const { typeDefs } = require("./GraphQL/schema"); // or { typeDefs } if you export it named
const resolvers = require("./GraphQL/resolvers"); // index.js in the resolvers folder

const app = express();

// 2. Initialize your database first
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // 3. Create an ApolloServer instance with your schema & resolvers
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => {
        // If you need to pass data (e.g., auth info) to all resolvers, do it here
        return {};
      },
    });

    // 4. Start the Apollo Server, then apply it as middleware to Express
    server.start().then(() => {
      server.applyMiddleware({ app });
      app.listen(4000, () => {
        console.log(
          `Server ready at http://localhost:4000${server.graphqlPath}`
        );
      });
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
