const POSTS_API_URL = "http://127.0.0.1:8080/post";

// URL에서 postId 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

const textArea = document.getElementById("text");
const writeBtn = document.getElementById("writePost");
const pageTitle = document.querySelector(".posts-container h2");

// 수정 모드인지 확인
const isEditMode = Boolean(postId);

// 페이지 초기화
async function initPage() {
    if (isEditMode) {
        // 수정 모드: 기존 게시글 데이터 로드
        pageTitle.textContent = "게시글 수정";
        writeBtn.textContent = "수정하기";
        await loadPostData(postId);
    } else {
        // 작성 모드
        pageTitle.textContent = "게시글";
        writeBtn.textContent = "새 글 쓰기";
    }
}

/**
 * 기존 게시글 데이터 로드
 */
async function loadPostData(id) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${POSTS_API_URL}/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("게시글을 불러올 수 없습니다.");
        }

        const post = await response.json();

        // textarea에 기존 내용 표시
        textArea.value = post.text || "";
    } catch (error) {
        console.error("게시글 로드 실패:", error);
        alert("게시글을 불러오는데 실패했습니다.");
        window.location.href = "post.html";
    }
}

/**
 * 게시글 작성 또는 수정
 */
async function submitPost() {
    const token = localStorage.getItem("token");
    const text = textArea.value.trim();

    if (!text) {
        alert("내용을 입력해주세요.");
        return;
    }

    try {
        let response;

        if (isEditMode) {
            // 수정 API 호출
            response = await fetch(`${POSTS_API_URL}/${postId}`, {
                method: "PUT", // 또는 "PATCH"
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });
        } else {
            // 작성 API 호출
            response = await fetch(POSTS_API_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });
        }

        if (!response.ok) {
            throw new Error(isEditMode ? "수정 실패" : "작성 실패");
        }

        alert(
            isEditMode ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다."
        );
        window.location.href = "post.html";
    } catch (error) {
        console.error("제출 오류:", error);
        alert(
            isEditMode
                ? "수정 중 오류가 발생했습니다."
                : "작성 중 오류가 발생했습니다."
        );
    }
}

// 이벤트 리스너
writeBtn.addEventListener("click", submitPost);

// 페이지 로드 시 초기화
initPage();
