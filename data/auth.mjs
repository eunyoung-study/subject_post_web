import MongoDb, { ObjectId } from "mongodb";
// 컬렉션 가져오는 객체
import { getUsers } from "../db/database.mjs";

const ObjectID = MongoDb.ObjectId;

/*
 * 직접 작성한 코드 
// 회원가입 함수 
export async function create(userid, password, name, email) {
  const user = {
    id: Date.now().toString(),
    userid,
    password,
    name,
    email,
  };

  users = [user, ...users];
  return user;
}

// 로그인 함수
export async function login(userid, pw) {
  const user = users.filter((user) => user.userid === userid)[0];

  if (user && user.password === pw) {
    return true;
  } else false;
}

*/

// 회원 가입
export async function createUser(user) {
    return getUsers()
        .insertOne(user)
        .then((result) => result.insertedId.toString());
}

// 회원정보 userid 중복성 체크
/**
 * 1. 컬렉션 users를 가져옴
 * 2. userid를 찾아서 오류 없이 실행 됐다면, mapOptionalUser 실행
 */
export async function findByUserid(userid) {
    return getUsers().find({ userid }).next().then(mapOptionalUser);
}

// 회원정보 id 검색
export async function findById(id) {
    return getUsers()
        .find({ _id: new ObjectID(id) })
        .next()
        .then(mapOptionalUser);
}

function mapOptionalUser(user) {
    return user ? { ...user, id: user._id.toString() } : user;
}
