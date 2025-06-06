// 간편로그인
const session = require('express-session');
const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const path = require('path');

// app.js 불러오기
const app = require('./app');

//const app = express(); // 이부분 app.js에 이미 있음
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// openai API 키가 없어서 주석처리하고 작업함
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// app.post('/chat', async (req, res) => {
//   const userMessage = req.body.message;

//   try {
//     const chatCompletion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: userMessage }],
//     });

//     const reply = chatCompletion.choices[0].message.content;
//     res.json({ reply });
//   } catch (error) {
//     console.error('API 호출 오류:', error);
//     res.status(500).json({ error: 'ChatGPT 호출 중 오류 발생' });
//   }
// });

// 세션 및 passport 미들웨어 등록
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// 직렬화/역직렬화
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// 네이버 로그인 전략 등록
passport.use(new NaverStrategy({
  clientID:     'NTcJYgbysYC7WOqu3b1_', // <- 이거 네이버에서 발급 (남궁재민)
  clientSecret: 'yV0wk_75lK',           // <-
  callbackURL:  "http://localhost:3000/auth/naver/callback"
}, async (accessToken, refreshToken, profile, done) => {
  // 네이버에서 받은 정보로 우리 DB에 자동 회원가입/로그인 처리
  const email = profile.emails[0].value;
  const username = profile.displayName;
// DB에 있는지 확인
  const [rows] = await require('./db').query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) {
    // 없으면 자동가입
    const user_id = 'naver_' + Math.floor(Math.random() * 1000000000); // 랜덤 id
    await require('./db').query(
      'INSERT INTO users (user_id, email, username, password) VALUES (?, ?, ?, ?)',
      [user_id, email, username, 'naver_oauth']  // password는 그냥 더미
    );
    return done(null, { user_id, email, username });
  } else {
    // 있으면 바로 로그인
    return done(null, rows[0]);
  }
}));

// 네이버 로그인 라우터
app.get('/auth/naver', passport.authenticate('naver', { scope: ['profile'] }));

// 네이버 로그인 콜백 라우터
app.get('/auth/naver/callback', passport.authenticate('naver', {
  failureRedirect: '/login.html'
}), (req, res) => {
  // 로그인 성공 시 메인으로 이동
  res.redirect(`/index.html?user_id=${req.user.user_id}`);
});

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
});