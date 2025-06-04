// 필요한 모듈 불러오기
const express = require('express');
const db = require('./db'); // Promise 방식으로 db.js 불러옴
const app = express();         // express 앱 생성

// 요청 본문을 파싱할 수 있도록 설정 (form 데이터 받아오기)
app.use(express.json()); // public 폴더에서 HTML 파일 제공

// 회원가입
app.post('/register', async (req, res) => {
  const { user_id, email, username, password, "confirm-password": confirmPassword } = req.body;

  // 비밀번호 일치 확인
  if (password !== confirmPassword) {
    return res.send('비밀번호가 일치하지 않습니다.');
  }

  try {
    // 이메일 중복 확인
    const [rows] = await db.query(
      'SELECT * FROM users WHERE user_id = ? OR email = ?',
      [user_id, email]);
    if (rows.length > 0) {
      if (rows[0].user_id === user_id) {
        return res.send('이미 사용 중인 아이디 입니다.');
      }
      if (rows[0].email === email) {
        return res.send('이미 사용 중인 이메일입니다.');
      }
    }

    // 회원 등록
    await db.query(
      'INSERT INTO users (user_id, email, username, password) VALUES (?, ?, ?, ?)',
      [user_id, email, username, password]
    );
    res.send('회원가입 성공!');
  } catch (err) {
    console.error(err);
    res.status(500).send('회원가입 실패');
  }
});

// 로그인
app.post('/login', async (req, res) => {
  const { user_id, password } = req.body;

  try {
    // 아이디로 회원 찾기
    const [rows] = await db.query(
      'SELECT * FROM users WHERE user_id = ?',
      [user_id]);
    if (rows.length === 0) {
      return res.send('존재하지 않는 아이디입니다.');
    }

    const user = rows[0];

    // 비밀번호 일치 확인
    if (user.password !== password) {
      return res.send('비밀번호가 틀렸습니다.');
    }

    // 로그인 성공
    res.send('로그인 성공!');
  } catch (err) {
    console.error(err);
    res.status(500).send('로그인 오류');
  }
});

// 비밀번호 찾기 (이메일로 찾기)
app.post('/find-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.send('등록되지 않은 이메일입니다.');
    }
    const user = rows[0];
    res.send(`비밀번호: ${user.password}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('오류가 발생했습니다.');
  }
});

// 마이페이지 사용자 정보 조회
app.get('/user', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).send('userId 필요');
  }
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('서버 오류');
  }
});

// 사용자 정보 수정
app.post('/user', async (req, res) => {
  const { old_user_id, user_id, username, password, email } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [old_user_id]);
    if (users.length === 0) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    const [dup] = await db.query(
      'SELECT * FROM users WHERE (user_id = ? OR email = ?) AND user_id != ?',
      [user_id, email, old_user_id]
    );
    if (dup.length > 0) return res.status(409).json({ message: '중복된 정보가 있습니다.' });

    await db.query(
      'UPDATE users SET user_id = ?, username = ?, password = ?, email = ? WHERE user_id = ?',
      [user_id, username, password, email, old_user_id]
    );
    res.json({ message: '정보가 성공적으로 수정되었습니다!', new_user_id: user_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '정보 수정 중 오류가 발생했습니다.' });
  }
});

module.exports = app;
