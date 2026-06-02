/* ==========================================================================
   Sankalp Digital Pathshala - Admin Dashboard & CRM Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Check if we are on Login page
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
    return;
  }

  // Check if we are on Dashboard analytics overview page
  const analyticsContainer = document.getElementById('adminDashboardAnalytics');
  if (analyticsContainer) {
    loadDashboardMetrics();
  }

  // Load CRM lists where relevant
  if (document.getElementById('crmInquiryList')) {
    loadCrmInquiries();
  }
  if (document.getElementById('crmAILeadsList')) {
    loadCrmAILeads();
  }

  // Load item managers (programs, gallery, etc.)
  if (document.getElementById('adminProgramManager')) {
    loadProgramManagerList();
  }
  if (document.getElementById('adminGalleryManager')) {
    loadGalleryManagerList();
  }
  if (document.getElementById('adminEventsManager')) {
    loadEventsManagerList();
  }
  if (document.getElementById('adminResultsManager')) {
    loadResultsManagerList();
  }
});

// Admin Logins
async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const messageBox = document.getElementById('loginMessageBox');

  if (!email || !password) {
    showLoginMsg('Please enter email and password', 'error');
    return;
  }

  showLoginMsg('Verifying credentials...', 'loading');

  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();

    if (result.success) {
      showLoginMsg(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 1000);
    } else {
      showLoginMsg(result.message, 'error');
    }
  } catch (err) {
    showLoginMsg('Server offline. Try standard default offline credentials.', 'error');
  }
}

function showLoginMsg(text, status) {
  const box = document.getElementById('loginMessageBox');
  if (!box) return;
  box.style.display = 'block';
  box.textContent = text;
  box.className = `message-box ${status}`;
}

// Logouts
async function handleAdminLogout() {
  try {
    const response = await fetch('/api/admin/logout', { method: 'POST' });
    const result = await response.json();
    if (result.success) {
      window.location.href = '/admin';
    }
  } catch (e) {
    window.location.href = '/admin';
  }
}

// Analytics Metrics Loader
async function loadDashboardMetrics() {
  try {
    const response = await fetch('/api/admin/dashboard');
    const result = await response.json();

    if (result.success && result.data) {
      const counters = result.data.counters;
      
      // Update counters
      document.getElementById('metricTotalInquiries').textContent = counters.totalInquiries;
      document.getElementById('metricAILeads').textContent = counters.totalAILeads;
      document.getElementById('metricAIQuestions').textContent = counters.totalAIQuestionsLogged;
      document.getElementById('metricPrograms').textContent = counters.totalProgramsPublished;

      // Populate recent tables
      populateRecentInquiries(result.data.recentInquiries);
      populateRecentAILeads(result.data.recentAILeads);
    }
  } catch (err) {
    console.error('Failed to load dashboard metrics:', err);
  }
}

function populateRecentInquiries(list) {
  const container = document.getElementById('recentInquiriesTableBody');
  if (!container) return;
  if (!list || list.length === 0) {
    container.innerHTML = `<tr><td colspan="5" style="text-align:center">No recent inquiries</td></tr>`;
    return;
  }
  container.innerHTML = list.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.phone}</td>
      <td>${item.course}</td>
      <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
      <td>${new Date(item.createdAt).toLocaleDateString()}</td>
    </tr>
  `).join('');
}

function populateRecentAILeads(list) {
  const container = document.getElementById('recentAILeadsTableBody');
  if (!container) return;
  if (!list || list.length === 0) {
    container.innerHTML = `<tr><td colspan="4" style="text-align:center">No recent AI leads logged</td></tr>`;
    return;
  }
  container.innerHTML = list.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.course || 'AI Chat interaction'}</td>
      <td><span class="score-badge ${getScoreClass(item.leadScore)}">${item.leadScore}</span></td>
      <td>${new Date(item.createdAt).toLocaleDateString()}</td>
    </tr>
  `).join('');
}

function getScoreClass(score) {
  if (score >= 80) return 'hot';
  if (score >= 50) return 'warm';
  return 'cold';
}

// ----------------------------------------------------
// CRM PAGES POPULATORS
// ----------------------------------------------------
async function loadCrmInquiries() {
  const container = document.getElementById('crmInquiryList');
  try {
    const response = await fetch('/api/admin/inquiries');
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(item => `
        <div class="crm-lead-card">
          <div class="card-lead-header">
            <h4>${item.name}</h4>
            <span class="status-badge ${item.status.toLowerCase()}">${item.status}</span>
          </div>
          <div class="card-lead-details">
            <p><strong>Phone:</strong> ${item.phone}</p>
            <p><strong>Email:</strong> ${item.email || 'N/A'}</p>
            <p><strong>Course:</strong> ${item.course}</p>
            <p><strong>Message:</strong> ${item.message || 'No additional note'}</p>
            <p><strong>Date:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <div class="card-lead-actions">
            <button onclick="updateInquiryStatus('${item._id}', 'Contacted')" class="btn btn-secondary btn-sm">Mark Contacted</button>
            <button onclick="updateInquiryStatus('${item._id}', 'Enrolled')" class="btn btn-primary btn-sm">Mark Enrolled</button>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<div style="text-align:center; padding:3rem; color:var(--text-muted)">No general inquiries registered yet.</div>';
    }
  } catch (e) {
    container.innerHTML = '<div style="color:red; text-align:center">Failed to contact server API.</div>';
  }
}

async function updateInquiryStatus(id, status) {
  try {
    const response = await fetch('/api/admin/inquiries/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    const result = await response.json();
    if (result.success) {
      loadCrmInquiries();
      // If we have overview analytics, refresh
      if (document.getElementById('metricTotalInquiries')) loadDashboardMetrics();
    }
  } catch (err) {
    alert('Failed to update inquiry status');
  }
}

async function loadCrmAILeads() {
  const container = document.getElementById('crmAILeadsList');
  try {
    const response = await fetch('/api/admin/leads');
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(item => `
        <div class="crm-lead-card">
          <div class="card-lead-header">
            <h4>${item.name}</h4>
            <span class="score-badge ${getScoreClass(item.leadScore)}">AI Score: ${item.leadScore}</span>
          </div>
          <div class="card-lead-details">
            <p><strong>Phone:</strong> ${item.phone}</p>
            <p><strong>Analysis:</strong> ${item.aiAnalysis}</p>
            <p><strong>Date:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<div style="text-align:center; padding:3rem; color:var(--text-muted)">No AI leads analyzed yet.</div>';
    }
  } catch (e) {
    container.innerHTML = '<div style="color:red; text-align:center">Failed to fetch AI leads.</div>';
  }
}

// ----------------------------------------------------
// CRUD MANAGERS
// ----------------------------------------------------
async function deleteCrudItem(route, id, reloadCallback) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  try {
    const response = await fetch(`/api/admin/${route}/${id}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) {
      reloadCallback();
    } else {
      alert('Delete failed: ' + result.message);
    }
  } catch (e) {
    alert('Could not connect to API to delete item');
  }
}

// 1. Program Course Manager
async function loadProgramManagerList() {
  const listDiv = document.getElementById('adminProgramManager');
  try {
    const response = await fetch('/api/admin/programs');
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      listDiv.innerHTML = result.data.map(item => `
        <div class="crud-list-item">
          <div>
            <strong>${item.title}</strong> (${item.category})
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0">${item.fees} - ${item.duration}</p>
          </div>
          <button onclick="deleteCrudItem('programs', '${item._id}', loadProgramManagerList)" class="btn btn-secondary btn-sm" style="border-color:red; color:red"><i class="fas fa-trash"></i></button>
        </div>
      `).join('');
    } else {
      listDiv.innerHTML = '<p style="color:var(--text-muted)">No courses registered.</p>';
    }
  } catch (e) {}
}

document.getElementById('newProgramForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('progTitle').value.trim();
  const category = document.getElementById('progCategory').value;
  const description = document.getElementById('progDesc').value.trim();
  const duration = document.getElementById('progDuration').value.trim();
  const fees = document.getElementById('progFees').value.trim();

  try {
    const response = await fetch('/api/admin/programs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, description, duration, fees })
    });
    const result = await response.json();
    if (result.success) {
      e.target.reset();
      loadProgramManagerList();
    }
  } catch (err) {}
});

// 2. Gallery Manager
async function loadGalleryManagerList() {
  const listDiv = document.getElementById('adminGalleryManager');
  try {
    const response = await fetch('/api/admin/gallery');
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      listDiv.innerHTML = result.data.map(item => `
        <div class="crud-list-item">
          <div style="display:flex; align-items:center; gap:1rem">
            <img src="${item.imageUrl}" style="width:50px; height:50px; object-fit:cover; border-radius:8px">
            <div>
              <strong>${item.title}</strong>
              <p style="font-size:0.85rem; color:var(--text-muted); margin:0">${item.category}</p>
            </div>
          </div>
          <button onclick="deleteCrudItem('gallery', '${item._id}', loadGalleryManagerList)" class="btn btn-secondary btn-sm" style="border-color:red; color:red"><i class="fas fa-trash"></i></button>
        </div>
      `).join('');
    } else {
      listDiv.innerHTML = '<p style="color:var(--text-muted)">No images uploaded.</p>';
    }
  } catch (e) {}
}

document.getElementById('newGalleryForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  try {
    const response = await fetch('/api/admin/gallery', {
      method: 'POST',
      body: fd
    });
    const result = await response.json();
    if (result.success) {
      e.target.reset();
      loadGalleryManagerList();
    }
  } catch (err) {}
});

// 3. Events Manager
async function loadEventsManagerList() {
  const listDiv = document.getElementById('adminEventsManager');
  try {
    const response = await fetch('/api/admin/events');
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      listDiv.innerHTML = result.data.map(item => `
        <div class="crud-list-item">
          <div>
            <strong>${item.title}</strong>
            <p style="font-size:0.85rem; color:var(--text-muted); margin:0">${item.date} at ${item.venue}</p>
          </div>
          <button onclick="deleteCrudItem('events', '${item._id}', loadEventsManagerList)" class="btn btn-secondary btn-sm" style="border-color:red; color:red"><i class="fas fa-trash"></i></button>
        </div>
      `).join('');
    } else {
      listDiv.innerHTML = '<p style="color:var(--text-muted)">No scheduled events.</p>';
    }
  } catch (e) {}
}

document.getElementById('newEventForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('evtTitle').value.trim();
  const date = document.getElementById('evtDate').value.trim();
  const venue = document.getElementById('evtVenue').value.trim();
  const description = document.getElementById('evtDesc').value.trim();

  try {
    const response = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date, venue, description })
    });
    const result = await response.json();
    if (result.success) {
      e.target.reset();
      loadEventsManagerList();
    }
  } catch (err) {}
});

// 4. Results Topper Manager
async function loadResultsManagerList() {
  const listDiv = document.getElementById('adminResultsManager');
  try {
    const response = await fetch('/api/admin/results');
    const result = await response.json();
    if (result.success && result.data.length > 0) {
      listDiv.innerHTML = result.data.map(item => `
        <div class="crud-list-item">
          <div>
            <strong>${item.studentName}</strong> - ${item.examName} (${item.score})
          </div>
          <button onclick="deleteCrudItem('results', '${item._id}', loadResultsManagerList)" class="btn btn-secondary btn-sm" style="border-color:red; color:red"><i class="fas fa-trash"></i></button>
        </div>
      `).join('');
    } else {
      listDiv.innerHTML = '<p style="color:var(--text-muted)">No toppers registered.</p>';
    }
  } catch (e) {}
}

document.getElementById('newResultsForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  try {
    const response = await fetch('/api/admin/results', {
      method: 'POST',
      body: fd
    });
    const result = await response.json();
    if (result.success) {
      e.target.reset();
      loadResultsManagerList();
    }
  } catch (err) {}
});
