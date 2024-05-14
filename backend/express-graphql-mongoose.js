import express from "express";
import { ApolloServer } from "apollo-server-express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/myapp";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  username: String,
  email: String,
});

const todoSchema = new mongoose.Schema({
  userId: String,
  id: String,
  title: String,
  completed: Boolean,
});

const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);

const typeDefs = `#graphql
    type User {
      id:ID!
      name:String
      username:String
      email:String
    }
    type Todo {
      userId:ID!
      id:ID!
      title:String
      completed:Boolean
      user:User
    }    
    type Query {
      getAllTodos:[Todo]
      getAllUsers:[User]
      getUserById(id:ID!):User
    }
  `;

const resolvers = {
  Todo: {
    user: async (todo) => User.findOne({ id: todo.userId }),
  },
  Query: {
    getAllUsers: async () => User.find(),
    getUserById: async (parent, { id }) => User.findOne({ id }),
    getAllTodos: async () => Todo.find(),
  },
};

async function startServer() {
  const app = express();
  const port = 3000;
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(cors());
  app.use(bodyParser.json());
  
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

startServer();
