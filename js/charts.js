/**
 * PULSE GYM PRO - NATIVE INTERACTIVE CANVAS CHARTS
 * Pure HTML5 Canvas charts with zero external library dependency requirements.
 */

class GymChartEngine {
  // Render Income / Financial Chart (Bar Chart)
  static renderIncomeChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight || 280;

    // Clear
    ctx.clearRect(0, 0, width, height);

    const labels = ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'];
    const dataMemberships = [1200, 1450, 1900, 2100, 2400, 2850];
    const dataPOS = [300, 420, 580, 650, 780, 920];

    const maxVal = 4000;
    const padding = { top: 30, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';

    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(`$${val}`, 10, y + 4);
    }

    const colWidth = chartWidth / labels.length;
    const barWidth = Math.min(24, colWidth * 0.35);

    labels.forEach((label, idx) => {
      const xCenter = padding.left + colWidth * idx + colWidth / 2;

      // Membership Bar (Cyan gradient)
      const h1 = (dataMemberships[idx] / maxVal) * chartHeight;
      const y1 = height - padding.bottom - h1;
      const grad1 = ctx.createLinearGradient(0, y1, 0, height - padding.bottom);
      grad1.addColorStop(0, '#00f2fe');
      grad1.addColorStop(1, '#0284c7');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.roundRect(xCenter - barWidth - 2, y1, barWidth, h1, [4, 4, 0, 0]);
      ctx.fill();

      // POS Bar (Pink gradient)
      const h2 = (dataPOS[idx] / maxVal) * chartHeight;
      const y2 = height - padding.bottom - h2;
      const grad2 = ctx.createLinearGradient(0, y2, 0, height - padding.bottom);
      grad2.addColorStop(0, '#ff3366');
      grad2.addColorStop(1, '#be123c');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.roundRect(xCenter + 2, y2, barWidth, h2, [4, 4, 0, 0]);
      ctx.fill();

      // Label X
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText(label, xCenter, height - 15);
    });
  }

  // Render Peak Attendance Hours (Area / Line Chart)
  static renderPeakHoursChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight || 280;

    ctx.clearRect(0, 0, width, height);

    const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const occupancy = [25, 68, 42, 30, 20, 48, 95, 82, 35]; // in members

    const maxVal = 100;
    const padding = { top: 30, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    const step = chartWidth / (hours.length - 1);
    const points = occupancy.map((val, idx) => ({
      x: padding.left + idx * step,
      y: height - padding.bottom - (val / maxVal) * chartHeight
    }));

    // Area gradient
    const areaGrad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    areaGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    areaGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    points.forEach((p, idx) => {
      if (idx === 0) ctx.lineTo(p.x, p.y);
      else {
        const prev = points[idx - 1];
        const cx = (prev.x + p.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, p.y, p.x, p.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else {
        const prev = points[idx - 1];
        const cx = (prev.x + p.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, p.y, p.x, p.y);
      }
    });
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Points & Labels
    points.forEach((p, idx) => {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0a0e17';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.font = '10px sans-serif';
      ctx.fillText(hours[idx], p.x, height - 15);
    });
  }

  // Render Plan Distribution (Doughnut Chart)
  static renderPlansDoughnut(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = Math.min(canvas.parentElement.clientWidth, 220);
    canvas.width = size;
    canvas.height = size;

    const data = [
      { label: 'Mensual PRO', val: 45, color: '#8b5cf6' },
      { label: 'Anual Elite', val: 25, color: '#ff3366' },
      { label: 'Trimestral', val: 20, color: '#f59e0b' },
      { label: 'Estándar', val: 10, color: '#10b981' }
    ];

    const total = data.reduce((acc, cur) => acc + cur.val, 0);
    let startAngle = -Math.PI / 2;
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.42;
    const innerRadius = size * 0.26;

    ctx.clearRect(0, 0, size, size);

    data.forEach(item => {
      const sliceAngle = (item.val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('100%', centerX, centerY - 8);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Distribución', centerX, centerY + 10);
  }
}

window.GymChartEngine = GymChartEngine;
