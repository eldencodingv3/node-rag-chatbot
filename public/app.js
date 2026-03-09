const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Send on Enter key
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to chat
  addMessage(message, 'user');
  userInput.value = '';

  // Disable input while waiting
  setLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (response.ok) {
      addMessage(data.reply, 'bot');
    } else {
      addMessage('Sorry, something went wrong. Please try again.', 'bot');
    }
  } catch (error) {
    addMessage('Unable to connect to the server. Please try again later.', 'bot');
  } finally {
    setLoading(false);
  }
}

function addMessage(text, sender) {
  // Remove any loading indicator first
  const loadingEl = document.querySelector('.loading');
  if (loadingEl) loadingEl.remove();

  const div = document.createElement('div');
  div.className = `message ${sender}-message`;
  div.innerHTML = `<div class="message-content">${escapeHtml(text)}</div>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  userInput.disabled = isLoading;

  if (isLoading) {
    const div = document.createElement('div');
    div.className = 'message bot-message loading';
    div.innerHTML = '<div class="message-content"><span class="dots"><span>.</span><span>.</span><span>.</span></span></div>';
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } else {
    userInput.focus();
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
