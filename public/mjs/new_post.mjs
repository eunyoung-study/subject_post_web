// 가입하기
const writePostForm = document.querySelector("#posts-container");

if (writePostForm) {
    // 폼에 submit 이벤트 리스너를 추가
    writePostForm.addEventListener("click", writePost);
}
