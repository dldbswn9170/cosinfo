async function sendMessage() {
  const userInput = document.getElementById("search").value;
  if (!userInput.trim()) return;

  // 사용자 메시지 출력
  addMessage(userInput, 'user');

  // 입력창 비우기
  document.getElementById("search").value = '';

  try {
    // GPT API 호출
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();

    // GPT 응답 출력
    addMessage(data.reply, 'bot');
  } catch (error) {
    console.error('Error:', error);
    addMessage("오류가 발생했습니다. 다시 시도해주세요.", 'bot');
  }
}

function addMessage(text, type) {
  const chatbox = document.getElementById("chatbox");
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = text;
  chatbox.appendChild(msg);
  chatbox.scrollTop = chatbox.scrollHeight;
}
