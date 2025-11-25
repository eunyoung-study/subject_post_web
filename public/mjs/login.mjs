// 로그인
const loginForm = document.querySelector(".form");

if (loginForm) {
    // 폼에 submit 이벤트 리스너를 추가
    loginForm.addEventListener("submit", login);
}

function login(event) {
    event.preventDefault();

    const userid = document.getElementById("userid").value;
    const password = document.getElementById("password").value;

    console.log(event);

    // 유효성 검사
    if (!userid || !password) {
        alert("필수 입력 항목(아이디, 비밀번호)을 모두 채워주세요.");
        return;
    }

    fetch("http://127.0.0.1:8080/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userid,
            password,
        }),
    })
        .then((response) => {
            // 응답 본문을 읽기 전에 복제 (response.json()은 한 번만 호출 가능)
            const jsonPromise = response.json().catch(() => ({})); // JSON 파싱 실패 시 빈 객체 반환

            if (!response.ok) {
                // 실패 응답 (4xx, 5xx)일 때: JSON 본문을 읽어서 에러를 던짐
                return jsonPromise.then((errorData) => {
                    const status = response.status;
                    let message;

                    if (status === 409) {
                        message = `로그인 실패 (409 Conflict): ${
                            errorData.message || "가입되지 않은 사용자입니다."
                        }`;
                    } else {
                        message = `HTTP error! status: ${status} | 서버 응답: ${JSON.stringify(
                            errorData,
                            null,
                            2
                        )}`;
                    }
                    throw new Error(message);
                });
            }

            // 성공 응답일 때: 다음 .then()으로 JSON 데이터를 전달
            return jsonPromise;
        })
        .then((data) => {
            // JSON 데이터가 성공적으로 파싱된 후 이 블록이 실행
            console.log(
                "회원가입 성공 응답 데이터 (data):",
                JSON.stringify(data, null, 2)
            );

            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("로그인 성공! 게시글 페이지로 이동합니다. 🎉");
                window.location.href = "../post.html";
            } else {
                alert(
                    `로그인 요청은 성공했지만 토큰을 받지 못했습니다: ${
                        data.message || "응답 확인 필요"
                    }`
                );
            }
        })
        .catch((error) => {
            console.error("로그인 실패:", error);
            alert(`로그인 실패: ${error.message}`);
        });
}
