// 비밀번호 찾기
const findPasswordForm = document.getElementById('findPasswordForm');
if (findPasswordForm) {
  findPasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (!email) {
      return alert('이메일을 입력하세요.');
    }
    try {
      const res = await fetch('/find-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const text = await res.text();
      document.getElementById('result').innerText = text;
    } catch (err) {
      alert('비밀번호 찾기 중 오류 발생');
    }
  });
}

// 회원가입
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const form = e.target;
    const user_id = form.user_id.value;
    const username = form.username.value;
    const password = form.password.value;
    const confirmPassword = form["confirm-password"] ? form["confirm-password"].value : '';
    const email = form.email ? form.email.value : '';

    if (!user_id || !username || !password || (form.email && !email)) {
      return alert('모든 값을 입력하세요.');
    }
    if (form["confirm-password"] && password !== confirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.');
    }

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ user_id, username, password, email, "confirm-password": confirmPassword })
      });
      const text = await res.text();
      alert(text);

      if (text.trim().includes("회원가입 성공")) {
        location.href = "login.html";
      }
    } catch (err) {
      alert('회원가입 중 오류 발생');
    }
  });
}

// 로그인
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const form = e.target;
    const user_id = form.user_id.value;
    const password = form.password.value;

    if (!user_id || !password) {
      return alert('아이디와 비밀번호를 입력하세요.');
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ user_id, password })
      });
      const text = await res.text();
      alert(text);

      if (text.trim().includes("로그인 성공")) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', user_id);
        location.href = "index.html";
      }
    } catch (err) {
      alert('로그인 중 오류 발생');
    }
  });
}

// 로그인 상태 및 로그아웃 처리
document.addEventListener('DOMContentLoaded', () => {
  const loginLink = document.getElementById('login-link');
  if (loginLink) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      loginLink.textContent = '로그아웃';
      loginLink.href = '#';
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        alert('로그아웃 되었습니다.');
        location.reload();
      });
    }
  }
});