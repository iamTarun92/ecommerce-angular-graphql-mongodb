import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";

import typeDefs from "./models/typeDefs-gql.js";
import resolvers from "./models/resolvers-gql.js";
import { router } from "./routes/student.js";
import { connectMongoDb } from "./connection.js";
import { JWT_SECRET, mongoURI, port } from "./config.js";
import { startStandaloneServer } from "@apollo/server/standalone";

// Verify JWT middleware
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

// Apollo server context
const context = ({ req }) => {
  const token = req.headers.authorization || "";
  const { userId } = verifyToken(token) || {};
  return { userId };
};

async function startServer() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors({ origin: "*" }));
  // app.use("/graphql", expressMiddleware(server));


  // GraphQL Connection
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await startStandaloneServer(server, {
    context,
    listen: { port: 3000 },
  });

  // await server.start();


  // MongoDB Connection
  connectMongoDb(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error));

  // Express Routes
  app.use("/MongoDB", router);

  // USe for image show with localpath
  app.use("/uploads", express.static("uploads"));

  app.listen(port, () => {
    console.log(`The app listening on port ${port}`);
  });
}

startServer();
