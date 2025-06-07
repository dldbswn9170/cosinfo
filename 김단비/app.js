// app.js
const express = require('express');
const db = require('./db'); // DB는 promise 기반
const app = express();

// JSON 파싱 설정 (서버에서 설정하도록)
app.use(express.json());

// 회원가입
app.post('/register', async (req, res) => {
  const { user_id, username, password, "confirm-password": confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send('비밀번호가 일치하지 않습니다.');
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
      return res.send('이미 가입된 이메일입니다.');
    }

    await db.query(
      'INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)',
      [user_id, username, password]
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
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (rows.length === 0) {
      return res.send('존재하지 않는 이메일입니다.');
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.send('비밀번호가 틀렸습니다.');
    }

    res.send('로그인 성공!');
  } catch (err) {
    console.error(err);
    res.status(500).send('로그인 오류');
  }
});

// 비밀번호 찾기
app.post('/find-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [email]);
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

// 마이페이지
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

//인기 검색어 
app.get('/api/popular-ingredients', async (req, res) => {
  const query = `
    SELECT term 
    FROM popular_searches 
    ORDER BY search_count DESC 
    LIMIT 5
  `;

  try {
    const [results] = await db.query(query);
    const ingredients = results.map(row => row.term);
    res.json(ingredients);
  } catch (err) {
    console.error('인기 성분 조회 실패:', err);
    res.status(500).send('DB 오류');
  }
});

// 자동완성 API
app.get('/api/suggestions', async (req, res) => {
  const q = req.query.keyword || '';
  try {
    const [rows] = await db.query(
      'SELECT name FROM ingredients WHERE name LIKE ? ORDER BY name LIMIT 5',
      [`${q}%`]
    );
    const suggestions = rows.map(r => r.name);
    res.json(suggestions);
  } catch (err) {
    console.error('자동완성 오류:', err);
    res.status(500).send('DB 오류');
  }
});

module.exports = app;
