/**
 * PULSE GYM PRO - TICKET & DIGITAL PASS PRINTER / EXPORTER
 * Formats thermal receipt printouts, printable credentials, and CSV exports.
 */

const GymExporter = {
  printCashClosingReport(report) {
    const settings = window.GymDB.data.settings;
    const printableElem = document.getElementById('printable-cash-report');
    if (!printableElem) {
      throw new Error('No se encontró el contenedor del reporte imprimible de caja.');
    }

    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
    const amount = value => `${escapeHtml(settings.currency || '$')}${(Number(value) || 0).toFixed(2)}`;
    const formatDate = value => {
      if (!value) return '—';
      const date = String(value).slice(0, 10);
      const parsed = new Date(`${date}T12:00:00`);
      return Number.isNaN(parsed.getTime()) ? escapeHtml(value) : parsed.toLocaleDateString('es-EC');
    };
    const rangeLabel = report.from || report.to
      ? `${report.from ? formatDate(report.from) : 'Inicio'} al ${report.to ? formatDate(report.to) : 'Hoy'}`
      : 'Todo el historial';

    const sales = Array.isArray(report.sales) ? report.sales : [];
    const expenses = Array.isArray(report.expenses) ? report.expenses : [];
    const cashRegister = report.cashRegister || {};
    const totalSales = sales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const cashSales = sales.filter(sale => sale.paymentMethod === 'Efectivo')
      .reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
    const cashExpenses = expenses.filter(expense => expense.paymentMethod === 'Efectivo')
      .reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const otherSales = totalSales - cashSales;
    const otherExpenses = totalExpenses - cashExpenses;

    const methods = new Map();
    sales.forEach(sale => {
      const method = sale.paymentMethod || 'No especificado';
      const current = methods.get(method) || { sales: 0, expenses: 0 };
      current.sales += Number(sale.total) || 0;
      methods.set(method, current);
    });
    expenses.forEach(expense => {
      const method = expense.paymentMethod || 'No especificado';
      const current = methods.get(method) || { sales: 0, expenses: 0 };
      current.expenses += Number(expense.amount) || 0;
      methods.set(method, current);
    });

    const methodRows = [...methods.entries()].map(([method, totals]) => `
      <tr>
        <td>${escapeHtml(method)}</td>
        <td class="amount">${amount(totals.sales)}</td>
        <td class="amount">${amount(totals.expenses)}</td>
        <td class="amount">${amount(totals.sales - totals.expenses)}</td>
      </tr>
    `).join('');

    const saleRows = sales.map(sale => {
      const items = Array.isArray(sale.items) && sale.items.length
        ? sale.items.map(item => `
          <tr class="subrow">
            <td colspan="3">↳ ${Number(item.qty) || 0} × ${escapeHtml(item.name || 'Artículo')}</td>
            <td class="amount">${amount(item.total ?? ((Number(item.price) || 0) * (Number(item.qty) || 0)))}</td>
          </tr>
        `).join('')
        : '';
      const date = String(sale.date || '').slice(0, 16);
      const saleType = sale.type === 'membership' ? 'Membresía'
        : sale.type === 'visit-pass' ? 'Pase de visita'
          : sale.type === 'pos' ? 'Tienda POS' : 'Venta';
      return `
        <tr>
          <td>${escapeHtml(sale.id || '—')}</td>
          <td>${formatDate(date)}${date.length > 10 ? ` ${escapeHtml(date.slice(11))}` : ''}</td>
          <td>${escapeHtml(sale.customerName || 'Consumidor Final')}<br><small>${saleType} · ${escapeHtml(sale.paymentMethod || 'No especificado')} · Cajero: ${escapeHtml(sale.cashier || 'No especificado')}</small><br><small>Subtotal: ${amount(sale.subtotal)} · IVA: ${amount(sale.tax)}</small></td>
          <td class="amount">${amount(sale.total)}</td>
        </tr>${items}
      `;
    }).join('');

    const expenseRows = expenses.map(expense => `
      <tr>
        <td>${escapeHtml(expense.id || '—')}</td>
        <td>${formatDate(expense.date)}</td>
        <td>${escapeHtml(expense.concept || 'Egreso')}<br><small>${escapeHtml(expense.category || 'Sin categoría')} · ${escapeHtml(expense.paymentMethod || 'No especificado')} · Responsable: ${escapeHtml(expense.responsible || 'No especificado')}</small></td>
        <td class="amount">−${amount(expense.amount)}</td>
      </tr>
    `).join('');

    const cashStatus = cashRegister.isOpen ? 'Caja abierta' : 'Caja cerrada';
    const openingTime = cashRegister.openedAt ? new Date(cashRegister.openedAt).toLocaleString('es-EC') : 'No registrado';
    const closingTime = cashRegister.closedAt ? new Date(cashRegister.closedAt).toLocaleString('es-EC') : 'No registrado';

    printableElem.innerHTML = `
      <header class="cash-report-header">
        <h1>${escapeHtml(settings.gymName || 'ForzaGym')}</h1>
        <p>${escapeHtml(settings.slogan || '')}</p>
        <p>${escapeHtml(settings.taxId || '')} · ${escapeHtml(settings.phone || '')}</p>
        <p>${escapeHtml(settings.address || '')}</p>
        <h2>REPORTE DE CIERRE DE CAJA</h2>
        <p><strong>Periodo:</strong> ${rangeLabel}</p>
        <p><strong>Impreso:</strong> ${new Date().toLocaleString('es-EC')}</p>
      </header>

      <section>
        <h3>Resumen general</h3>
        <div class="cash-report-summary">
          <div><span>Ventas (${sales.length})</span><strong>${amount(totalSales)}</strong></div>
          <div><span>Egresos (${expenses.length})</span><strong>−${amount(totalExpenses)}</strong></div>
          <div><span>Balance del periodo</span><strong>${amount(totalSales - totalExpenses)}</strong></div>
          <div><span>Ingresos en efectivo</span><strong>${amount(cashSales)}</strong></div>
          <div><span>Egresos en efectivo</span><strong>−${amount(cashExpenses)}</strong></div>
          <div><span>Movimiento neto en efectivo</span><strong>${amount(cashSales - cashExpenses)}</strong></div>
          <div><span>Otros medios de pago (neto)</span><strong>${amount(otherSales - otherExpenses)}</strong></div>
          <div><span>Fondo inicial configurado</span><strong>${amount(cashRegister.initialCash)}</strong></div>
          <div><span>Efectivo registrado actualmente</span><strong>${amount(cashRegister.currentCash)}</strong></div>
          <div><span>Estado de caja</span><strong>${cashStatus}</strong></div>
          <div><span>Apertura registrada</span><strong>${escapeHtml(openingTime)}</strong></div>
          <div><span>Cierre registrado</span><strong>${escapeHtml(closingTime)}</strong></div>
        </div>
        <p class="cash-report-note">El efectivo actual y los datos de apertura/cierre son el estado de caja al momento de imprimir; los movimientos se limitan al periodo seleccionado.</p>
      </section>

      <section>
        <h3>Totales por forma de pago</h3>
        <table>
          <thead><tr><th>Forma de pago</th><th>Ingresos</th><th>Egresos</th><th>Neto</th></tr></thead>
          <tbody>${methodRows || '<tr><td colspan="4">Sin movimientos en el periodo.</td></tr>'}</tbody>
        </table>
      </section>

      <section>
        <h3>Detalle individual de ventas</h3>
        <table>
          <thead><tr><th>Recibo</th><th>Fecha</th><th>Cliente y detalle</th><th>Total</th></tr></thead>
          <tbody>${saleRows || '<tr><td colspan="4">Sin ventas en el periodo.</td></tr>'}</tbody>
        </table>
      </section>

      <section>
        <h3>Detalle individual de egresos</h3>
        <table>
          <thead><tr><th>Referencia</th><th>Fecha</th><th>Concepto, categoría y responsable</th><th>Monto</th></tr></thead>
          <tbody>${expenseRows || '<tr><td colspan="4">Sin egresos en el periodo.</td></tr>'}</tbody>
        </table>
      </section>

      <footer class="cash-report-signatures">
        <div>____________________________<br>Responsable de caja</div>
        <div>____________________________<br>Revisión / Administración</div>
      </footer>
    `;

    const cleanupPrintMode = () => document.body.classList.remove('printing-cash-report');
    window.addEventListener('afterprint', cleanupPrintMode, { once: true });
    document.body.classList.add('printing-cash-report');
    window.print();
  },

  // Print 80mm Thermal Receipt for Membership or POS Sale
  printReceipt(sale) {
    const settings = window.GymDB.data.settings;
    let printableElem = document.getElementById('printable-ticket');
    if (!printableElem) {
      printableElem = document.createElement('div');
      printableElem.id = 'printable-ticket';
      document.body.appendChild(printableElem);
    }

    let itemsHtml = '';
    (sale.items || []).forEach(item => {
      itemsHtml += `
        <div style="display: flex; justify-content: space-between; margin: 3px 0;">
          <span>${item.qty}x ${item.name}</span>
          <span>${settings.currency}${(item.price * item.qty).toFixed(2)}</span>
        </div>
      `;
    });

    printableElem.innerHTML = `
      <div style="text-align: center; font-family: monospace; font-size: 12px; line-height: 1.3; color: #000; padding: 10px;">
        <h2 style="margin: 0; font-size: 16px; font-weight: bold;">${settings.gymName}</h2>
        <p style="margin: 2px 0; font-size: 11px;">${settings.slogan}</p>
        <p style="margin: 2px 0; font-size: 11px;">${settings.taxId}</p>
        <p style="margin: 2px 0; font-size: 11px;">Telf: ${settings.phone}</p>
        <p style="margin: 2px 0; font-size: 10px;">${settings.address}</p>
        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        
        <div style="text-align: left; font-size: 11px;">
          <div><strong>RECIBO N°:</strong> ${sale.id}</div>
          <div><strong>FECHA:</strong> ${sale.date}</div>
          <div><strong>CLIENTE:</strong> ${sale.customerName || 'Consumidor Final'}</div>
          <div><strong>ATENDIDO POR:</strong> ${sale.cashier || 'Recepción'}</div>
          <div><strong>MÉTODO PAGO:</strong> ${sale.paymentMethod || 'Efectivo'}</div>
        </div>

        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        <div style="text-align: left; font-size: 11px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 4px;">
            <span>DESCRIPCIÓN</span>
            <span>TOTAL</span>
          </div>
          ${itemsHtml}
        </div>

        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        <div style="text-align: right; font-size: 12px;">
          <div>SUBTOTAL: ${settings.currency}${sale.subtotal.toFixed(2)}</div>
          <div>IVA (${settings.taxRate}%): ${settings.currency}${sale.tax.toFixed(2)}</div>
          <div style="font-size: 15px; font-weight: bold; margin-top: 4px;">
            TOTAL A PAGAR: ${settings.currency}${sale.total.toFixed(2)}
          </div>
        </div>

        <div style="border-top: 1px dashed #000; margin: 8px 0;"></div>
        <p style="margin: 8px 0 0; font-size: 11px; text-align: center;">${settings.ticketFooter}</p>
        <p style="margin: 4px 0 0; font-size: 9px; text-align: center;">*** Sistema ForzaGym Online - Pallatanga ***</p>
      </div>
    `;

    const cleanupPrintMode = () => document.body.classList.remove('printing-ticket');
    window.addEventListener('afterprint', cleanupPrintMode, { once: true });
    document.body.classList.add('printing-ticket');
    window.print();
  },

  // Print Member Credential / Digital Pass
  printMemberCard(member) {
    const settings = window.GymDB.data.settings;
    const plan = window.GymDB.getMembershipById(member.membershipId);
    const qrValue = String(member.qrCode || member.id);
    const qrCanvas = window.GymQR.generateCanvas(qrValue, { size: 720 });
    const qrImage = qrCanvas.toDataURL('image/png');
    const qrLabel = document.createElement('span');
    qrLabel.textContent = qrValue;

    const printWin = window.open('', '_blank', 'width=450,height=650');
    if (!printWin) {
      alert("Por favor permite ventanas emergentes para imprimir el carnet.");
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Carnet Digital - ${member.firstName} ${member.lastName}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f1f5f9;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          .credential-card {
            width: 320px;
            background: linear-gradient(145deg, #fffdfc, #f4f0ee);
            border: 2px solid #d15252;
            border-radius: 18px;
            padding: 24px;
            color: #1a1717;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          }
          .gym-logo {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #b73d3d;
            margin-bottom: 4px;
          }
          .gym-slogan {
            font-size: 9px;
            color: #5c5553;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
          }
          .avatar-box {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            border: 3px solid #d15252;
            margin: 0 auto 12px;
            overflow: hidden;
            background: #f0e7e4;
          }
          .avatar-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .member-name {
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 4px;
          }
          .member-id {
            font-size: 12px;
            color: #9f3939;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .badge-plan {
            background: #d8eee4;
            color: #1a1717;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            display: inline-block;
            margin-bottom: 16px;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 11px;
            background: #f0e7e4;
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 16px;
            text-align: left;
          }
          .meta-grid strong {
            display: block;
            color: #5c5553;
            font-size: 9px;
            text-transform: uppercase;
          }
          .qr-wrapper {
            background: #fff;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
          }
          .qr-wrapper img {
            display: block;
            width: 210px;
            height: 210px;
            image-rendering: pixelated;
          }
          .qr-value {
            color: #111827;
            font: 700 11px/1.3 Consolas, 'Courier New', monospace;
            overflow-wrap: anywhere;
          }
          .footer-note {
            font-size: 9px;
            color: #64748b;
            margin-top: 14px;
          }
          @media print {
            body { background: transparent; padding: 0; }
            .credential-card { box-shadow: none; border-color: #000; color: #000; background: #fff; }
            .gym-logo, .member-id { color: #000; }
            .badge-plan { border: 1px solid #000; color: #000; background: #eee; }
            .meta-grid { background: #eee; }
          }
        </style>
      </head>
      <body>
        <div class="credential-card">
          <div class="gym-logo">${settings.gymName}</div>
          <div class="gym-slogan">Pase Digital de Acceso</div>
          
          <div class="avatar-box">
            <img src="${member.avatar}" alt="${member.firstName}" />
          </div>

          <div class="member-name">${member.firstName} ${member.lastName}</div>
          <div class="member-id">ID: ${member.id} | DNI: ${member.dni}</div>
          
          <div class="badge-plan">${plan ? plan.name : 'Membresía General'}</div>

          <div class="meta-grid">
            <div>
              <strong>Vence el:</strong>
              ${member.endDate}
            </div>
            <div>
              <strong>Estado:</strong>
              ${member.status.toUpperCase()}
            </div>
          </div>

          <div class="qr-wrapper" id="print-qr">
            <img id="print-qr-image" src="${qrImage}" alt="Código QR de acceso" />
            <span class="qr-value">${qrLabel.innerHTML}</span>
          </div>

          <div class="footer-note">Presenta este código en el torniquete de recepción</div>
        </div>

        <script>
          const printQrImage = document.getElementById('print-qr-image');
          const printWhenReady = () => setTimeout(() => window.print(), 250);
          if (printQrImage.complete) {
            printWhenReady();
          } else {
            printQrImage.addEventListener('load', printWhenReady, { once: true });
          }
        <\/script>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  printVisitPassCard(plan) {
    if (!plan || !plan.code) {
      alert('No hay un código QR válido para imprimir.');
      return;
    }
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
    const settings = window.GymDB.data.settings;
    const qrCanvas = window.GymQR.generateCanvas(String(plan.code), { size: 720 });
    const qrImage = qrCanvas.toDataURL('image/png');
    const printWin = window.open('', '_blank', 'width=600,height=450');
    if (!printWin) {
      alert('Por favor permite ventanas emergentes para imprimir la tarjeta QR.');
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tarjeta QR - ${escapeHtml(plan.name)}</title>
        <style>
          * { box-sizing: border-box; }
          @page { size: 100mm 70mm; margin: 0; }
          html, body {
            width: 100%;
            min-height: 100%;
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #172331;
            background: #eef2f6;
          }
          body {
            min-height: 70mm;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8mm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .pass-card {
            width: 86mm;
            height: 54mm;
            padding: 4mm;
            display: flex;
            flex-direction: column;
            border: 0.5mm solid #cbd5df;
            border-top: 2mm solid #16866d;
            border-radius: 3mm;
            background: #fff;
            box-shadow: 0 2mm 6mm rgba(15, 23, 42, 0.12);
          }
          .brand {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 2mm;
            padding-bottom: 2mm;
            border-bottom: 0.3mm solid #dce3e9;
          }
          .gym-name {
            color: #153d35;
            font-size: 11pt;
            font-weight: 900;
            letter-spacing: 0.4mm;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .tag {
            color: #334155;
            font-size: 6.5pt;
            font-weight: 700;
            text-transform: uppercase;
            white-space: nowrap;
          }
          .content {
            flex: 1;
            min-height: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 3mm;
            padding-top: 2mm;
          }
          .details { min-width: 0; }
          .plan-label {
            margin-bottom: 1mm;
            color: #475569;
            font-size: 6.5pt;
            font-weight: 700;
            letter-spacing: 0.2mm;
            text-transform: uppercase;
          }
          .plan-name {
            margin: 0 0 2mm;
            color: #111827;
            font-size: 10pt;
            font-weight: 800;
            line-height: 1.15;
            overflow-wrap: anywhere;
          }
          .price {
            margin-bottom: 2mm;
            color: #145c4e;
            font-size: 12pt;
            font-weight: 900;
          }
          .code {
            color: #172331;
            font: 700 8pt/1.2 Consolas, 'Courier New', monospace;
            letter-spacing: 0.3mm;
          }
          .permanent {
            margin-top: 1mm;
            color: #475569;
            font-size: 6.5pt;
          }
          .qr-frame {
            width: 34mm;
            height: 34mm;
            flex: 0 0 34mm;
            display: grid;
            place-items: center;
            padding: 1mm;
            border: 0.3mm solid #d1d5db;
            background: #fff;
          }
          .qr-frame img { display: block; width: 100%; height: 100%; }
          .footer {
            padding-top: 1.5mm;
            border-top: 0.3mm solid #dce3e9;
            color: #334155;
            font-size: 6pt;
            font-weight: 600;
            text-align: center;
          }
          @media print {
            html, body { width: 100mm; height: 70mm; background: #fff; }
            body { min-height: 0; padding: 0; }
            .pass-card { flex: 0 0 86mm; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <main class="pass-card">
          <header class="brand">
            <span class="gym-name">${escapeHtml(settings.gymName || 'ForzaGym')}</span>
            <span class="tag">Pase de visita</span>
          </header>
          <section class="content">
            <div class="details">
              <div class="plan-label">Plan permanente</div>
              <h1 class="plan-name">${escapeHtml(plan.name)}</h1>
              <div class="price">${escapeHtml(settings.currency || '$')}${Number(plan.price).toFixed(2)}</div>
              <div class="code">${escapeHtml(plan.code)}</div>
              <div class="permanent">Sin fecha de caducidad</div>
            </div>
            <div class="qr-frame"><img src="${qrImage}" alt="Código QR del pase" /></div>
          </section>
          <footer class="footer">Presenta este QR en recepción para registrar tu visita</footer>
        </main>
        <script>
          const qrImage = document.querySelector('.qr-frame img');
          const printWhenReady = () => setTimeout(() => window.print(), 250);
          if (qrImage.complete) printWhenReady();
          else qrImage.addEventListener('load', printWhenReady, { once: true });
        <\/script>
      </body>
      </html>
    `);
    printWin.document.close();
  },

  // Export any array of objects to CSV
  exportToCSV(filename, rows) {
    if (!rows || !rows.length) {
      alert("No hay datos para exportar");
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

window.GymExporter = GymExporter;
