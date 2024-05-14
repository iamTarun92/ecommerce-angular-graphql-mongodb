const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

// MongoDB connection string
const mongoURI = "mongodb://localhost:27017";
const dbName = "mydatabase";

// Connect to MongoDB
MongoClient.connect(mongoURI, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);
    return;
  }

  const db = client.db(dbName);
  console.log("Connected to MongoDB");

  // Routes
  app.get("/api/users", async (req, res) => {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  });

  app.post("/api/users", async (req, res) => {
    const newUser = { name: "John Doe", email: "john@example.com" };
    const result = await db.collection("users").insertOne(newUser);
    res.json(result.ops[0]);
  });

  app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const updatedUser = { name: "Jane Doe", email: "jane@example.com" };
    const result = await db
      .collection("users")
      .updateOne({ _id: ObjectId(id) }, { $set: updatedUser });
    res.json(result);
  });

  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const result = await db
      .collection("users")
      .deleteOne({ _id: ObjectId(id) });
    res.json(result);
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
