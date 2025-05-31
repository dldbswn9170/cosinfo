document.addEventListener('DOMContentLoaded', () => {
  // 회원가입 처리
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const user_id = registerForm.user_id.value;
      const username = registerForm.username.value;
      const password = registerForm.password.value;
      const email = registerForm.email.value;

      if (!user_id || !username || !password || !email) {
        return alert('모든 값을 입력하세요.');
      }

      try {
        const res = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id, username, password, email }),
        });

        const text = await res.text();
        alert(text);

        if (res.status === 200) {
          location.href = 'Login.html';
        }
      } catch (err) {
        console.error('회원가입 오류:', err);
        alert('회원가입 중 오류 발생');
      }
    });
  }

  // 로그인 처리
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const user_id = loginForm.user_id.value;
      const password = loginForm.password.value;

      if (!user_id || !password) {
        return alert('아이디와 비밀번호를 입력하세요.');
      }

      try {
        const res = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id, password }),
        });

        const text = await res.text();
        alert(text);

        if (res.status === 200) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', user_id);
          location.href = 'index.html';
        }
      } catch (err) {
        console.error('로그인 오류:', err);
        alert('로그인 중 오류 발생');
      }
    });
  }
});

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
        location.reload(); // 또는 location.href = 'Main.html';
      });
    }
  }
});

