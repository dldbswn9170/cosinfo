require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = chatCompletion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('API 호출 오류:', error);
    res.status(500).json({ error: 'ChatGPT 호출 중 오류 발생' });
  }
});

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
});
