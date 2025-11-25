import express from "express";
import * as postController from "../controller/post.mjs";
// npm i express-validator : 조건을 줘서 해커나 접근 했을때 걸러주는 역할
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validatePost = [
    body("text").trim().isLength({ min: 4 }).withMessage("최소 4자이상 입력"),
    validate,
];

// 전체 포스트 가져오기
// 특정 아이디에 대한 포스트 가져오기
// http://127.0.0.1:8080/post
// http://127.0.0.1:8080/post?userid=XXX

// 별도의 컨트롤러를 생성하여 사용
router.get("/", isAuth, postController.getPosts);

// 글번호에 대한 포스트 가져오기
// http://127.0.0.1:8080/post/:id
router.get("/:id", isAuth, postController.getPost);

// 포스트 쓰기
// http://127.0.0.1:8080/post/
router.post("/", isAuth, validatePost, postController.createPost);

// 포스트 수정하기
// http://127.0.0.1:8080/post/:id
router.put("/:id", isAuth, validatePost, postController.updatePost);

// 포스트 삭제하기
// http://127.0.0.1:8080/post/:id
router.delete("/:id", isAuth, postController.deletePost);

// router 객체를 내보내서 사용할 수 있게 하는 코드
export default router;
