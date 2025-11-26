const postsListContainer = document.getElementById("posts-list");
const POSTS_API_URL = "http://127.0.0.1:8080/post";

/**
 * 단일 게시글 데이터를 받아 HTML 요소를 생성
 */
function createPostElement(post) {
    // 여기서 'undefined' 문제를 해결
    const title = post.name;
    const content = post.text || "내용 없음";
    const author = post.userid || "알 수 없음"; // 작성자 필드도 확인

    const currentUserId = localStorage.getItem("userid");
    const isOwner = currentUserId === post.userid;

    // 버튼 그룹 생성
    let actionButtons = ``;

    console.log(isOwner);

    // 로그인한 사용자가 작성자와 일치할 때만 수정/삭제 버튼을 보여줌
    if (isOwner) {
        actionButtons += `
            <button onclick="editPost(${post.id})" class="edit-btn">수정</button>
            <button onclick="deletePost(${post.id})" class="delete-btn">삭제</button>
        `;
    }

    return `
        <article class="post-item" data-post-id="${post.id}">
            <h3>${title}</h3>
            <p class="post-content">${content}</p> 

            <div class="post-footer">
                <div class="action-buttons-left">
                    ${actionButtons}
                </div>
                <p class="post-meta">작성자: <strong>${author}</strong></p>
            </div>
            
        </article>
    `;
}

/**
 * API에서 게시글 목록을 가져와 HTML에 표시
 */
async function loadPosts() {
    const token = localStorage.getItem("token");

    if (!token) {
        postsListContainer.innerHTML =
            '<p style="text-align: center; color: #e91e63;">로그인이 필요합니다. 게시글을 보려면 로그인해 주세요.</p>';
        return;
    }

    try {
        const response = await fetch(POSTS_API_URL, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            // 401 Unauthorized 에러 시 토큰 삭제 및 로그인 유도
            if (response.status === 401) {
                localStorage.removeItem("token");
                postsListContainer.innerHTML =
                    '<p style="text-align: center; color: red;">인증이 만료되었습니다. 다시 로그인해 주세요.</p>';
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const posts = await response.json();

        postsListContainer.innerHTML = "";

        if (!posts || posts.length === 0) {
            // posts가 null/undefined이거나 비어있을 경우
            postsListContainer.innerHTML =
                '<p style="text-align: center; color: #666;">아직 등록된 게시글이 없습니다.</p>';
            return;
        }

        const postsHtml = posts.map(createPostElement).join("");
        postsListContainer.innerHTML = postsHtml;
    } catch (error) {
        console.error("게시글 로딩 실패:", error);
        postsListContainer.innerHTML = `<p style="text-align: center; color: red;">게시글을 불러오는 중 오류가 발생했습니다: ${error.message}</p>`;
    }
}

// 페이지 로드 시 함수 실행
loadPosts();
