/* ==========================================================================
   Sankalp Digital Pathshala - AI Assistant & Chatbot Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('aiWidgetToggle');
  const modal = document.getElementById('aiWidgetModal');
  const closeBtn = document.getElementById('aiWidgetClose');

  // Open/Close Widget
  if (toggleBtn && modal) {
    toggleBtn.addEventListener('click', () => {
      modal.classList.toggle('active');
    });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Handle Input typing and Send Trigger
  const chatInput = document.getElementById('chatInputText');
  const sendBtn = document.getElementById('chatSendBtn');
  if (chatInput && sendBtn) {
    sendBtn.addEventListener('click', submitWidgetChat);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitWidgetChat();
    });
  }

  // Solver triggers
  const solverInput = document.getElementById('solverInputText');
  const solverSendBtn = document.getElementById('solverSendBtn');
  if (solverInput && solverSendBtn) {
    solverSendBtn.addEventListener('click', submitSolverQuestion);
    solverInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitSolverQuestion();
    });
  }
});

// Switch between Chat, Solver, and Planner tabs
function switchWidgetTab(tabName) {
  // Reset tabs classes
  const tabButtons = document.querySelectorAll('.ai-widget-tabs .tab-btn');
  tabButtons.forEach(btn => btn.classList.remove('active'));

  const panels = document.querySelectorAll('.ai-tab-contents .tab-panel');
  panels.forEach(p => p.classList.remove('active'));

  // Highlight active
  if (tabName === 'chat') {
    tabButtons[0].classList.add('active');
    document.getElementById('panel-chat').classList.add('active');
  } else if (tabName === 'solve') {
    tabButtons[1].classList.add('active');
    document.getElementById('panel-solve').classList.add('active');
  } else if (tabName === 'plan') {
    tabButtons[2].classList.add('active');
    document.getElementById('panel-plan').classList.add('active');
  }
}

// Append Chat Messages
function appendMessage(logId, sender, text) {
  const log = document.getElementById(logId);
  if (!log) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${sender}`;
  
  // Basic markdown format helper
  let formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');

  msgDiv.innerHTML = `<p>${formattedText}</p>`;
  log.appendChild(msgDiv);
  log.scrollTop = log.scrollHeight;
}

// Chatbot Submit logic
async function submitWidgetChat() {
  const input = document.getElementById('chatInputText');
  const query = input.value.trim();
  if (!query) return;

  // Append user message
  appendMessage('chatLog', 'user', query);
  input.value = '';

  // Appending typing indicator
  appendMessage('chatLog', 'bot', 'Thinking...');
  const messages = document.querySelectorAll('#chatLog .chat-message.bot');
  const typingMsg = messages[messages.length - 1];

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query })
    });
    const result = await response.json();
    
    // Replace typing state
    if (result.success) {
      typingMsg.innerHTML = `<p>${result.reply.replace(/\n/g, '<br>')}</p>`;
    } else {
      typingMsg.innerHTML = `<p>Error retrieving response. Please try again later.</p>`;
    }
  } catch (err) {
    typingMsg.innerHTML = `<p>Server offline. Try again later.</p>`;
  }
  
  const log = document.getElementById('chatLog');
  log.scrollTop = log.scrollHeight;
}

// AI Solver submit logic
async function submitSolverQuestion() {
  const input = document.getElementById('solverInputText');
  const query = input.value.trim();
  if (!query) return;

  appendMessage('solverLog', 'user', query);
  input.value = '';

  appendMessage('solverLog', 'bot', 'Analyzing and solving equations step-by-step...');
  const messages = document.querySelectorAll('#solverLog .chat-message.bot');
  const typingMsg = messages[messages.length - 1];

  try {
    const response = await fetch('/api/solve-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionText: query })
    });
    const result = await response.json();

    if (result.success) {
      typingMsg.innerHTML = `<p>${result.solution.replace(/\n/g, '<br>')}</p>`;
    } else {
      typingMsg.innerHTML = `<p>Error solving question. Please clarify context.</p>`;
    }
  } catch (err) {
    typingMsg.innerHTML = `<p>Connection error. Using local formulas solver fallback.</p>`;
  }
}

// Upload file solver trigger (Mock Visual OCR endpoint)
async function uploadVisualFile(type) {
  const fileInput = type === 'image' ? document.getElementById('solverImageFile') : document.getElementById('solverPdfFile');
  const file = fileInput.files[0];
  if (!file) return;

  appendMessage('solverLog', 'user', `Uploaded file: ${file.name}`);
  appendMessage('solverLog', 'bot', `Reading ${type} schema coordinates and extracting OCR data...`);
  
  const messages = document.querySelectorAll('#solverLog .chat-message.bot');
  const typingMsg = messages[messages.length - 1];

  const fd = new FormData();
  fd.append(type, file);

  const endpoint = type === 'image' ? '/api/image-question' : '/api/pdf-question';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: fd
    });
    const result = await response.json();
    if (result.success) {
      typingMsg.innerHTML = `<p>${result.solution.replace(/\n/g, '<br>')}</p>`;
    } else {
      typingMsg.innerHTML = `<p>Failed to scan file. Check size constraints.</p>`;
    }
  } catch (e) {
    typingMsg.innerHTML = `<p>Failed to connect to local visual resolver.</p>`;
  }
}

// Study Planner form submit
async function generateAIStudyPlan() {
  const className = document.getElementById('planClass').value.trim();
  const focusSubjects = document.getElementById('planSubjects').value.trim();
  const hours = document.getElementById('planHours').value;

  if (!className || !focusSubjects) {
    alert('Please enter Class and focus subjects');
    return;
  }

  const log = document.getElementById('plannerLog');
  log.style.display = 'block';
  log.innerHTML = '';
  
  appendMessage('plannerLog', 'bot', 'Creating optimized daily study schedule...');

  try {
    const response = await fetch('/api/study-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ className, focusSubjects, hoursPerDay: hours })
    });
    const result = await response.json();
    
    const messages = document.querySelectorAll('#plannerLog .chat-message.bot');
    const typingMsg = messages[messages.length - 1];

    if (result.success) {
      typingMsg.innerHTML = `<p>${result.plan.replace(/\n/g, '<br>')}</p>`;
    } else {
      typingMsg.innerHTML = `<p>Failed to compile study timetable.</p>`;
    }
  } catch (e) {
    log.innerHTML = `<p style="color:red">Failed to connect to planner server.</p>`;
  }
}
