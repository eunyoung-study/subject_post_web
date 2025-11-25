// 1. npm i 로 작성한 package.json 설치
// - 실행 : npm run dev
// 2. 백엔드 구성
import express from "express";
import postsRouter from "./router/posts.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";
import { connectDB } from "./db/database.mjs";

const app = express();

// json 통신
app.use(express.json());
app.use(express.static("public"));

app.use("/post", postsRouter);
app.use("/auth", authRouter);

app.use((req, res, nexxt) => {
    res.sendStatus(404);
});

connectDB()
    .then(() => {
        // 포트번호
        app.listen(config.host.port);
    })
    .catch(console.error);
