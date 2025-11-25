// npm i dotenv
import dotenv from "dotenv";

// 자동으로 프로젝트 폴더에 있는 ".env" 파일을 찾아서 읽음
// 그러고 process.env에 넣어줌
dotenv.config();

// 데이터가 있는지 확인하는 함수
function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    if (value == null) {
        throw new Error(`키 ${key}는 undefined!!`);
    }

    return value;
}

export const config = {
    jwt: {
        secretKey: required("JWT_SECRET"),
        expiresInSec: parseInt(required("JWT_EXPIRES_SEC")),
    },
    bcrypt: {
        saltRounds: parseInt(required("BCRYPT_SALT_ROUNDS", 12)),
    },
    host: {
        port: parseInt(required("HOST_PORT", 9090)),
    },
    db: {
        host: required("DB_HOST"),
    },
};
