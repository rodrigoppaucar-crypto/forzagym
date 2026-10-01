/**
 * PULSE GYM PRO - CORE APPLICATION CONTROLLER
 * Comprehensive UI Controller, Views Router, Modals & Business Logic
 */

class GymApp {
  constructor() {
    this.currentView = 'dashboard';
    this.currentUserRole = 'admin'; // admin, receptionist, trainer, member
    this.posCart = [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.startLiveClock();
    this.updateOccupancy();
    this.renderView('dashboard');
    this.setupPOS();
  }

  // --- Clock & Live Occupancy ---
  startLiveClock() {
    const updateTime = () => {
      const now = new Date();
      const timeElem = document.getElementById('live-clock-time');
      const dateElem = document.getElementById('live-clock-date');
      if (timeElem) {
        timeElem.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
      if (dateElem) {
        dateElem.textContent = now.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  updateOccupancy() {
    const todayAtts = window.GymDB.getTodayAttendances();
    const activeMembers = window.GymDB.getMembers().filter(m => m.status === 'active').length;
    // Estimated in-gym count based on recent visits
    const currentInGym = Math.min(window.GymDB.data.settings.maxCapacity, Math.max(8, todayAtts.length * 4));
    const max = window.GymDB.data.settings.maxCapacity || 120;
    const pct = Math.min(100, Math.round((currentInGym / max) * 100));

    const countElem = document.getElementById('occupancy-count');
    const barElem = document.getElementById('occupancy-bar-fill');
    if (countElem) countElem.textContent = `${currentInGym} / ${max} pers.`;
    if (barElem) barElem.style.width = `${pct}%`;
  }

  // --- View Routing ---
  renderView(viewName) {
    this.currentView = viewName;

    // Update nav item active states
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });

    // Hide all views & show active
    document.querySelectorAll('.view-container').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
      targetView.classList.add('active');
    }

    // Close mobile menu if open
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('open');

    // Trigger View Renderers
    switch (viewName) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'members':
        this.renderMembers();
        break;
      case 'access':
        this.renderAccessControl();
        break;
      case 'memberships':
        this.renderMemberships();
        break;
      case 'pos':
        this.renderPOS();
        break;
      case 'classes':
        this.renderClasses();
        break;
      case 'routines':
        this.renderRoutines();
        break;
      case 'finances':
        this.renderFinances();
        break;
      case 'member-portal':
        this.renderMemberPortal();
        break;
      case 'settings':
        this.renderSettings();
        break;
    }
  }

  // --- Toast Notification System ---
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';
    if (type === 'warning') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- Dashboard Rendering ---
  renderDashboard() {
    const members = window.GymDB.getMembers();
    const activeCount = members.filter(m => m.status === 'active').length;
    const expiredCount = members.filter(m => m.status === 'expired').length;
    const todayAtts = window.GymDB.getTodayAttendances().length;
    
    // Calculate Monthly Revenue
    const monthlyIncome = window.GymDB.data.sales.reduce((sum, s) => sum + s.total, 0);

    // Update KPI UI
    const elActive = document.getElementById('kpi-active-members');
    const elIncome = document.getElementById('kpi-month-income');
    const elAtt = document.getElementById('kpi-today-att');
    const elExpired = document.getElementById('kpi-expired-members');
    const elCash = document.getElementById('kpi-cash-register');

    if (elActive) elActive.textContent = activeCount;
    if (elIncome) elIncome.textContent = `$${monthlyIncome.toFixed(2)}`;
    if (elAtt) elAtt.textContent = todayAtts;
    if (elExpired) elExpired.textContent = expiredCount;
    if (elCash) elCash.textContent = `$${window.GymDB.data.cashRegister.currentCash.toFixed(2)}`;

    // Render Charts
    setTimeout(() => {
      GymChartEngine.renderIncomeChart('chart-income');
      GymChartEngine.renderPeakHoursChart('chart-peak-hours');
      GymChartEngine.renderPlansDoughnut('chart-plans-doughnut');
    }, 100);

    // Recent attendances list
    const recentTable = document.getElementById('dashboard-recent-attendances');
    if (recentTable) {
      const recent = (window.GymDB.data.attendances || []).slice(0, 6);
      recentTable.innerHTML = recent.map(a => `
        <tr>
          <td>
            <div class="member-cell">
              <div class="member-cell-avatar">
                <i class="fa-solid fa-user"></i>
              </div>
              <div class="member-cell-info">
                <h4>${a.memberName}</h4>
                <span>${a.membershipName}</span>
              </div>
            </div>
          </td>
          <td><span class="status-badge ${a.status === 'granted' ? 'active' : 'expired'}">${a.status === 'granted' ? 'Acceso Válido' : 'Rechazado'}</span></td>
          <td>${a.time}</td>
          <td><span style="font-size: 0.78rem; color: var(--text-dim);">${a.method}</span></td>
        </tr>
      `).join('');
    }
  }

  // --- Members Module ---
  renderMembers(filterStatus = 'all', searchQuery = '') {
    const tableBody = document.getElementById('members-table-body');
    if (!tableBody) return;

    let list = window.GymDB.getMembers();

    if (filterStatus !== 'all') {
      list = list.filter(m => m.status === filterStatus);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => 
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.dni.includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.phone.includes(q)
      );
    }

    if (list.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-dim);">No se encontraron socios con los filtros aplicados.</td></tr>`;
      return;
    }

    tableBody.innerHTML = list.map(m => {
      const plan = window.GymDB.getMembershipById(m.membershipId);
      const planName = plan ? plan.name : 'Sin Plan';

      let statusBadge = '';
      if (m.status === 'active') statusBadge = '<span class="status-badge active"><i class="fa-solid fa-circle-check"></i> Activo</span>';
      else if (m.status === 'expired') statusBadge = '<span class="status-badge expired"><i class="fa-solid fa-circle-xmark"></i> Vencido</span>';
      else if (m.status === 'frozen') statusBadge = '<span class="status-badge frozen"><i class="fa-solid fa-snowflake"></i> Congelado</span>';
      else statusBadge = '<span class="status-badge pending">Pendiente</span>';

      return `
        <tr>
          <td>
            <div class="member-cell">
              <div class="member-cell-avatar">
                <img src="${m.avatar}" alt="${m.firstName}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'" />
              </div>
              <div class="member-cell-info">
                <h4>${m.firstName} ${m.lastName}</h4>
                <span>ID: ${m.id} | DNI: ${m.dni}</span>
              </div>
            </div>
          </td>
          <td><strong>${planName}</strong></td>
          <td>${m.endDate}</td>
          <td>${m.phone}</td>
          <td>${m.totalVisits || 0} visitas</td>
          <td>${statusBadge}</td>
          <td>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn btn-outline btn-sm btn-icon" onclick="GymAppInstance.openMemberDetails('${m.id}')" title="Ver Perfil Completo">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn btn-outline btn-sm btn-icon" onclick="GymExporter.printMemberCard(GymDB.getMemberById('${m.id}'))" title="Imprimir Pase Digital">
                <i class="fa-solid fa-id-card"></i>
              </button>
              <button class="btn btn-outline btn-sm btn-icon" onclick="GymAppInstance.openEditMemberModal('${m.id}')" title="Editar">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-outline btn-sm btn-icon" onclick="GymAppInstance.deleteMemberConfirm('${m.id}')" title="Eliminar" style="color: var(--secondary);">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openNewMemberModal() {
    const modal = document.getElementById('modal-member-form');
    document.getElementById('member-form-title').textContent = "Nuevo Socio / Registro";
    document.getElementById('member-edit-id').value = "";
    
    // Clear inputs
    document.getElementById('m-first-name').value = "";
    document.getElementById('m-last-name').value = "";
    document.getElementById('m-dni').value = "";
    document.getElementById('m-phone').value = "";
    document.getElementById('m-email').value = "";
    document.getElementById('m-birthdate').value = "1998-01-01";
    document.getElementById('m-gender').value = "M";
    document.getElementById('m-address').value = "";
    document.getElementById('m-emergency').value = "";
    document.getElementById('m-medical').value = "";

    // Fill Membership Select
    const planSelect = document.getElementById('m-plan');
    planSelect.innerHTML = window.GymDB.getMemberships().map(p => `
      <option value="${p.id}">${p.name} - $${p.price.toFixed(2)} (${p.durationDays} días)</option>
    `).join('');

    // Fill Trainer Select
    const trainerSelect = document.getElementById('m-trainer');
    trainerSelect.innerHTML = window.GymDB.getStaff().map(t => `
      <option value="${t.id}">${t.name} (${t.role})</option>
    `).join('');

    modal.classList.add('show');
  }

  openEditMemberModal(id) {
    const member = window.GymDB.getMemberById(id);
    if (!member) return;

    const modal = document.getElementById('modal-member-form');
    document.getElementById('member-form-title').textContent = "Editar Socio";
    document.getElementById('member-edit-id').value = member.id;

    document.getElementById('m-first-name').value = member.firstName;
    document.getElementById('m-last-name').value = member.lastName;
    document.getElementById('m-dni').value = member.dni;
    document.getElementById('m-phone').value = member.phone;
    document.getElementById('m-email').value = member.email;
    document.getElementById('m-birthdate').value = member.birthDate;
    document.getElementById('m-gender').value = member.gender;
    document.getElementById('m-address').value = member.address;
    document.getElementById('m-emergency').value = member.emergencyContact || "";
    document.getElementById('m-medical').value = member.medicalNotes || "";

    const planSelect = document.getElementById('m-plan');
    planSelect.innerHTML = window.GymDB.getMemberships().map(p => `
      <option value="${p.id}" ${p.id === member.membershipId ? 'selected' : ''}>${p.name} - $${p.price.toFixed(2)}</option>
    `).join('');

    const trainerSelect = document.getElementById('m-trainer');
    trainerSelect.innerHTML = window.GymDB.getStaff().map(t => `
      <option value="${t.id}" ${t.id === member.trainerId ? 'selected' : ''}>${t.name}</option>
    `).join('');

    modal.classList.add('show');
  }

  saveMember() {
    const editId = document.getElementById('member-edit-id').value;
    const firstName = document.getElementById('m-first-name').value.trim();
    const lastName = document.getElementById('m-last-name').value.trim();
    const dni = document.getElementById('m-dni').value.trim();
    const phone = document.getElementById('m-phone').value.trim();
    const email = document.getElementById('m-email').value.trim();
    const birthDate = document.getElementById('m-birthdate').value;
    const gender = document.getElementById('m-gender').value;
    const address = document.getElementById('m-address').value.trim();
    const emergencyContact = document.getElementById('m-emergency').value.trim();
    const medicalNotes = document.getElementById('m-medical').value.trim();
    const membershipId = document.getElementById('m-plan').value;
    const trainerId = document.getElementById('m-trainer').value;

    if (!firstName || !lastName || !dni || !phone) {
      this.showToast("Por favor completa los campos obligatorios (*)", "warning");
      return;
    }

    const plan = window.GymDB.getMembershipById(membershipId);
    const startDate = new Date().toISOString().split('T')[0];
    const endDateObj = new Date();
    endDateObj.setDate(endDateObj.getDate() + (plan ? plan.durationDays : 30));
    const endDate = endDateObj.toISOString().split('T')[0];

    if (editId) {
      // Update
      window.GymDB.updateMember(editId, {
        firstName, lastName, dni, phone, email, birthDate, gender, address, emergencyContact, medicalNotes, membershipId, trainerId
      });
      this.showToast(`Socio ${firstName} actualizado con éxito`, "success");
    } else {
      // Create new
      const newMember = window.GymDB.addMember({
        firstName, lastName, dni, phone, email, birthDate, gender, address, emergencyContact, medicalNotes,
        membershipId, trainerId, startDate, endDate, status: 'active',
        avatar: gender === 'F' ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      });

      // Record initial sale for plan
      if (plan) {
        const sale = window.GymDB.recordSale({
          type: 'membership',
          memberId: newMember.id,
          customerName: `${firstName} ${lastName}`,
          items: [{ name: plan.name, qty: 1, price: plan.price, total: plan.price }],
          subtotal: plan.price / 1.15,
          tax: plan.price - (plan.price / 1.15),
          total: plan.price,
          paymentMethod: 'Efectivo'
        });
        GymAudio.playCash();
      }

      this.showToast(`¡Nuevo socio ${firstName} registrado con éxito!`, "success");
    }

    this.closeModal('modal-member-form');
    this.renderMembers();
    this.updateOccupancy();
  }

  deleteMemberConfirm(id) {
    const member = window.GymDB.getMemberById(id);
    if (!member) return;
    if (confirm(`¿Estás seguro de eliminar a ${member.firstName} ${member.lastName}?`)) {
      window.GymDB.deleteMember(id);
      this.showToast("Socio eliminado correctamente", "info");
      this.renderMembers();
    }
  }

  openMemberDetails(id) {
    const member = window.GymDB.getMemberById(id);
    if (!member) return;

    const plan = window.GymDB.getMembershipById(member.membershipId);
    const trainer = window.GymDB.getStaff().find(t => t.id === member.trainerId);
    const measurements = window.GymDB.getMeasurementsByMember(member.id);
    const routines = window.GymDB.getRoutinesByMember(member.id);

    const modal = document.getElementById('modal-member-details');
    document.getElementById('details-member-name').textContent = `${member.firstName} ${member.lastName}`;
    document.getElementById('details-member-sub').textContent = `Socio ID: ${member.id} • DNI: ${member.dni}`;
    document.getElementById('details-member-img').src = member.avatar;
    document.getElementById('details-plan-name').textContent = plan ? plan.name : 'Sin Plan';
    document.getElementById('details-start-date').textContent = member.startDate || 'N/A';
    document.getElementById('details-end-date').textContent = member.endDate || 'N/A';
    document.getElementById('details-phone').textContent = member.phone;
    document.getElementById('details-email').textContent = member.email;
    document.getElementById('details-emergency').textContent = member.emergencyContact || 'Ninguno';
    document.getElementById('details-medical').textContent = member.medicalNotes || 'Sin observaciones médicas.';
    document.getElementById('details-trainer').textContent = trainer ? trainer.name : 'No asignado';
    document.getElementById('details-visits').textContent = `${member.totalVisits || 0} entrenamientos`;

    // Status Tag
    const statusEl = document.getElementById('details-status-badge');
    statusEl.className = `status-badge ${member.status}`;
    statusEl.textContent = member.status.toUpperCase();

    // Render Digital Pass QR in modal
    GymQR.generate('details-qr-container', member.qrCode || member.id, { size: 140 });

    // Measurements Table
    const measTable = document.getElementById('details-meas-table');
    if (measTable) {
      if (measurements.length === 0) {
        measTable.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-dim);">No hay registros antropométricos aún.</td></tr>`;
      } else {
        measTable.innerHTML = measurements.map(m => `
          <tr>
            <td><strong>${m.date}</strong></td>
            <td>${m.weightKg} kg</td>
            <td>${m.bodyFatPct}%</td>
            <td>${m.muscleMassKg || '--'} kg</td>
            <td>Pecho: ${m.chestCm || '--'}cm | Brazo: ${m.armsCm || '--'}cm | Cintura: ${m.waistCm || '--'}cm</td>
          </tr>
        `).join('');
      }
    }

    // Set buttons dataset
    document.getElementById('btn-details-print-pass').onclick = () => GymExporter.printMemberCard(member);
    document.getElementById('btn-details-renew').onclick = () => this.renewMembership(member.id);
    document.getElementById('btn-details-add-meas').onclick = () => this.openAddMeasurementModal(member.id);

    modal.classList.add('show');
  }

  renewMembership(memberId) {
    const member = window.GymDB.getMemberById(memberId);
    if (!member) return;

    const plan = window.GymDB.getMembershipById(member.membershipId);
    const days = plan ? plan.durationDays : 30;
    const newEnd = new Date();
    newEnd.setDate(newEnd.getDate() + days);

    window.GymDB.updateMember(member.id, {
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: newEnd.toISOString().split('T')[0]
    });

    if (plan) {
      window.GymDB.recordSale({
        type: 'membership',
        memberId: member.id,
        customerName: `${member.firstName} ${member.lastName}`,
        items: [{ name: `Renovación: ${plan.name}`, qty: 1, price: plan.price, total: plan.price }],
        subtotal: plan.price / 1.15,
        tax: plan.price - (plan.price / 1.15),
        total: plan.price,
        paymentMethod: 'Efectivo'
      });
      GymAudio.playCash();
    }

    this.showToast(`¡Membresía de ${member.firstName} renovada por ${days} días!`, "success");
    this.closeModal('modal-member-details');
    this.renderMembers();
    this.updateOccupancy();
  }

  // --- Anthropometric Measurements ---
  openAddMeasurementModal(memberId) {
    const modal = document.getElementById('modal-add-measurement');
    document.getElementById('meas-member-id').value = memberId;
    modal.classList.add('show');
  }

  saveMeasurement() {
    const memberId = document.getElementById('meas-member-id').value;
    const weightKg = parseFloat(document.getElementById('meas-weight').value) || 0;
    const bodyFatPct = parseFloat(document.getElementById('meas-fat').value) || 0;
    const muscleMassKg = parseFloat(document.getElementById('meas-muscle').value) || 0;
    const chestCm = parseFloat(document.getElementById('meas-chest').value) || 0;
    const armsCm = parseFloat(document.getElementById('meas-arms').value) || 0;
    const waistCm = parseFloat(document.getElementById('meas-waist').value) || 0;

    if (!weightKg) {
      this.showToast("Por favor ingresa al menos el peso corporal", "warning");
      return;
    }

    window.GymDB.addMeasurement({
      memberId,
      date: new Date().toISOString().split('T')[0],
      weightKg,
      bodyFatPct,
      muscleMassKg,
      chestCm,
      armsCm,
      waistCm
    });

    this.showToast("Evaluación física guardada con éxito", "success");
    this.closeModal('modal-add-measurement');
    this.openMemberDetails(memberId);
  }

  // --- Access Control & Virtual Turnstile ---
  renderAccessControl() {
    this.renderAccessLog();
  }

  renderAccessLog() {
    const logContainer = document.getElementById('access-recent-log');
    if (!logContainer) return;

    const atts = (window.GymDB.data.attendances || []).slice(0, 10);
    logContainer.innerHTML = atts.map(a => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-tertiary); border-radius: var(--radius-md); margin-bottom: 0.5rem; border-left: 3px solid ${a.status === 'granted' ? 'var(--accent)' : 'var(--secondary)'};">
        <div>
          <div style="font-weight: 700; font-size: 0.88rem;">${a.memberName}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${a.membershipName} • ${a.method}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.82rem; font-weight: 800;">${a.time}</div>
          <span class="status-badge ${a.status === 'granted' ? 'active' : 'expired'}" style="font-size: 0.65rem;">${a.status === 'granted' ? 'PERMITIDO' : 'DENEGADO'}</span>
        </div>
      </div>
    `).join('');
  }

  simulateScan(codeOrDni = null) {
    const input = document.getElementById('turnstile-scan-input');
    const query = (codeOrDni || (input ? input.value : '')).trim();

    if (!query) {
      this.showToast("Ingresa un DNI, ID de socio o código QR", "warning");
      return;
    }

    const member = window.GymDB.getMemberById(query);
    const resultBox = document.getElementById('turnstile-result-box');
    const memberCardBox = document.getElementById('turnstile-member-card');

    if (input) input.value = '';

    if (!member) {
      GymAudio.playDenied();
      resultBox.className = 'gate-status-indicator gate-denied';
      resultBox.innerHTML = `
        <i class="fa-solid fa-circle-xmark" style="font-size: 2rem; margin-bottom: 0.4rem;"></i>
        <div style="font-size: 1.15rem; font-weight: 800;">ACCESO NO AUTORIZADO</div>
        <div style="font-size: 0.85rem;">Socio o código [${query}] no encontrado en la base de datos</div>
      `;
      memberCardBox.style.display = 'none';
      return;
    }

    const plan = window.GymDB.getMembershipById(member.membershipId);
    const isGranted = member.status === 'active';

    // Record attendance in DB
    const att = window.GymDB.recordAttendance(member, "Torniquete Principal");

    if (isGranted) {
      GymAudio.playGranted();
      resultBox.className = 'gate-status-indicator gate-granted';
      resultBox.innerHTML = `
        <i class="fa-solid fa-circle-check" style="font-size: 2rem; margin-bottom: 0.4rem;"></i>
        <div style="font-size: 1.25rem; font-weight: 800;">¡ACCESO PERMITIDO! BIENVENIDO/A</div>
        <div style="font-size: 0.88rem;">Torniquete desbloqueado • ¡A darlo todo hoy!</div>
      `;
    } else {
      GymAudio.playDenied();
      resultBox.className = 'gate-status-indicator gate-denied';
      resultBox.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 2rem; margin-bottom: 0.4rem;"></i>
        <div style="font-size: 1.25rem; font-weight: 800;">ACCESO DENEGADO</div>
        <div style="font-size: 0.88rem;">Membresía ${member.status === 'expired' ? 'VENCIDA' : member.status.toUpperCase()} • Acércate a recepción</div>
      `;
    }

    // Display Member Profile Preview
    memberCardBox.style.display = 'block';
    document.getElementById('turnstile-member-img').src = member.avatar;
    document.getElementById('turnstile-member-name').textContent = `${member.firstName} ${member.lastName}`;
    document.getElementById('turnstile-member-plan').textContent = plan ? plan.name : 'Membresía General';
    document.getElementById('turnstile-member-expiry').textContent = `Vencimiento: ${member.endDate}`;
    document.getElementById('turnstile-member-visits').textContent = `${member.totalVisits} visitas totales`;

    this.renderAccessLog();
    this.updateOccupancy();
  }

  // --- Memberships Module ---
  renderMemberships() {
    const container = document.getElementById('memberships-grid-container');
    if (!container) return;

    const plans = window.GymDB.getMemberships();
    container.innerHTML = plans.map(p => `
      <div class="card" style="border-top: 4px solid ${p.color || 'var(--primary)'}; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
            <h3 style="font-size: 1.25rem; font-weight: 800;">${p.name}</h3>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 0.75rem; background: rgba(255,255,255,0.06); padding: 0.25rem 0.6rem; border-radius: var(--radius-full); font-weight: 700;">${p.durationDays} días</span>
              <button class="btn btn-outline btn-sm btn-icon" onclick="GymAppInstance.openEditPlanModal('${p.id}')" title="Editar Plan" style="width: 26px; height: 26px; font-size: 0.75rem;">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn btn-outline btn-sm btn-icon" onclick="GymAppInstance.deletePlanConfirm('${p.id}')" title="Eliminar Plan" style="width: 26px; height: 26px; font-size: 0.75rem; color: var(--secondary);">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>

          <div style="font-size: 2.2rem; font-weight: 900; color: ${p.color || 'var(--primary)'}; margin-bottom: 1rem;">
            $${p.price.toFixed(2)}
          </div>

          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">
            ${p.benefits.map(b => `
              <li style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid fa-check" style="color: var(--accent);"></i> ${b}
              </li>
            `).join('')}
          </ul>
        </div>

        <button class="btn btn-primary" style="width: 100%;" onclick="GymAppInstance.openNewMemberModal()">
          <i class="fa-solid fa-user-plus"></i> Inscribir con este Plan
        </button>
      </div>
    `).join('');
  }

  openNewPlanModal() {
    const modal = document.getElementById('modal-plan-form');
    if (!modal) return;
    document.getElementById('plan-form-title').textContent = "Nuevo Plan / Membresía";
    document.getElementById('plan-edit-id').value = "";
    document.getElementById('plan-name').value = "";
    document.getElementById('plan-price').value = "";
    document.getElementById('plan-duration').value = "30";
    document.getElementById('plan-color').value = "#00f2fe";
    document.getElementById('plan-classes-included').checked = true;
    document.getElementById('plan-benefits').value = "Acceso a sala de musculación\nÁrea de cardio zone\nUso de lockers";
    modal.classList.add('show');
  }

  openEditPlanModal(planId) {
    const plan = window.GymDB.getMembershipById(planId);
    if (!plan) return;

    const modal = document.getElementById('modal-plan-form');
    if (!modal) return;
    document.getElementById('plan-form-title').textContent = "Editar Plan / Membresía";
    document.getElementById('plan-edit-id').value = plan.id;
    document.getElementById('plan-name').value = plan.name;
    document.getElementById('plan-price').value = plan.price;
    document.getElementById('plan-duration').value = plan.durationDays;
    document.getElementById('plan-color').value = plan.color || "#00f2fe";
    document.getElementById('plan-classes-included').checked = !!plan.classesIncluded;
    document.getElementById('plan-benefits').value = (plan.benefits || []).join('\n');
    modal.classList.add('show');
  }

  saveMembershipPlan() {
    const editId = document.getElementById('plan-edit-id').value;
    const name = document.getElementById('plan-name').value.trim();
    const price = parseFloat(document.getElementById('plan-price').value) || 0;
    const durationDays = parseInt(document.getElementById('plan-duration').value) || 30;
    const color = document.getElementById('plan-color').value || '#00f2fe';
    const classesIncluded = document.getElementById('plan-classes-included').checked;
    const rawBenefits = document.getElementById('plan-benefits').value.trim();

    if (!name || price <= 0 || durationDays <= 0) {
      this.showToast("Por favor completa el nombre, precio y duración válidos", "warning");
      return;
    }

    const benefits = rawBenefits ? rawBenefits.split('\n').map(b => b.trim()).filter(b => b.length > 0) : ['Acceso general al gimnasio'];

    if (editId) {
      window.GymDB.updateMembership(editId, {
        name,
        price,
        durationDays,
        color,
        classesIncluded,
        benefits
      });
      this.showToast(`Plan "${name}" actualizado con éxito`, "success");
    } else {
      window.GymDB.addMembership({
        name,
        price,
        durationDays,
        color,
        classesIncluded,
        benefits
      });
      this.showToast(`¡Nuevo plan "${name}" creado con éxito!`, "success");
    }

    this.closeModal('modal-plan-form');
    this.renderMemberships();
  }

  deletePlanConfirm(planId) {
    const plan = window.GymDB.getMembershipById(planId);
    if (!plan) return;

    if (confirm(`¿Estás seguro de eliminar el plan "${plan.name}"?`)) {
      window.GymDB.deleteMembership(planId);
      this.showToast(`Plan "${plan.name}" eliminado`, "info");
      this.renderMemberships();
    }
  }

  // --- Point of Sale (POS) Module ---
  setupPOS() {
    this.posCart = [];
  }

  renderPOS(filterCategory = 'all', searchQuery = '') {
    const grid = document.getElementById('pos-products-list');
    if (!grid) return;

    let products = window.GymDB.getProducts();

    if (filterCategory !== 'all') {
      products = products.filter(p => p.category === filterCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.barcode.includes(q));
    }

    grid.innerHTML = products.map(p => `
      <div class="pos-product-card" onclick="GymAppInstance.addToCart('${p.id}')">
        <div class="product-thumb">
          <i class="${p.icon || 'fa-solid fa-dumbbell'}"></i>
        </div>
        <div class="product-info">
          <h5>${p.name}</h5>
          <p>Stock: <strong>${p.stock}</strong> un.</p>
        </div>
        <div class="product-price-row">
          <span class="product-price">$${p.salePrice.toFixed(2)}</span>
          <button class="btn btn-primary btn-sm btn-icon" style="border-radius: 50%;">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `).join('');

    this.renderCart();
  }

  addToCart(productId) {
    const product = window.GymDB.getProductById(productId);
    if (!product) return;

    if (product.stock <= 0) {
      this.showToast("Producto sin stock disponible", "error");
      return;
    }

    const existing = this.posCart.find(item => item.productId === productId);
    if (existing) {
      if (existing.qty >= product.stock) {
        this.showToast(`Límite de stock alcanzado (${product.stock} un.)`, "warning");
        return;
      }
      existing.qty += 1;
      existing.total = existing.qty * existing.price;
    } else {
      this.posCart.push({
        productId: product.id,
        name: product.name,
        price: product.salePrice,
        qty: 1,
        total: product.salePrice
      });
    }

    GymAudio.playBeep();
    this.renderCart();
  }

  updateCartItemQty(productId, delta) {
    const item = this.posCart.find(i => i.productId === productId);
    if (!item) return;

    const product = window.GymDB.getProductById(productId);
    item.qty += delta;

    if (item.qty <= 0) {
      this.posCart = this.posCart.filter(i => i.productId !== productId);
    } else if (item.qty > product.stock) {
      item.qty = product.stock;
      this.showToast("Alcanzado el stock máximo disponible", "warning");
    }

    if (item.qty > 0) {
      item.total = item.qty * item.price;
    }

    this.renderCart();
  }

  clearCart() {
    this.posCart = [];
    this.renderCart();
  }

  renderCart() {
    const container = document.getElementById('pos-cart-items-container');
    const subtotalEl = document.getElementById('pos-cart-subtotal');
    const taxEl = document.getElementById('pos-cart-tax');
    const totalEl = document.getElementById('pos-cart-total');
    const countEl = document.getElementById('pos-cart-items-count');

    if (!container) return;

    if (this.posCart.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-dim); margin-top: 3rem;">
          <i class="fa-solid fa-cart-shopping" style="font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.4;"></i>
          <p>El carrito está vacío</p>
          <span style="font-size: 0.75rem;">Haz clic en cualquier producto para agregarlo</span>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (taxEl) taxEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';
      if (countEl) countEl.textContent = '0';
      return;
    }

    const rawTotal = this.posCart.reduce((sum, i) => sum + i.total, 0);
    const taxRate = window.GymDB.data.settings.taxRate || 15;
    const subtotal = rawTotal / (1 + (taxRate / 100));
    const tax = rawTotal - subtotal;

    container.innerHTML = this.posCart.map(item => `
      <div class="cart-item-row">
        <div style="flex: 1; padding-right: 0.5rem;">
          <div style="font-weight: 700; font-size: 0.85rem; line-height: 1.2;">${item.name}</div>
          <div style="font-size: 0.75rem; color: var(--accent); font-weight: 700;">$${item.price.toFixed(2)} c/u</div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <button class="btn btn-outline btn-sm btn-icon" style="width: 26px; height: 26px;" onclick="GymAppInstance.updateCartItemQty('${item.productId}', -1)">-</button>
          <span style="font-weight: 800; font-size: 0.85rem; min-width: 18px; text-align: center;">${item.qty}</span>
          <button class="btn btn-outline btn-sm btn-icon" style="width: 26px; height: 26px;" onclick="GymAppInstance.updateCartItemQty('${item.productId}', 1)">+</button>
        </div>
        <div style="font-weight: 800; font-size: 0.9rem; min-width: 55px; text-align: right; margin-left: 0.5rem;">
          $${item.total.toFixed(2)}
        </div>
      </div>
    `).join('');

    const totalQty = this.posCart.reduce((sum, i) => sum + i.qty, 0);
    if (countEl) countEl.textContent = totalQty;
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${rawTotal.toFixed(2)}`;
  }

  checkoutPOS() {
    if (this.posCart.length === 0) {
      this.showToast("El carrito está vacío", "warning");
      return;
    }

    const customerInput = document.getElementById('pos-customer-input');
    const paymentMethod = document.getElementById('pos-payment-method').value;
    const customerName = customerInput ? customerInput.value.trim() : 'Consumidor Final';

    const rawTotal = this.posCart.reduce((sum, i) => sum + i.total, 0);
    const taxRate = window.GymDB.data.settings.taxRate || 15;
    const subtotal = rawTotal / (1 + (taxRate / 100));
    const tax = rawTotal - subtotal;

    const sale = window.GymDB.recordSale({
      type: 'pos',
      customerName: customerName || 'Consumidor Final',
      items: [...this.posCart],
      subtotal: subtotal,
      tax: tax,
      total: rawTotal,
      paymentMethod: paymentMethod
    });

    GymAudio.playCash();
    this.showToast(`¡Venta realizada con éxito por $${rawTotal.toFixed(2)}!`, "success");

    // Print Receipt automatically
    GymExporter.printReceipt(sale);

    this.clearCart();
    this.renderPOS();
  }

  // --- Classes & Calendar ---
  renderClasses() {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const container = document.getElementById('schedule-calendar-grid');
    if (!container) return;

    const classes = window.GymDB.getClasses();

    container.innerHTML = days.map(day => {
      const dayClasses = classes.filter(c => c.day.toLowerCase() === day.toLowerCase());

      return `
        <div class="schedule-day-column">
          <div class="day-header">
            <div class="day-name">${day}</div>
          </div>
          <div class="classes-list">
            ${dayClasses.length === 0 ? '<div style="font-size: 0.75rem; color: var(--text-dim); text-align: center; margin-top: 2rem;">Sin clases</div>' : ''}
            ${dayClasses.map(c => {
              const trainer = window.GymDB.getStaff().find(t => t.id === c.trainerId);
              const spotsLeft = c.capacity - c.booked;
              return `
                <div class="class-card ${c.category}" onclick="GymAppInstance.bookClassModal('${c.id}')">
                  <div style="font-weight: 800; font-size: 0.88rem; margin-bottom: 0.2rem;">${c.name}</div>
                  <div style="color: var(--primary); font-size: 0.75rem; font-weight: 700; margin-bottom: 0.35rem;">
                    <i class="fa-regular fa-clock"></i> ${c.time}
                  </div>
                  <div style="color: var(--text-muted); font-size: 0.72rem;">
                    <i class="fa-solid fa-user-ninja"></i> ${trainer ? trainer.name : 'Staff'}
                  </div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.72rem;">
                    <span style="color: ${spotsLeft <= 2 ? 'var(--secondary)' : 'var(--accent)'}; font-weight: 700;">
                      ${spotsLeft > 0 ? `${spotsLeft} cupos libres` : 'LLENO'}
                    </span>
                    <span class="btn btn-primary btn-sm" style="padding: 0.2rem 0.5rem; font-size: 0.7rem;">Reservar</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  bookClassModal(classId) {
    const cls = window.GymDB.getClasses().find(c => c.id === classId);
    if (!cls) return;

    if (cls.booked >= cls.capacity) {
      this.showToast("Esta clase ya no tiene cupos disponibles", "error");
      return;
    }

    if (confirm(`¿Deseas reservar un cupo para "${cls.name}" (${cls.day} ${cls.time})?`)) {
      window.GymDB.bookClassSpot(classId);
      GymAudio.playGranted();
      this.showToast(`¡Cupo reservado con éxito para ${cls.name}!`, "success");
      this.renderClasses();
    }
  }

  // --- Routines & Workouts ---
  renderRoutines() {
    const select = document.getElementById('routine-member-select');
    if (!select) return;

    const members = window.GymDB.getMembers();
    select.innerHTML = members.map(m => `
      <option value="${m.id}">${m.firstName} ${m.lastName} (ID: ${m.id})</option>
    `).join('');

    this.loadMemberRoutine(members[0]?.id);
  }

  loadMemberRoutine(memberId) {
    const container = document.getElementById('routine-display-container');
    if (!container) return;

    const member = window.GymDB.getMemberById(memberId);
    const routines = window.GymDB.getRoutinesByMember(memberId);

    if (!member || routines.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 3rem;">
          <i class="fa-solid fa-dumbbell" style="font-size: 3rem; color: var(--text-dim); margin-bottom: 1rem;"></i>
          <h3>No hay rutina personalizada asignada aún</h3>
          <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0.5rem 0 1.5rem;">Crea un plan de entrenamiento individual para este socio.</p>
          <button class="btn btn-primary" onclick="GymAppInstance.openNewRoutineModal('${memberId}')">
            <i class="fa-solid fa-plus"></i> Crear Rutina Personalizada
          </button>
        </div>
      `;
      return;
    }

    const routine = routines[0];
    container.innerHTML = `
      <div class="card" style="margin-bottom: 1.5rem; border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h3 style="font-size: 1.35rem; font-weight: 800;">${routine.name}</h3>
            <p style="color: var(--text-muted); font-size: 0.88rem;">Objetivo: <strong>${routine.goal}</strong> • Coach: <strong>${routine.trainer}</strong></p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Imprimir Rutina
          </button>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
        ${routine.days.map(d => `
          <div class="card">
            <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 1rem; color: var(--primary);">
              <i class="fa-solid fa-calendar-day"></i> ${d.dayName}
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              ${d.exercises.map((e, idx) => `
                <div style="background: var(--bg-tertiary); padding: 0.85rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                    <strong style="font-size: 0.9rem;">${idx + 1}. ${e.name}</strong>
                    <span style="font-size: 0.75rem; color: var(--accent); font-weight: 700;">Descanso: ${e.rest}</span>
                  </div>
                  <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted);">
                    <span>Series: <strong>${e.sets}</strong></span>
                    <span>Reps: <strong>${e.reps}</strong></span>
                  </div>
                  ${e.notes ? `<div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 0.3rem;"><i class="fa-solid fa-info-circle"></i> ${e.notes}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- Finances & Cash Register ---
  renderFinances() {
    const cash = window.GymDB.data.cashRegister;
    const sales = window.GymDB.data.sales || [];
    const expenses = window.GymDB.getExpenses();

    const totalIncome = sales.reduce((sum, s) => sum + s.total, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    const elBalance = document.getElementById('fin-net-balance');
    const elIncome = document.getElementById('fin-total-income');
    const elExpense = document.getElementById('fin-total-expense');
    const elCash = document.getElementById('fin-cash-drawer');

    if (elBalance) elBalance.textContent = `$${netBalance.toFixed(2)}`;
    if (elIncome) elIncome.textContent = `$${totalIncome.toFixed(2)}`;
    if (elExpense) elExpense.textContent = `$${totalExpenses.toFixed(2)}`;
    if (elCash) elCash.textContent = `$${cash.currentCash.toFixed(2)}`;

    // Sales Table
    const salesTable = document.getElementById('fin-sales-table-body');
    if (salesTable) {
      salesTable.innerHTML = sales.slice(0, 8).map(s => `
        <tr>
          <td><strong>${s.id}</strong></td>
          <td>${s.date}</td>
          <td>${s.customerName}</td>
          <td><span class="status-badge ${s.type === 'membership' ? 'active' : 'frozen'}">${s.type === 'membership' ? 'Membresía' : 'Tienda POS'}</span></td>
          <td>${s.paymentMethod}</td>
          <td><strong>$${s.total.toFixed(2)}</strong></td>
          <td>
            <button class="btn btn-outline btn-sm btn-icon" onclick="GymExporter.printReceipt(GymDB.data.sales.find(x => x.id === '${s.id}'))" title="Imprimir Recibo">
              <i class="fa-solid fa-receipt"></i>
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Expenses Table
    const expTable = document.getElementById('fin-expenses-table-body');
    if (expTable) {
      expTable.innerHTML = expenses.map(e => `
        <tr>
          <td><strong>${e.id}</strong></td>
          <td>${e.date}</td>
          <td>${e.concept}</td>
          <td><span class="status-badge expired">${e.category}</span></td>
          <td>${e.responsible}</td>
          <td style="color: var(--secondary); font-weight: 800;">-$${e.amount.toFixed(2)}</td>
        </tr>
      `).join('');
    }
  }

  openAddExpenseModal() {
    const modal = document.getElementById('modal-add-expense');
    modal.classList.add('show');
  }

  saveExpense() {
    const concept = document.getElementById('exp-concept').value.trim();
    const category = document.getElementById('exp-category').value;
    const amount = parseFloat(document.getElementById('exp-amount').value) || 0;
    const responsible = document.getElementById('exp-responsible').value.trim() || 'Caja';
    const paymentMethod = document.getElementById('exp-payment-method').value;

    if (!concept || amount <= 0) {
      this.showToast("Ingresa un concepto y un monto válido", "warning");
      return;
    }

    window.GymDB.addExpense({
      concept,
      category,
      amount,
      responsible,
      paymentMethod,
      date: new Date().toISOString().split('T')[0]
    });

    this.showToast(`Gasto de $${amount.toFixed(2)} registrado correctamente`, "info");
    this.closeModal('modal-add-expense');
    this.renderFinances();
  }

  // --- Member Self-Service Portal ---
  renderMemberPortal() {
    const select = document.getElementById('portal-select-member');
    if (!select) return;

    const members = window.GymDB.getMembers();
    select.innerHTML = members.map(m => `
      <option value="${m.id}">${m.firstName} ${m.lastName} (${m.dni})</option>
    `).join('');

    this.loadMemberPortalView(members[0]?.id);
  }

  loadMemberPortalView(memberId) {
    const member = window.GymDB.getMemberById(memberId);
    if (!member) return;

    const plan = window.GymDB.getMembershipById(member.membershipId);

    // Profile Info
    document.getElementById('portal-member-name').textContent = `${member.firstName} ${member.lastName}`;
    document.getElementById('portal-member-img').src = member.avatar;
    document.getElementById('portal-plan-name').textContent = plan ? plan.name : 'Membresía General';
    document.getElementById('portal-end-date').textContent = member.endDate;
    document.getElementById('portal-visits').textContent = `${member.totalVisits || 0} visitas`;

    const statusBadge = document.getElementById('portal-status-badge');
    statusBadge.className = `status-badge ${member.status}`;
    statusBadge.textContent = member.status.toUpperCase();

    // Render QR Pass
    GymQR.generate('portal-qr-card', member.qrCode || member.id, { size: 160 });

    // Render Daily Routine Checklist
    const routines = window.GymDB.getRoutinesByMember(memberId);
    const routineContainer = document.getElementById('portal-routine-checklist');
    if (routineContainer) {
      if (routines.length > 0 && routines[0].days.length > 0) {
        const todayDay = routines[0].days[0];
        routineContainer.innerHTML = `
          <h4 style="font-weight: 800; font-size: 1rem; margin-bottom: 0.75rem; color: var(--primary);">
            <i class="fa-solid fa-fire"></i> ${todayDay.dayName}
          </h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${todayDay.exercises.map((e, idx) => `
              <label style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-tertiary); padding: 0.75rem; border-radius: var(--radius-md); cursor: pointer;">
                <input type="checkbox" style="width: 18px; height: 18px; accent-color: var(--primary);" />
                <div style="flex: 1;">
                  <strong style="font-size: 0.88rem;">${e.name}</strong>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${e.sets} series x ${e.reps} reps • Descanso ${e.rest}</div>
                </div>
              </label>
            `).join('')}
          </div>
        `;
      } else {
        routineContainer.innerHTML = `<p style="color: var(--text-dim); text-align: center;">No tienes rutinas asignadas hoy. ¡Pregunta a tu coach!</p>`;
      }
    }
  }

  // --- Settings & Data Backup ---
  renderSettings() {
    const s = window.GymDB.data.settings;
    document.getElementById('set-gym-name').value = s.gymName || '';
    document.getElementById('set-slogan').value = s.slogan || '';
    document.getElementById('set-tax-id').value = s.taxId || '';
    document.getElementById('set-phone').value = s.phone || '';
    document.getElementById('set-email').value = s.email || '';
    document.getElementById('set-address').value = s.address || '';
    document.getElementById('set-currency').value = s.currency || '$';
    document.getElementById('set-tax-rate').value = s.taxRate || 15;
    document.getElementById('set-capacity').value = s.maxCapacity || 120;
    document.getElementById('set-ticket-footer').value = s.ticketFooter || '';
  }

  saveSettings() {
    const s = window.GymDB.data.settings;
    s.gymName = document.getElementById('set-gym-name').value.trim();
    s.slogan = document.getElementById('set-slogan').value.trim();
    s.taxId = document.getElementById('set-tax-id').value.trim();
    s.phone = document.getElementById('set-phone').value.trim();
    s.email = document.getElementById('set-email').value.trim();
    s.address = document.getElementById('set-address').value.trim();
    s.currency = document.getElementById('set-currency').value.trim() || '$';
    s.taxRate = parseFloat(document.getElementById('set-tax-rate').value) || 15;
    s.maxCapacity = parseInt(document.getElementById('set-capacity').value) || 120;
    s.ticketFooter = document.getElementById('set-ticket-footer').value.trim();

    window.GymDB.save();
    
    // Update Header Brand
    const headerTitle = document.querySelector('.brand-info h1');
    if (headerTitle) headerTitle.textContent = s.gymName;

    this.showToast("Configuración del gimnasio guardada con éxito", "success");
    this.updateOccupancy();
  }

  exportBackup() {
    const jsonStr = window.GymDB.exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FORZAGYM_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    this.showToast("Copia de seguridad descargada en JSON", "success");
  }

  importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const success = window.GymDB.importJSON(e.target.result);
      if (success) {
        this.showToast("Base de datos restaurada correctamente", "success");
        setTimeout(() => location.reload(), 1000);
      } else {
        this.showToast("Archivo de respaldo inválido", "error");
      }
    };
    reader.readAsText(file);
  }

  resetDemoData() {
    if (confirm("¿Estás seguro de restaurar los datos de demostración? Se borrarán los cambios actuales.")) {
      window.GymDB.resetToDefaults();
      this.showToast("Datos de demostración cargados", "info");
      setTimeout(() => location.reload(), 800);
    }
  }

  // --- Modals & Utilities ---
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
  }

  toggleTheme() {
    const body = document.body;
    const isDark = !body.hasAttribute('data-theme') || body.getAttribute('data-theme') === 'dark';
    if (isDark) {
      body.setAttribute('data-theme', 'light');
    } else {
      body.removeAttribute('data-theme');
    }
  }

  toggleSound() {
    const muted = GymAudio.toggleMute();
    const btn = document.getElementById('btn-toggle-sound');
    if (btn) {
      btn.innerHTML = muted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
    }
    this.showToast(muted ? "Sonidos silenciados" : "Sonidos activados", "info");
  }

  // --- Global Event Bindings ---
  bindEvents() {
    // Navigation clicks
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.dataset.view;
        if (view) this.renderView(view);
      });
    });

    // Mobile sidebar toggle
    const mobBtn = document.getElementById('mobile-menu-btn');
    if (mobBtn) {
      mobBtn.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
      });
    }

    // Modal close backdrops & close buttons
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('show');
        }
      });
    });
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) modal.classList.remove('show');
      });
    });

    // Global Search Input
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        if (q.length > 1) {
          this.renderView('members');
          this.renderMembers('all', q);
        }
      });
    }
  }
}

// Instantiate and expose globally
document.addEventListener('DOMContentLoaded', () => {
  window.GymAppInstance = new GymApp();
});
