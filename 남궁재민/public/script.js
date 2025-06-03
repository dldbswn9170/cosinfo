// 비밀번호 찾기
const findPasswordForm = document.getElementById('findPasswordForm');
if (findPasswordForm) {
  findPasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const res = await fetch('/find-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const text = await res.text();
    document.getElementById('result').innerText = text;
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
    const confirmPassword = form["confirm-password"].value;

    const res = await fetch('/register', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ user_id, username, password, "confirm-password": confirmPassword })
    });
    const text = await res.text();

    alert(text);

    if(text.trim().includes("회원가입 성공")) {
      location.href = "login.html";
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

    const res = await fetch('/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ user_id, password })
    });
    const text = await res.text();

    alert(text);

    if(text.trim().includes("로그인 성공")) {
      location.href = "index.html";
    }
  });
}
