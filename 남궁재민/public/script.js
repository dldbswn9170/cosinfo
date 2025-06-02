document.getElementById('findPasswordForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const res = await fetch('/find-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const text = await res.text();
  document.getElementById('result').innerText = text;
});
