import { config } from "../config.mjs";
// npm i mongodb
import MongoDB from "mongodb";

let db;

export async function connectDB() {
    return MongoDB.MongoClient.connect(config.db.host).then((client) => {
        // db : aidetect 안에 MongoDB로 가져온 데이터가 들어가있음
        db = client.db("aidetect");
    });
}

export function getUsers() {
    return db.collection("users");
}

export function getPosts() {
    return db.collection("posts");
}
