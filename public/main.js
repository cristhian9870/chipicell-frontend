document.getElementById('btn').addEventListener('click', async () => {
  const out = document.getElementById('out');
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    const data = await res.json();
    out.textContent = JSON.stringify({ status: res.status, body: data }, null, 2);
  } catch (err) {
    out.textContent = String(err);
  }
});
