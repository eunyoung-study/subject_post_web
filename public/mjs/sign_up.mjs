function signup(event) {
    const userid = document.getElementById("userid").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const profileImageUrl = document.getElementById("profile-preview").src;

    event.preventDefault();

    // 유효성 검사
    if (!userid || !password || !email) {
        alert("필수 입력 항목(아이디, 비밀번호, 이메일)을 모두 채워주세요.");
        return;
    }

    fetch("http://127.0.0.1:8080/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userid,
            password,
            name,
            email,
            url: profileImageUrl.startsWith("data:image")
                ? profileImageUrl
                : null,
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
                        message = `회원가입 실패 (409 Conflict): ${
                            errorData.message || "이미 존재하는 사용자입니다."
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
                alert("회원가입 성공! 로그인 페이지로 이동합니다. 🎉");
                window.location.href = "../login.html";
            } else {
                alert(
                    `회원가입 요청은 성공했지만 토큰을 받지 못했습니다: ${
                        data.message || "응답 확인 필요"
                    }`
                );
            }
        })
        .catch((error) => {
            console.error("회원가입 실패:", error);
            alert(`회원가입 실패: ${error.message}`);
        });
}

// 가입하기
const registrationForm = document.querySelector("#register-button");

if (registrationForm) {
    // 폼에 submit 이벤트 리스너를 추가
    registrationForm.addEventListener("click", signup);
}

// 프로필 사진 미리보기
const fileInput = document.getElementById("url");
const imagePreview = document.getElementById("profile-preview");
const previewContainer = document.querySelector(".profile-preview-container");

fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.classList.add("has-image");
            previewContainer.classList.add("is-visible");
        };

        reader.readAsDataURL(file);
    } else {
        imagePreview.src = "#";
        imagePreview.classList.remove("has-image");
        previewContainer.classList.remove("is-visible");
    }
});
