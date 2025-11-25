function signup(event) {
    event.preventDefault();

    const userid = document.getElementById("userid").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const profileImageUrl = document.getElementById("profile-preview").src;

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
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(JSON.stringify(data, null, 2));
            // 서버 응답에 'token'이 있을 경우 저장
            if (data.token) {
                localStorage.setItem("token", data.token);
                alert("회원가입 성공!");
                // 성공 후 페이지 이동 로직 추가 가능
            } else {
                alert(
                    `회원가입 요청은 성공했지만 토큰을 받지 못했습니다: ${
                        data.message || "응답 확인 필요"
                    }`
                );
            }
        })
        .catch((error) => {
            console.error("회원가입 중 에러 발생:", error);
            alert(
                `회원가입 실패: ${error.message || "서버 연결 또는 처리 오류"}`
            );
        });
}

// 가입하기
const registrationForm = document.querySelector(".form");

if (registrationForm) {
    // 폼에 submit 이벤트 리스너를 추가
    registrationForm.addEventListener("submit", signup);
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
