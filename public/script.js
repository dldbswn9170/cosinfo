async function sendMessage() {
  const userInput = document.getElementById("search").value;
  if (!userInput.trim()) return;

  addMessage(userInput, 'user');
  document.getElementById("search").value = '';

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    addMessage(data.reply, 'bot');
  } catch (error) {
    console.error('Error:', error);
    addMessage("오류가 발생했습니다. 다시 시도해주세요.", 'bot');
  }
}

function addMessage(text, type, responseId = null) {
  const chatbox = document.getElementById("chatbox");
  const wrapper = document.createElement("div");
  wrapper.className = `message-wrapper ${type}`;

  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.textContent = text;

  wrapper.appendChild(msg);

  if (type === 'bot') {
    const bookmarkBtn = document.createElement("button");
    bookmarkBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
    bookmarkBtn.className = "bookmark-btn";
    bookmarkBtn.title = "북마크";
    bookmarkBtn.onclick = () => {
      if (responseId) {
        bookmarkResponse(responseId);
      } else {
        alert("북마크할 응답 ID가 없습니다.");
      }
    };

    wrapper.appendChild(bookmarkBtn);
  }

  chatbox.appendChild(wrapper);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function bookmarkResponse(responseId) {
  try {
    const res = await fetch('/bookmark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response_id: responseId })
    });

    if (res.ok) {
      alert("북마크가 저장되었습니다!");
    } else {
      alert("북마크 저장에 실패했습니다.");
    }
  } catch (err) {
    console.error('Bookmark Error:', err);
    alert("서버 에러가 발생했습니다.");
  }
}
