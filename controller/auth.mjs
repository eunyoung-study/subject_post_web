import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";

// 토큰 생성
async function createJwtToken(id) {
    return jwt.sign({ id }, config.jwt.secretKey, {
        expiresIn: config.jwt.expiresInSec,
    });
}

// 회원 가입하는 함수
export async function singup(req, res, next) {
    const { userid, password, name, email, url } = req.body;

    // 회원 중복 체크
    const found = await authRepository.findByUserid(userid);
    if (found) {
        return res.status(409).json({ message: `${userid}이 이미 있습니다` });
    }

    // 비밀번호 암호화 처리
    const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds);
    const user = await authRepository.createUser({
        userid,
        password: hashed,
        name,
        email,
        url,
    });
    // const user = await authRepository.createUser(userid, password, name, email);

    const token = await createJwtToken(user.id);
    console.log(token);
    res.status(201).json({ token, user });
}

// 로그인 하는 함수
export async function login(req, res, next) {
    const { userid, password } = req.body;
    const user = await authRepository.findByUserid(userid);
    if (!user) {
        res.status(401).json(`${userid} 를 찾을 수 없음`);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: `아이디 또는 비밀번호 확인` });
    }

    const token = await createJwtToken(user.id);
    res.status(200).json({ token, user });
}

export async function me(req, res, next) {
    const user = await authRepository.findById(req.id);
    if (!user) {
        return res.status(404).json({ message: "일치하는 사용자가 없음" });
    }
    res.status(200).json({ token: req.token, userid: user.userid });
}

/*
* 직접 작성한 코드 
// 회원 가입하는 함수
export async function singup(req, res, next) {
  const { userid, password, name, email } = req.body;
  const user = await authRepository.create(userid, password, name, email);
  res.status(201).json(user);
}

// 로그인 하는 함수
export async function login(req, res, next) {
  const { userid, password } = req.body;
  const login = await authRepository.login(userid, password);
  if (login) {
    res.status(201).json({ message: "로그인 되었습니다." });
  } else {
    res.status(404).json({ message: `${userid}의 회원 정보가 없습니다` });
  }
}
*/
