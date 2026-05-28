'use strict';
//WORKOS — script.js
// State
let currentRole  = 'employee'; // employee | manager | hr
let currentPortal = null;      // active screen id
let currentUserId = null;      // logged-in user ID (set after login/signup)

let pendingFireTarget   = { name: '', companyID: '' };
let pendingQuitTarget   = { company: '', companyID: '' };
let pendingStatusTarget = { id: '', name: '' };

// --- RESUME API FUNCTIONS ---
async function createResume(specialitiesId, workRecordId) {
  const specialities = document.getElementById(specialitiesId)?.value?.trim();
  const workRecord   = document.getElementById(workRecordId)?.value?.trim();

  if (!specialities || !workRecord) {
    showToast('Missing fields', 'Please fill in both Specialities and Work Record.', 'danger');
    return;
  }

  const userId = currentUserId ?? 1; // default to 1 if not tracked yet
  const url = `http://localhost:8080/User/${userId}/createResume`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialities, workRecord, status: currentRole })
    });
    if (res.ok) {
      showToast('Resume created', 'Your resume was saved successfully.', 'success');
      document.getElementById(specialitiesId).value = '';
      document.getElementById(workRecordId).value = '';
    } else {
      const err = await res.text();
      showToast('Failed', `Server error: ${res.status}`, 'danger');
      console.error(err);
    }
  } catch (e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
}

async function updateResume(specialitiesId, workRecordId) {
  const specialities = document.getElementById(specialitiesId)?.value?.trim();
  const workRecord   = document.getElementById(workRecordId)?.value?.trim();

  if (!specialities || !workRecord) {
    showToast('Missing fields', 'Please fill in both Specialities and Work Record.', 'danger');
    return;
  }

  const userId = currentUserId ?? 1;
  const url = `http://localhost:8080/User/${userId}/updateresume`;

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialities, workRecord, status: currentRole })
    });
    if (res.ok) {
      showToast('Resume updated', 'Your resume was updated successfully.', 'success');
    } else {
      showToast('Failed', `Server error: ${res.status}`, 'danger');
    }
  } catch (e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
}

//  Helpers
function show(id)  { document.getElementById(id)?.classList.remove('hidden') }
function hide(id)  { document.getElementById(id)?.classList.add('hidden') }
function qs(sel)   { return document.querySelector(sel) }
function qsa(sel)  { return document.querySelectorAll(sel) }

//  Screen router 
function goScreen(id) {
  qsa('.screen').forEach(s => s.classList.remove('active'));
  const s = document.getElementById(id);
  if (s) s.classList.add('active');
  currentPortal = id;
}

// AUTH
// Tab toggle (Sign in , Sign up)
qsa('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    qsa('.auth-tab').forEach(t => t.classList.remove('active'));
    qsa('.auth-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`form-${tab.dataset.tab}`)?.classList.add('active');
  });
});

// Role selector
qsa('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    qsa('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRole = btn.dataset.role;
  });
});

// Login submit
document.getElementById('form-login').addEventListener('submit', e => {
  e.preventDefault();
  loginUser();
});

// Signup submit
document.getElementById('form-signup').addEventListener('submit', e => {
  e.preventDefault();
  signupUser();
});

async function loginUser() {
  const form = document.getElementById('form-login');
  const inputs = form.querySelectorAll('input');
  const email    = inputs[0].value.trim();
  const password = inputs[1].value.trim();

  if (!email || !password) {
    showToast('Missing fields', 'Please enter your email and password.', 'danger');
    return;
  }

  try {
    const res = await fetch('http://localhost:8080/User/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, status: currentRole })
    });
    const data = await res.json();

    if (res.ok && data.id) {
      currentUserId = data.id;
      const portal = roleToPortal(currentRole);
      showToast('Signed in', `Welcome back. Entering ${labelFor(currentRole)} portal.`, 'success');
      setTimeout(() => { goScreen(portal); resetPortalStep(portal); }, 600);
    } else {
      showToast('Login failed', 'Invalid email or password.', 'danger');
    }
  } catch (e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
}

async function signupUser() {
  const form = document.getElementById('form-signup');
  const inputs = form.querySelectorAll('input');
  const name     = inputs[0].value.trim();
  const age      = parseInt(inputs[1].value) || 0;
  const email    = inputs[2].value.trim();
  const password = inputs[3].value.trim();

  if (!name || !email || !password) {
    showToast('Missing fields', 'Please fill in all signup fields.', 'danger');
    return;
  }

  try {
    const res = await fetch('http://localhost:8080/User/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, age, status: currentRole })
    });
    const data = await res.json();

    if (res.ok && data.id) {
      currentUserId = data.id;
      const portal = roleToPortal(currentRole);
      showToast('Account created', `Welcome to WorkOS. Entering ${labelFor(currentRole)} portal.`, 'success');
      setTimeout(() => { goScreen(portal); resetPortalStep(portal); }, 600);
    } else {
      showToast('Signup failed', data.response ?? 'Could not create account.', 'danger');
    }
  } catch (e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
}

function roleToPortal(role) {
  return { employee: 'screen-employee', manager: 'screen-manager', hr: 'screen-hr' }[role];
}
function labelFor(role) {
  return { employee: 'Employee', manager: 'Manager', hr: 'HR Manager' }[role];
}

//  Logout buttons
document.getElementById('emp-logout').addEventListener('click', () => logout('emp'));
document.getElementById('mgr-logout').addEventListener('click', () => logout('mgr'));
document.getElementById('hr-logout').addEventListener('click',  () => logout('hr'));

async function logout(prefix) {
  const userId = currentUserId ?? 1;
  const endpoint = prefix === 'emp'
    ? `http://localhost:8080/User/employee/${userId}/logout`
    : `http://localhost:8080/User/director/${userId}/logout`;
  try {
    await fetch(endpoint, { method: 'DELETE' });
    showToast('Signed out', 'Logged out successfully', 'info');
    currentUserId = null;
    setTimeout(() => goScreen('screen-auth'), 700);
  } catch (e) { console.error(e); }
}

// PORTAL NAVIGATION (sidebar nav items)
qsa('.ps-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const portal = item.closest('.screen');
    portal.querySelectorAll('.ps-nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const step = item.dataset.step;
    portal.querySelectorAll('.portal-step').forEach(s => s.classList.remove('active'));
    document.getElementById(step)?.classList.add('active');
  });
});

function resetPortalStep(portalId) {
  const portal = document.getElementById(portalId);
  if (!portal) return;
  portal.querySelectorAll('.ps-nav-item').forEach((item, i) => {
    item.classList.toggle('active', i === 0);
  });
  portal.querySelectorAll('.portal-step').forEach((step, i) => {
    step.classList.toggle('active', i === 0);
  });
}

// EMPLOYEE — BROWSE COMPANIES
// Company search
document.getElementById('empCompSearch').addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  qsa('#empCompanyList .company-card').forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.classList.toggle('hidden', q.length > 0 && !name.includes(q));
  });
});

const ROLES_DATA = {
  '1': [ // TechCorp
    { title: 'Senior Software Engineer', desc: 'Full-stack development & architecture', salary: '$120,000', duration: '12 months', pay: 'Monthly', bonus: '$5,000', benefits: 'Health, Remote' },
    { title: 'DevOps Engineer',          desc: 'CI/CD pipelines, cloud infrastructure', salary: '$105,000', duration: '12 months', pay: 'Monthly', bonus: '$3,000', benefits: 'Health, Remote' },
  ],
  '2': [ // BizHub
    { title: 'Product Designer',  desc: 'UI/UX design across all products', salary: '$85,000', duration: '6 months', pay: 'Bi-weekly', bonus: '$2,000', benefits: 'Equity, Hybrid' },
    { title: 'Business Analyst',  desc: 'Process mapping and optimisation', salary: '$78,000', duration: '12 months', pay: 'Monthly',  bonus: '$1,500', benefits: 'Health' },
  ],
  '3': [ // FinGroup
    { title: 'Financial Analyst', desc: 'Investment advisory and reporting', salary: '$75,000', duration: '24 months', pay: 'Monthly', bonus: '$4,000', benefits: '401k, Dental' },
  ],
};

function openCompanyRoles(companyName, companyID) {
  const panel = document.getElementById('empRolesPanel');
  document.getElementById('rolesPanelTitle').textContent = `Roles at ${companyName}`;
  document.getElementById('rolesPanelEndpoint').textContent = `GET /company/${companyID}/roles`;
  const list = document.getElementById('empRolesList');
  const roles = ROLES_DATA[companyID] ?? [];
  list.innerHTML = roles.map(r => `
    <div class="role-row">
      <div class="role-row-info">
        <h4>${r.title}</h4>
        <p>${r.desc} · ${r.duration} · ${r.pay}</p>
      </div>
      <div class="role-row-salary">${r.salary}</div>
      <div class="role-row-chips">
        <span class="role-chip">${r.bonus} bonus</span>
        <span class="role-chip">${r.benefits}</span>
      </div>
      <button class="portal-btn primary sm"
        onclick="enrollInRole('${companyName}','${companyID}','${r.title}')">
        <i class="ti ti-user-plus"></i> Enroll
      </button>
    </div>
  `).join('');
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeRolesPanel() {
  document.getElementById('empRolesPanel').classList.add('hidden');
}

async function enrollInRole(company, companyID, role) {
  const userId = currentUserId ?? 1;
  const url = `http://localhost:8080/User/employee/${userId}/enroll/company/${companyID}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(1000) 
    });
    if (res.ok) showToast('Enrolled', `Enrolled as ${role} at ${company}.`, 'success');
  } catch(e) { console.error(e); }
}

async function setAttendance(btn, companyId) {
  const userId = currentUserId ?? 1;
  const row = btn.closest('.clock-row');
  const inputs = row.querySelectorAll('input');
  
  const clockInInt = parseInt(inputs[0].value.split(':')[0]) || 8;
  const clockOutInt = parseInt(inputs[1].value.split(':')[0]) || 17;

  try {
    await fetch(`http://localhost:8080/User/employee/${userId}/clockin`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clockInInt)
    });
    await fetch(`http://localhost:8080/User/employee/${userId}/clockout`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clockOutInt)
    });
    showToast('Attendance', 'Clock in and out set successfully.', 'success');
  } catch(e) { console.error(e); }
}

// MANAGER — COMPANY TABS
function selectMgrCompany(btn) {
  qsa('#mgr-companies .ctab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('mgrSelectedCompany').textContent = btn.dataset.company;
  document.getElementById('mgrCompanyID').textContent = `companyID: ${btn.dataset.id}`;
  // Reset to Employees sub-tab
  openSubTab(document.querySelector('#mgr-companies .sub-tab'), 'mgr-employees-tab');
}

//  HR — COMPANY TABS
function selectHRCompany(btn) {
  qsa('#hr-companies .ctab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('hrSelectedCompany').textContent = btn.dataset.company;
  document.getElementById('hrCompanyID').textContent = `companyID: ${btn.dataset.id}`;
  openSubTab(document.querySelector('#hr-companies .sub-tab'), 'hr-employees-tab');
}

//  Sub-tabs 
function openSubTab(clickedTab, panelId) {
  const container = clickedTab.closest('.portal-step') || clickedTab.closest('.mgr-company-panel');
  if (!container) return;
  container.querySelectorAll('.sub-tab').forEach(t => t.classList.remove('active'));
  container.querySelectorAll('.sub-tab-panel').forEach(p => p.classList.remove('active'));
  clickedTab.classList.add('active');
  document.getElementById(panelId)?.classList.add('active');
}

// Change Status
async function openChangeStatus(empId, empName) {
  pendingStatusTarget = { id: empId, name: empName };
  document.getElementById('statusTargetName').textContent = empName;
  show('modal-status');
}
async function submitChangeStatus() {
  const status = document.getElementById('statusSelect').value;
  try {
    const res = await fetch(`http://localhost:8080/User/director/changeStatus/${pendingStatusTarget.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: status
    });
    if (res.ok) showToast('Success', `${pendingStatusTarget.name}'s status changed to "${status}".`, 'success');
  } catch(e) { console.error(e); }
  closeModal('modal-status');
}

// Fire
function confirmFire(name, companyID, empId) {
  pendingFireTarget = { name, companyID, empId };
  document.getElementById('fireTargetName').textContent = name;
  show('modal-fire');
}
async function submitFire() {
  try {
    const res = await fetch(`http://localhost:8080/User/director/${pendingFireTarget.companyID}/fire/${pendingFireTarget.empId}`, {
      method: 'DELETE'
    });
    if (res.ok) showToast('Fired', `${pendingFireTarget.name} has been removed.`, 'success');
  } catch(e) { console.error(e); }
  closeModal('modal-fire');
}

// Quit
function confirmQuit(company, companyID) {
  pendingQuitTarget = { company, companyID };
  document.getElementById('quitTargetCompany').textContent = company;
  show('modal-quit');
}
async function submitQuit() {
  const userId = currentUserId ?? 1;
  try {
    const res = await fetch(`http://localhost:8080/User/employee/${userId}/quit/${pendingQuitTarget.companyID}`, {
      method: 'DELETE'
    });
    if (res.ok) showToast('Quit Job', `You have left ${pendingQuitTarget.company}.`, 'success');
  } catch(e) { console.error(e); }
  closeModal('modal-quit');
}

// Manager functions
async function createBusiness() {
  const userId = currentUserId ?? 1;
  const grid = document.querySelector('#mgr-create-biz .offer-form-grid');
  const inputs = grid.querySelectorAll('input, select, textarea');
  
  const business = {
    companyName: inputs[0].value || 'New Corp',
    creationDate: inputs[1].value || '2026-01-01',
    netWorth: parseInt(inputs[2].value) || 0,
    description: inputs[3].value || ''
  };

  try {
    const res = await fetch(`http://localhost:8080/User/director/manager/${userId}/company/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(business)
    });
    if (res.ok) showToast('Success', 'Business created successfully.', 'success');
  } catch(e) { console.error(e); }
}

async function createOffer() {
  const companyIDText = document.getElementById('mgrCompanyID').textContent;
  const companyID = companyIDText.replace('companyID:', '').trim() || '1';
  
  const grid = document.querySelector('#mgr-offer-tab .offer-form-grid');
  const inputs = grid.querySelectorAll('input, select, textarea');
  
  const offer = {
    roleName: inputs[0].value || 'Role',
    salary: parseInt(inputs[1].value) || 0,
    duration: inputs[2].value || '12 months',
    startDate: inputs[3].value || '2026-01-01',
    payFrequency: inputs[4].value || 'Monthly',
    currency: inputs[5].value || 'USD',
    bonus: parseInt(inputs[6].value) || 0,
    benefits: inputs[7].value || '',
    description: inputs[8].value || ''
  };

  try {
    const res = await fetch(`http://localhost:8080/User/director/manager/company/${companyID}/createoffer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer)
    });
    if (res.ok) showToast('Success', 'Job offer created successfully.', 'success');
  } catch(e) { console.error(e); }
}


function closeModal(id) { hide(id) }

// Close modal on backdrop click
qsa('.modal-backdrop').forEach(bd => {
  bd.addEventListener('click', e => {
    if (e.target === bd) bd.classList.add('hidden');
  });
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    qsa('.modal-backdrop').forEach(bd => bd.classList.add('hidden'));
  }
});

// GENERIC ACTION HANDLER
async function handleAction(endpoint, message) {
  const parts = endpoint.split(' ');
  const method = parts.length > 1 ? parts[0] : 'POST';
  let url = parts.length > 1 ? parts[1] : parts[0];

  url = url.replace(/^\/user\//i, '/User/');
  const finalUrl = `http://localhost:8080${url.replace(/{[^}]+}/g, '1')}`; 

  try {
    const response = await fetch(finalUrl, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: method !== 'GET' && method !== 'DELETE' ? JSON.stringify({}) : null
    });
    
    if (response.ok) {
      showToast(message, endpoint, 'success');
    } else {
      showToast('Action failed', `Server returned ${response.status}`, 'danger');
    }
  } catch (err) {
    showToast('Connection Error', 'Backend might not be running', 'danger');
    console.error(err);
  }
}

// TOAST
let toastTimer = null;

function showToast(title, message, type = 'success') {
  const toast    = document.getElementById('toast');
  const iconEl   = document.getElementById('toastIcon');
  const titleEl  = document.getElementById('toastTitle');
  const msgEl    = document.getElementById('toastMsg');

  const icons = { success: 'ti-check-circle', info: 'ti-info-circle', danger: 'ti-alert-circle' };
  const colors = { success: 'var(--emp)', info: 'var(--info)', danger: 'var(--danger)' };

  iconEl.className  = `ti ${icons[type] ?? icons.success}`;
  iconEl.style.color = colors[type] ?? colors.success;
  toast.style.borderLeftColor = colors[type] ?? colors.success;
  titleEl.textContent = title;
  msgEl.textContent   = message;

  toast.classList.remove('hidden');
  toast.style.animation = 'none';
  requestAnimationFrame(() => { toast.style.animation = 'slideInRight .25s ease both' });

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
}

//  Init
goScreen('screen-auth');
console.log('[WorkOS] v3 loaded — Employee · Manager · HR Manager portals');