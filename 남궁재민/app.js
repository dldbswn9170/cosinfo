// 필요한 모듈 불러오기
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Promise 방식으로 db.js 불러옴

const app = express();         // express 앱 생성
const port = 3000;             // 서버 포트 번호

// 요청 본문을 파싱할 수 있도록 설정 (form 데이터 받아오기)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public')); // public 폴더에서 HTML 파일 제공

// 회원가입
app.post('/register', async (req, res) => {
  const { user_id, username, password, "confirm-password": confirmPassword } = req.body;

  // 비밀번호 일치 확인
  if (password !== confirmPassword) {
    return res.send('비밀번호가 일치하지 않습니다.');
  }

  try {
    // 이메일 중복 확인
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (rows.length > 0) {
      return res.send('이미 가입된 이메일입니다.');
    }

    // 회원 등록
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
    // 해당 이메일로 회원 찾기
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (rows.length === 0) {
      return res.send('존재하지 않는 이메일입니다.');
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

// 기본 라우트
app.get('/', (req, res) => {
  res.send('서버 연결 성공!');
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중`);
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
