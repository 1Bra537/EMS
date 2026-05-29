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
  const list = document.getElementById('empRolesList');
  const roles = ROLES_DATA[String(companyID)] ?? [];
  list.innerHTML = roles.length === 0
    ? '<p class="muted-sm">No roles listed for this company yet.</p>'
    : roles.map(r => `
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
        onclick="enrollInRole('${companyName.replace(/'/g,"\\'")}','${companyID}','${r.title.replace(/'/g,"\\'")}')">
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

// ──────────────────────────────────────────────────────────────────────────────
// COMPANY TABS — load dynamically for Manager & HR portals
// ──────────────────────────────────────────────────────────────────────────────
async function loadCompanyTabs() {
  try {
    const res = await fetch('http://localhost:8080/companies');
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
  try {
    const [empRes, appRes] = await Promise.all([
      fetch(`http://localhost:8080/User/director/company/${companyId}/employees`),
      fetch(`http://localhost:8080/Company/${companyId}/applicants`)
    ]);

    if (empRes.ok) {
      const employees = await empRes.json();
      renderEmployeesTable(employees, companyId, prefix);
    }

    if (appRes.ok) {
      const appData = await appRes.json();
      const applicants = appData.applicants ?? appData;
      renderApplicantsTable(applicants, companyId, prefix);
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
  try {
    const res = await fetch(`http://localhost:8080/User/director/company/${companyId}/hire/${empId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      showToast('Hired!', `${empName} has been hired and is now Active.`, 'success');

      // 1. Remove the applicant row from the applicants table
      if (rowEl) rowEl.remove();

      // 2. Add the new employee to the employees table immediately
      const prefix = currentRole === 'hr' ? 'hr' : 'mgr';
      const tbodyId = prefix === 'mgr' ? 'mgrEmployeesBody' : 'hrEmployeesBody';
      const tbody = document.getElementById(tbodyId);
      if (tbody) {
        // Remove the "no employees" placeholder if present
        const placeholder = tbody.querySelector('td[colspan]');
        if (placeholder) placeholder.closest('tr').remove();

        const actionsHtml = prefix === 'mgr'
          ? `<button class="portal-btn outline sm" onclick="openChangeStatus('${empId}','${empName.replace(/'/g,"\\'")}', this.closest('tr'))">
               <i class="ti ti-arrows-exchange"></i> Status
             </button>
             <button class="portal-btn danger sm" onclick="confirmFire('${empName.replace(/'/g,"\\'")}','${companyId}','${empId}', this.closest('tr'))">
               <i class="ti ti-user-minus"></i> Fire
             </button>`
          : `<button class="portal-btn outline sm" onclick="openChangeStatus('${empId}','${empName.replace(/'/g,"\\'")}', this.closest('tr'))">
               <i class="ti ti-arrows-exchange"></i> Status
             </button>`;

        const tr = document.createElement('tr');
        tr.dataset.empId = empId;
        tr.innerHTML = `
          <td><strong>${empName}</strong></td>
          <td class="mono" style="font-size:12px">—</td>
          <td><span class="status-badge badge-active">Active</span></td>
          <td class="table-actions">${actionsHtml}</td>
        `;
        tbody.appendChild(tr);
      }
    } else {
      const err = await res.text();
      showToast('Hire failed', `Server error: ${res.status}`, 'danger');
      console.error(err);
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
  try {
    const res = await fetch(`http://localhost:8080/User/director/changeStatus/${pendingStatusTarget.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status)
    });

    if (res.ok) {
      showToast('Status updated', `${pendingStatusTarget.name}'s status changed to "${status}".`, 'success');

      // Update the status badge in the DOM
      const rowEl = pendingStatusTarget.rowEl;
      if (rowEl) {
        const badge = rowEl.querySelector('.status-badge');
        if (badge) {
          badge.textContent = status;
          badge.className = `status-badge ${statusBadgeClass(status)}`;
        }

        // If promoted to Manager / HR Manager / Director — remove row from employees table
        const promotions = ['manager', 'hr manager', 'director'];
        if (promotions.includes(status.toLowerCase())) {
          setTimeout(() => {
            rowEl.style.transition = 'opacity 0.4s';
            rowEl.style.opacity = '0';
            setTimeout(() => rowEl.remove(), 400);
          }, 800);
          showToast('Promoted!', `${pendingStatusTarget.name} has been promoted to ${status}.`, 'success');
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
  try {
    const res = await fetch(`http://localhost:8080/User/director/${pendingFireTarget.companyID}/fire/${pendingFireTarget.empId}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      showToast('Fired', `${pendingFireTarget.name} has been removed from the company.`, 'success');

      // Remove the row from the employees table immediately
      const rowEl = pendingFireTarget.rowEl;
      if (rowEl) {
        rowEl.style.transition = 'opacity 0.3s, transform 0.3s';
        rowEl.style.opacity = '0';
        rowEl.style.transform = 'translateX(20px)';
        setTimeout(() => rowEl.remove(), 300);
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
    if (res.ok) showToast('Quit Job', `You have left ${pendingQuitTarget.company}.`, 'success');
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
    else showToast('Failed', `Server error: ${res.status}`, 'danger');
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

//  Init
goScreen('screen-auth');
console.log('[WorkOS] v4 loaded — Employee · Manager · HR Manager portals');