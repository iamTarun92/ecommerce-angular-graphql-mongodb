const hostname = "127.0.0.1";
const port = 4000;
const dbName = "mydatabase";
const mongoURI = `mongodb://${hostname}:27017/${dbName}`;
const JWT_SECRET = "secretkey";

export { hostname, port, dbName, mongoURI, JWT_SECRET };
