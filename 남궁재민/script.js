// 이메일과 비밀번호를 입력받아 로그인 처리하는 함수
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === "cosinfo@example.com" && password === "1234") {
        alert("로그인 성공");
        window.location.href = "Main.html"; // 로그인 성공 시 이동할 페이지
    }
    else if (email === "cosinfo@example.com") {
        alert("비밀번호가 틀렸습니다.");
    }
    else if (password === "1234") {
        alert("이메일이 틀렸습니다.");
    }
    else {
        alert("이메일과 비밀번호가 틀렸습니다.");
    }
}
