// 회원 클래스
class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}
// 회원 객체
const user = new User("cosinfo@example.com", "1234");

// 회원가입
function register() {
    user.email = document.getElementById('email').value;
    user.password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (user.password !== confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }
}
// 비밀번호 찾기
function findPassword() {
    const email = document.getElementById('email').value;

    if (email === user.email) {
        alert(`비밀번호는 [${user.password}]입니다.`);
    }
    else {
        alert("등록된 이메일이 아닙니다.");
    }
}

// 로그인
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === user.email && password === user.password) {
        alert("로그인 성공");
        location.href = "Main.html"; // 로그인 성공 시 이동할 페이지
    }
    else if (email === user.email) {
        alert("등록되지 않은 이메일입니다.");
    }
    else if (password === user.password) {
        alert("비밀번호가 틀렸습니다.");
    }
    else {
        alert("이메일과 비밀번호가 틀렸습니다.");
    }
}
