import { config } from "../config.mjs";
// npm i mongodb
import MongoDB from "mongodb";

let db;

export async function connectDB() {
  return MongoDB.MongoClient.connect(config.db.host).then((client) => {
    db = client.db("sampleData");
  });
}

export function getUsers() {
  return db.collection("users");
}

export function getPosts() {
  return db.collection("posts");
}
