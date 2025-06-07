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

// 인기 검색어, 자동 완성
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/popular-ingredients');
    const topIngredients = await res.json();

    // 순위 리스트 삽입
    const list = document.getElementById('ingredient-list');
    list.innerHTML = ''; // 기존 내용 초기화
    topIngredients.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });

  } catch (err) {
    console.error('인기 성분 불러오기 실패:', err);
    document.getElementById('top-ingredient').textContent = '불러오기 실패';
  }
  
  // 자동 완성
  const searchInput = document.getElementById('search');
  const suggestionBox = document.getElementById('suggestion-box');

  searchInput.addEventListener('input', async () => {
    const keyword = searchInput.value.trim();

    // 입력값 없으면 박스 숨김
    if (!keyword) {
      suggestionBox.style.display = 'none';
      suggestionBox.innerHTML = '';
      return;
    }

    // 서버에 요청
    try {
      const res = await fetch(`/api/suggestions?keyword=${encodeURIComponent(keyword)}`);
      const suggestions = await res.json();

      // 결과가 없으면 숨김
      if (suggestions.length === 0) {
        suggestionBox.style.display = 'none';
        suggestionBox.innerHTML = '';
        return;
      }

      // 결과가 있으면 박스 표시
      suggestionBox.innerHTML = '';
      suggestions.forEach(item => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = item;
        div.addEventListener('click', () => {
          searchInput.value = item;
          suggestionBox.style.display = 'none';
        });
        suggestionBox.appendChild(div);
      });

      suggestionBox.style.display = 'block';
    } catch (err) {
      console.error('자동완성 오류:', err);
      suggestionBox.style.display = 'none';
    }
  });
});





