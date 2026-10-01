/**
 * PULSE GYM PRO - TICKET & DIGITAL PASS PRINTER / EXPORTER
 * Formats thermal receipt printouts, printable credentials, and CSV exports.
 */

const GymExporter = {
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

    window.print();
  },

  // Print Member Credential / Digital Pass
  printMemberCard(member) {
    const settings = window.GymDB.data.settings;
    const plan = window.GymDB.getMembershipById(member.membershipId);

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
            background: linear-gradient(145deg, #090e1a, #162444);
            border: 2px solid #00f2fe;
            border-radius: 18px;
            padding: 24px;
            color: #fff;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          }
          .gym-logo {
            font-size: 18px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #00f2fe;
            margin-bottom: 4px;
          }
          .gym-slogan {
            font-size: 9px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
          }
          .avatar-box {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            border: 3px solid #00f2fe;
            margin: 0 auto 12px;
            overflow: hidden;
            background: #1e293b;
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
            color: #00f2fe;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .badge-plan {
            background: #10b981;
            color: #fff;
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
            background: rgba(255,255,255,0.06);
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 16px;
            text-align: left;
          }
          .meta-grid strong {
            display: block;
            color: #94a3b8;
            font-size: 9px;
            text-transform: uppercase;
          }
          .qr-wrapper {
            background: #fff;
            padding: 10px;
            border-radius: 12px;
            display: inline-block;
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

          <div class="qr-wrapper" id="print-qr"></div>

          <div class="footer-note">Presenta este código en el torniquete de recepción</div>
        </div>

        <script>
          // Draw quick QR pattern on print
          const canvas = document.createElement('canvas');
          canvas.width = 120;
          canvas.height = 120;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0,0,120,120);
          ctx.fillStyle = '#000000';
          
          // Pattern
          ctx.fillRect(10, 10, 30, 30);
          ctx.fillRect(80, 10, 30, 30);
          ctx.fillRect(10, 80, 30, 30);
          ctx.clearRect(16, 16, 18, 18);
          ctx.clearRect(86, 16, 18, 18);
          ctx.clearRect(16, 86, 18, 18);
          ctx.fillRect(20, 20, 10, 10);
          ctx.fillRect(90, 20, 10, 10);
          ctx.fillRect(20, 90, 10, 10);

          for(let r=0; r<10; r++) {
            for(let c=0; c<10; c++) {
              if(Math.random() > 0.5) {
                ctx.fillRect(45 + (c*3), 10 + (r*10), 2.5, 2.5);
              }
            }
          }
          document.getElementById('print-qr').appendChild(canvas);

          setTimeout(() => {
            window.print();
          }, 400);
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
