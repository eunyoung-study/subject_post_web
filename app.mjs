import express from "express";
import postsRouter from "./router/posts.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";
import { connectDB } from "./db/database.mjs";

const app = express();

// json 통신
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

app.use("/post", postsRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
    res.sendStatus(404);
});

connectDB()
    .then(() => {
        // 포트번호
        app.listen(config.host.port);
    })
    .catch(console.error);
