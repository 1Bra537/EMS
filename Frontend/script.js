'use strict';
//WORKOS — script.js
// State
let currentRole  = 'employee'; // employee | manager | hr
let currentPortal = null;      // active screen id
let currentUserId = null;      // logged-in user ID (set after login/signup)
let currentCompanyId = null;   // currently selected company ID in mgr/hr panel

let pendingFireTarget   = { name: '', companyID: '', empId: '', rowEl: null };
let pendingQuitTarget   = { company: '', companyID: '' };
let pendingStatusTarget = { id: '', name: '', rowEl: null };

// --- RESUME API FUNCTIONS ---
async function createResume(specialitiesId, workRecordId) {
  const specialities = document.getElementById(specialitiesId)?.value?.trim();
  const workRecord   = document.getElementById(workRecordId)?.value?.trim();

  if (!specialities || !workRecord) {
    showToast('Missing fields', 'Please fill in both Specialities and Work Record.', 'danger');
    return;
  }

  const userId = currentUserId ?? 1;
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
      showToast('Failed', `Server error: ${res.status}`, 'danger');
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
      setTimeout(() => {
        goScreen(portal);
        resetPortalStep(portal);
        if (currentRole === 'manager' || currentRole === 'hr') {
          loadCompanyTabs();
        }
        if (currentRole === 'employee') {
          loadCompanyList();
          loadEmployeeJobs();
        }
      }, 600);
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
      setTimeout(() => {
        goScreen(portal);
        resetPortalStep(portal);
        if (currentRole === 'manager' || currentRole === 'hr') {
          loadCompanyTabs();
        }
        if (currentRole === 'employee') {
          loadCompanyList();
          loadEmployeeJobs();
        }
      }, 600);
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
    currentCompanyId = null;
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
    
    // Auto-reload data when switching tabs
    if (step === 'emp-enrolled') {
      loadEmployeeJobs();
    }
    if (step === 'emp-companies') {
      loadCompanyList();
    }
    if (step === 'mgr-companies' || step === 'hr-companies') {
      loadCompanyTabs();
    }
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

// ──────────────────────────────────────────────────────────────────────────────
// COMPANY LIST — load from backend for employees to browse
// ──────────────────────────────────────────────────────────────────────────────
async function loadCompanyList() {
  try {
    const res = await fetch('http://localhost:8080/companies');
    if (!res.ok) return;
    const companies = await res.json();
    renderEmployeeCompanyList(companies);
  } catch (e) {
    console.error('Could not load companies', e);
  }
}

function renderEmployeeCompanyList(companies) {
  const list = document.getElementById('empCompanyList');
  if (!list) return;
  if (!companies || companies.length === 0) {
    list.innerHTML = '<p class="muted-sm">No companies found.</p>';
    return;
  }
  list.innerHTML = companies.map(c => {
    const initials = (c.name || 'CO').substring(0, 2).toUpperCase();
    return `
      <div class="company-card" data-name="${c.name || ''}">
        <div class="cc-logo">${initials}</div>
        <div class="cc-info">
          <h3>${c.name || 'Unknown'}</h3>
          <p>${c.description || ''}</p>
        </div>
        <button class="portal-btn primary sm" onclick="openCompanyRoles('${(c.name||'').replace(/'/g,"\\'")}','${c.id}')">
          <i class="ti ti-briefcase"></i> View Roles
        </button>
      </div>
    `;
  }).join('');
}

// Company search
document.getElementById('empCompSearch').addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  qsa('#empCompanyList .company-card').forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.classList.toggle('hidden', q.length > 0 && !name.includes(q));
  });
});

async function openCompanyRoles(companyName, companyID) {
  const panel = document.getElementById('empRolesPanel');
  document.getElementById('rolesPanelTitle').textContent = `Roles at ${companyName}`;
  const list = document.getElementById('empRolesList');
  
  try {
    const res = await fetch(`http://localhost:8080/${companyID}/roles`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const roles = await res.json();
    
    list.innerHTML = roles.length === 0
      ? '<p class="muted-sm">No roles listed for this company yet.</p>'
      : roles.map(r => `
      <div class="role-row">
        <div class="role-row-info">
          <h4>${r.roleName || 'Role'}</h4>
          <p>${r.description || ''} · ${r.duration || ''} · ${r.payFreq || ''}</p>
        </div>
        <div class="role-row-salary">${r.currency || '$'}${r.salaryAmount?.toLocaleString() ?? '0'}</div>
        <div class="role-row-chips">
          <span class="role-chip">${r.currency || '$'}${r.bonus?.toLocaleString() ?? '0'} bonus</span>
          <span class="role-chip">${r.benefits || ''}</span>
        </div>
        <button class="portal-btn primary sm"
          onclick="enrollInRole('${companyName.replace(/'/g,"\\'")}','${companyID}','${(r.roleName || '').replace(/'/g,"\\'")}')">
          <i class="ti ti-user-plus"></i> Enroll
        </button>
      </div>
    `).join('');
  } catch (e) {
    console.error('Could not load company roles', e);
    list.innerHTML = '<p class="muted-sm">Failed to load roles from server.</p>';
  }
  
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
    if (res.ok) {
      showToast('Enrolled', `Enrolled as ${role} at ${company}.`, 'success');
      loadEmployeeJobs();
    }
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

// ──────────────────────────────────────────────────────────────────────────────
// COMPANY TABS — load dynamically for Manager & HR portals
// ──────────────────────────────────────────────────────────────────────────────
async function loadCompanyTabs() {
  const userId = currentUserId ?? 1;
  const url = currentRole === 'manager' || currentRole === 'hr'
    ? `http://localhost:8080/User/director/${userId}/companies`
    : `http://localhost:8080/companies`;
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const companies = await res.json();
    renderCompanyTabs(companies);
  } catch (e) {
    console.error('Could not load company tabs', e);
  }
}

function renderCompanyTabs(companies) {
  const isManager = currentRole === 'manager';
  const mgrTabsEl = document.getElementById('mgrCompanyTabs');
  const hrTabsEl  = document.getElementById('hrCompanyTabs');

  const makeTab = (c, selectFn) => {
    const initials = (c.name || 'CO').substring(0, 2).toUpperCase();
    const btn = document.createElement('button');
    btn.className = 'ctab';
    btn.dataset.company = c.name;
    btn.dataset.id = c.id;
    btn.innerHTML = `<span class="ctab-init">${initials}</span><span>${c.name}</span>`;
    btn.addEventListener('click', () => selectFn(btn));
    return btn;
  };

  if (mgrTabsEl && companies.length > 0) {
    mgrTabsEl.innerHTML = '';
    companies.forEach(c => mgrTabsEl.appendChild(makeTab(c, selectMgrCompany)));
    // auto-select first
    selectMgrCompany(mgrTabsEl.querySelector('.ctab'));
  } else if (mgrTabsEl) {
    mgrTabsEl.innerHTML = '<p class="muted-sm">No companies found.</p>';
  }

  if (hrTabsEl && companies.length > 0) {
    hrTabsEl.innerHTML = '';
    companies.forEach(c => hrTabsEl.appendChild(makeTab(c, selectHRCompany)));
    selectHRCompany(hrTabsEl.querySelector('.ctab'));
  } else if (hrTabsEl) {
    hrTabsEl.innerHTML = '<p class="muted-sm">No companies found.</p>';
  }
}

// MANAGER — COMPANY TABS
function selectMgrCompany(btn) {
  qsa('#mgr-companies .ctab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('mgrSelectedCompany').textContent = btn.dataset.company;
  document.getElementById('mgrCompanyID').textContent = `companyID: ${btn.dataset.id}`;
  currentCompanyId = btn.dataset.id;
  // Reset to Employees sub-tab
  openSubTab(document.querySelector('#mgr-companies .sub-tab'), 'mgr-employees-tab');
  loadCompanyData(btn.dataset.id, 'mgr');
}

//  HR — COMPANY TABS
function selectHRCompany(btn) {
  qsa('#hr-companies .ctab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('hrSelectedCompany').textContent = btn.dataset.company;
  document.getElementById('hrCompanyID').textContent = `companyID: ${btn.dataset.id}`;
  currentCompanyId = btn.dataset.id;
  openSubTab(document.querySelector('#hr-companies .sub-tab'), 'hr-employees-tab');
  loadCompanyData(btn.dataset.id, 'hr');
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

// ──────────────────────────────────────────────────────────────────────────────
// LOAD COMPANY DATA (employees + applicants)
// ──────────────────────────────────────────────────────────────────────────────
async function loadCompanyData(companyId, prefix) {
  if (!companyId) return;
  const userId = currentUserId ?? 1;
  try {
    const [empRes, appRes] = await Promise.all([
      fetch(`http://localhost:8080/User/director/${userId}/company/${companyId}/employees`),
      fetch(`http://localhost:8080/User/director/${userId}/company/${companyId}/applicants`)
    ]);

    if (empRes.ok) {
      const employees = await empRes.json();
      renderEmployeesTable(employees, companyId, prefix);
    } else if (empRes.status === 403) {
      console.warn('Access denied: not your company');
    }

    if (appRes.ok) {
      const appData = await appRes.json();
      const applicants = appData.applicants ?? appData;
      renderApplicantsTable(applicants, companyId, prefix);
    } else if (appRes.status === 403) {
      console.warn('Access denied: not your company');
    }
  } catch (e) {
    console.error('Could not load company data', e);
  }
}

// Refresh shortcut called by the Refresh button in templates
function refreshCurrentCompanyData() {
  const prefix = currentRole === 'hr' ? 'hr' : 'mgr';
  if (currentCompanyId) {
    loadCompanyData(currentCompanyId, prefix);
  } else {
    showToast('No company selected', 'Please select a company first.', 'danger');
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// RENDER EMPLOYEES TABLE
// ──────────────────────────────────────────────────────────────────────────────
function renderEmployeesTable(employees, companyId, prefix) {
  const tbodyId = prefix === 'mgr' ? 'mgrEmployeesBody' : 'hrEmployeesBody';
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  if (!employees || employees.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--t3);padding:24px">No employees yet</td></tr>`;
    return;
  }

  tbody.innerHTML = employees.map(emp => {
    const statusClass = statusBadgeClass(emp.status);
    const actionsHtml = prefix === 'mgr'
      ? `<button class="portal-btn outline sm" onclick="openChangeStatus('${emp.id}','${(emp.name||'').replace(/'/g,"\\'")}', this.closest('tr'))">
           <i class="ti ti-arrows-exchange"></i> Status
         </button>
         <button class="portal-btn danger sm" onclick="confirmFire('${(emp.name||'').replace(/'/g,"\\'")}','${companyId}','${emp.id}', this.closest('tr'))">
           <i class="ti ti-user-minus"></i> Fire
         </button>`
      : `<button class="portal-btn outline sm" onclick="openChangeStatus('${emp.id}','${(emp.name||'').replace(/'/g,"\\'")}', this.closest('tr'))">
           <i class="ti ti-arrows-exchange"></i> Status
         </button>`;

    return `<tr data-emp-id="${emp.id}">
      <td><strong>${emp.name || 'Unknown'}</strong></td>
      <td class="mono" style="font-size:12px">${emp.specialties || '—'}</td>
      <td><span class="status-badge ${statusClass}">${emp.status || 'Active'}</span></td>
      <td class="table-actions">${actionsHtml}</td>
    </tr>`;
  }).join('');
}

function statusBadgeClass(status) {
  const map = {
    'active':     'badge-active',
    'on leave':   'badge-leave',
    'suspended':  'badge-suspended',
    'probation':  'badge-probation',
    'terminated': 'badge-terminated',
    'manager':    'badge-manager',
    'hr manager': 'badge-manager',
    'director':   'badge-manager',
  };
  return map[(status || '').toLowerCase()] || 'badge-active';
}

// ──────────────────────────────────────────────────────────────────────────────
// RENDER APPLICANTS TABLE
// ──────────────────────────────────────────────────────────────────────────────
function renderApplicantsTable(applicants, companyId, prefix) {
  const tbodyId = prefix === 'mgr' ? 'mgrApplicantsBody' : 'hrApplicantsBody';
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;

  if (!applicants || applicants.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--t3);padding:24px">No applicants yet</td></tr>`;
    return;
  }

  tbody.innerHTML = applicants.map(app => {
    const hireBtn = prefix === 'mgr'
      ? `<button class="portal-btn primary sm" onclick="hireApplicant('${app.id}','${companyId}','${(app.employeeName||'').replace(/'/g,"\\'")}', this.closest('tr'))">
           <i class="ti ti-user-check"></i> Hire
         </button>`
      : `<span class="muted-sm">—</span>`;

    return `<tr data-app-id="${app.id}">
      <td><strong>${app.employeeName || 'Unknown'}</strong></td>
      <td>$${app.pricingBid?.toLocaleString() ?? '—'}</td>
      <td>
        <button class="portal-btn outline sm" onclick="viewResume('${app.id}')">
          <i class="ti ti-file-description"></i> View
        </button>
      </td>
      <td class="table-actions">${hireBtn}</td>
    </tr>`;
  }).join('');
}

// ──────────────────────────────────────────────────────────────────────────────
// HIRE EMPLOYEE — called from applicants table
// ──────────────────────────────────────────────────────────────────────────────
async function hireApplicant(empId, companyId, empName, rowEl) {
  const userId = currentUserId ?? 1;
  try {
    const res = await fetch(`http://localhost:8080/User/director/${userId}/company/${companyId}/hire/${empId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      showToast('Hired!', `${empName} has been hired and is now Active.`, 'success');
      const prefix = currentRole === 'hr' ? 'hr' : 'mgr';
      loadCompanyData(companyId, prefix);
    } else if (res.status === 403 || (await res.json?.())?.serverStatus === 'forbidden') {
      showToast('Access Denied', 'You do not own this company.', 'danger');
    } else {
      showToast('Hire failed', `Server error: ${res.status}`, 'danger');
    }
  } catch (e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// CHANGE STATUS — modal + API + DOM update
// ──────────────────────────────────────────────────────────────────────────────
function openChangeStatus(empId, empName, rowEl) {
  pendingStatusTarget = { id: empId, name: empName, rowEl };
  document.getElementById('statusTargetName').textContent = empName;
  show('modal-status');
}

async function submitChangeStatus() {
  const status = document.getElementById('statusSelect').value;
  const userId = currentUserId ?? 1;
  try {
    const res = await fetch(`http://localhost:8080/User/director/${userId}/changeStatus/${pendingStatusTarget.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.serverStatus === 'forbidden') {
        showToast('Access Denied', 'This employee is not in your company.', 'danger');
      } else {
        showToast('Status updated', `${pendingStatusTarget.name}'s status changed to "${status}".`, 'success');
        const prefix = currentRole === 'hr' ? 'hr' : 'mgr';
        if (currentCompanyId) {
          loadCompanyData(currentCompanyId, prefix);
        }
      }
    } else {
      showToast('Failed', `Server error: ${res.status}`, 'danger');
    }
  } catch (e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
  closeModal('modal-status');
}

// ──────────────────────────────────────────────────────────────────────────────
// FIRE EMPLOYEE — modal + API + DOM removal
// ──────────────────────────────────────────────────────────────────────────────
function confirmFire(name, companyID, empId, rowEl) {
  pendingFireTarget = { name, companyID, empId, rowEl };
  document.getElementById('fireTargetName').textContent = name;
  show('modal-fire');
}

async function submitFire() {
  const userId = currentUserId ?? 1;
  try {
    const res = await fetch(`http://localhost:8080/User/director/${userId}/company/${pendingFireTarget.companyID}/fire/${pendingFireTarget.empId}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      const data = await res.json();
      if (data.serverStatus === 'failed') {
        showToast('Access Denied', 'You do not own this company or employee not found.', 'danger');
      } else {
        showToast('Fired', `${pendingFireTarget.name} has been removed from the company.`, 'success');
        const prefix = currentRole === 'hr' ? 'hr' : 'mgr';
        loadCompanyData(pendingFireTarget.companyID, prefix);
      }
    } else {
      showToast('Failed', `Could not fire employee. Server error: ${res.status}`, 'danger');
    }
  } catch (e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
  closeModal('modal-fire');
}

// ──────────────────────────────────────────────────────────────────────────────
// QUIT JOB (Employee)
// ──────────────────────────────────────────────────────────────────────────────
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
    if (res.ok) {
      showToast('Quit Job', `You have left ${pendingQuitTarget.company}.`, 'success');
      loadEmployeeJobs();
    }
  } catch(e) { console.error(e); }
  closeModal('modal-quit');
}

// ──────────────────────────────────────────────────────────────────────────────
// VIEW RESUME
// ──────────────────────────────────────────────────────────────────────────────
async function viewResume(employeeId) {
  try {
    const res = await fetch(`http://localhost:8080/User/resume/${employeeId}`);
    if (res.ok) {
      const specialties = await res.text();
      showToast('Resume', specialties || 'No specialities listed.', 'info');
    } else {
      showToast('No Resume', 'No resume found for this applicant.', 'info');
    }
  } catch(e) { console.error(e); }
}

// ──────────────────────────────────────────────────────────────────────────────
// MANAGER — Business & Offer creation
// ──────────────────────────────────────────────────────────────────────────────
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
    if (res.ok) {
      showToast('Success', 'Business created successfully.', 'success');
      // Reload company tabs to include the new company
      loadCompanyTabs();
    } else {
      showToast('Failed', `Server error: ${res.status}`, 'danger');
    }
  } catch(e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
}

async function createOffer() {
  const userId = currentUserId ?? 1;
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
    const res = await fetch(`http://localhost:8080/User/director/${userId}/company/${companyID}/createoffer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer)
    });
    if (res.ok) {
      const text = await res.text();
      if (text.includes('Access denied')) {
        showToast('Access Denied', 'You do not own this company.', 'danger');
      } else {
        showToast('Success', 'Job offer created successfully.', 'success');
      }
    } else {
      showToast('Failed', `Server error: ${res.status}`, 'danger');
    }
  } catch(e) {
    showToast('Connection Error', 'Make sure the backend is running on port 8080.', 'danger');
    console.error(e);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// MODALS
// ──────────────────────────────────────────────────────────────────────────────
function closeModal(id) { hide(id); }

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

// GENERIC ACTION HANDLER (kept for any remaining usages)
async function handleAction(endpoint, message) {
  const parts = endpoint.split(' ');
  const method = parts.length > 1 ? parts[0] : 'POST';
  let url = parts.length > 1 ? parts[1] : parts[0];

  url = url.replace(/^\/user\//i, '/User/');
  const finalUrl = `http://localhost:8080${url.replace(/{[^}]+}/g, currentCompanyId || '1')}`; 

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

// ──────────────────────────────────────────────────────────────────────────────
// TOAST
// ──────────────────────────────────────────────────────────────────────────────
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

// DYNAMIC EMPLOYEE JOBS (ACTIVE & PENDING)
async function loadEmployeeJobs() {
  const userId = currentUserId ?? 1;
  const list = document.getElementById('empEnrolledList');
  if (!list) return;

  try {
    const res = await fetch(`http://localhost:8080/User/employee/${userId}/jobs`);
    if (!res.ok) {
      list.innerHTML = '<p class="muted-sm">Failed to load jobs.</p>';
      return;
    }
    const jobs = await res.json();
    renderEmployeeJobs(jobs);
  } catch (e) {
    console.error('Could not load employee jobs', e);
    list.innerHTML = '<p class="muted-sm">Connection error. Make sure the backend is running.</p>';
  }
}

function renderEmployeeJobs(jobs) {
  const list = document.getElementById('empEnrolledList');
  if (!list) return;

  if (!jobs || jobs.length === 0) {
    list.innerHTML = '<p class="muted-sm" style="text-align:center;padding:32px;">You are not enrolled in any jobs yet. Browse companies to apply!</p>';
    return;
  }

  list.innerHTML = jobs.map(job => {
    const initials = (job.companyName || 'CO').substring(0, 2).toUpperCase();
    const isPending = job.status.toLowerCase() === 'pending';
    
    const statusClass = isPending ? 'badge-suspended' : 'badge-active';
    const statusLabel = isPending ? 'Pending Approval' : job.status;

    // Actions block: disabled/hidden for pending applications
    const actionsHtml = isPending
      ? `
        <div class="ec-actions" style="opacity: 0.6; pointer-events: none;">
          <div class="ec-action-group">
            <span class="ec-action-label">Attendance (Unavailable while pending)</span>
            <div class="clock-row">
              <input type="time" value="08:00" class="time-input" disabled/>
              <input type="time" value="17:00" class="time-input" disabled/>
              <button class="portal-btn sm" disabled>Set</button>
            </div>
          </div>
        </div>
      `
      : `
        <div class="ec-actions">
          <div class="ec-action-group">
            <span class="ec-action-label">Attendance</span>
            <div class="clock-row">
              <div class="clock-input-wrap">
                <label>Clock in</label>
                <input type="time" value="08:00" class="time-input"/>
              </div>
              <div class="clock-input-wrap">
                <label>Clock out</label>
                <input type="time" value="17:00" class="time-input"/>
              </div>
              <button class="portal-btn primary sm" onclick="setAttendance(this, '${job.companyId}')">
                <i class="ti ti-clock"></i> Set
              </button>
            </div>
          </div>

          <div class="ec-action-group">
            <span class="ec-action-label">People</span>
            <button class="portal-btn outline sm" onclick="handleAction('GET /user/director/company/{companyID}/employees','Loaded employee list for ${job.companyName.replace(/'/g,"\\\\'")}.')">
              <i class="ti ti-users"></i> View Employees
            </button>
          </div>

          <div class="ec-action-group danger-zone">
            <span class="ec-action-label">Danger zone</span>
            <button class="portal-btn danger sm" onclick="confirmQuit('${job.companyName.replace(/'/g,"\\\\'")}','${job.companyId}')">
              <i class="ti ti-door-exit"></i> Quit Job
            </button>
          </div>
        </div>
      `;

    return `
      <div class="enrolled-card">
        <div class="ec-top">
          <div class="cc-logo tc">${initials}</div>
          <div>
            <h3>${job.companyName}</h3>
            <span class="role-label">${job.role}</span>
          </div>
          <span class="status-badge ${statusClass}">${statusLabel}</span>
        </div>
        ${actionsHtml}
      </div>
    `;
  }).join('');
}

//  Init
goScreen('screen-auth');
console.log('[WorkOS] v4 loaded — Employee · Manager · HR Manager portals');