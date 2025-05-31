document.addEventListener('DOMContentLoaded', async () => {
  const bookmarkBtn = document.querySelector('#bookmark-tab');
  const editBtn = document.querySelector('#edit-tab');
  const cardSection = document.querySelector('.card-section');
  const editSection = document.querySelector('.edit-section');

  bookmarkBtn.addEventListener('click', () => {
    cardSection.style.display = 'block';
    editSection.style.display = 'none';
    bookmarkBtn.classList.add('active');
    editBtn.classList.remove('active');
  });

  editBtn.addEventListener('click', () => {
    cardSection.style.display = 'none';
    editSection.style.display = 'block';
    editBtn.classList.add('active');
    bookmarkBtn.classList.remove('active');
  });

  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('로그인이 필요합니다.');
    location.href = 'Login.html';
    return;
  }

  try {
    const res = await fetch(`/user?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('유저 정보 불러오기 실패');

    const user = await res.json();
    document.querySelector('input[name="username"]').value = user.username || '';
    document.querySelector('input[name="user_id"]').value = user.user_id || '';
    document.querySelector('input[name="email"]').value = user.email || '';
    document.querySelector('input[name="password"]').value = user.password || '';

    document.getElementById('user-greeting').textContent = `안녕하세요, ${user.username || '사용자'}님`;
    document.getElementById('user-email').textContent = user.email || '';
  } catch (err) {
    console.error('사용자 정보 불러오기 실패:', err);
    alert('사용자 정보를 불러오는 데 실패했습니다.');
  }

  document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      old_user_id: localStorage.getItem('userId'),
      user_id: document.querySelector('input[name="user_id"]').value,
      username: document.querySelector('input[name="username"]').value,
      password: document.querySelector('input[name="password"]').value,
      email: document.querySelector('input[name="email"]').value
    };

    try {
      const res = await fetch('/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.status === 409) {
        alert('중복된 정보가 있습니다. 다시 확인해주세요.');
        return;
      }

      if (res.ok) {
        const result = await res.json();
        localStorage.setItem('userId', result.new_user_id);

        alert('정보가 성공적으로 수정되었습니다!');

        document.getElementById('user-greeting').textContent = `안녕하세요, ${data.username}님`;
        document.getElementById('user-email').textContent = data.email;
      } else {
        alert('수정 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('수정 요청 실패:', err);
      alert('요청 중 오류가 발생했습니다.');
    }
  });
});