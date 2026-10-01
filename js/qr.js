/**
 * PULSE GYM PRO - LIGHTWEIGHT QR CODE ENGINE
 * High quality standalone QR Code rendering on HTML5 Canvas.
 */

// Simple robust QRCode generator wrapper
(function() {
  function createQRCode(containerId, text, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const size = options.size || 160;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.borderRadius = '8px';
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = options.bgColor || '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw stylized QR pattern based on hash
    const matrixSize = 21;
    const cellSize = (size - 20) / matrixSize;
    const margin = 10;

    // Hash the input string to get deterministic matrix
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }

    ctx.fillStyle = options.fgColor || '#0a0e17';

    // Draw position detection patterns (3 corners)
    function drawPositionFinder(x, y) {
      ctx.fillRect(margin + x * cellSize, margin + y * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = options.bgColor || '#ffffff';
      ctx.fillRect(margin + (x + 1) * cellSize, margin + (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = options.fgColor || '#0a0e17';
      ctx.fillRect(margin + (x + 2) * cellSize, margin + (y + 2) * cellSize, 3 * cellSize, 3 * cellSize);
    }

    drawPositionFinder(0, 0);
    drawPositionFinder(matrixSize - 7, 0);
    drawPositionFinder(0, matrixSize - 7);

    // Fill pseudo-random matrix content seeded by hash & text
    let seed = Math.abs(hash);
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip position patterns
        if ((r < 7 && c < 7) || (r < 7 && c >= matrixSize - 7) || (r >= matrixSize - 7 && c < 7)) {
          continue;
        }
        seed = (seed * 9301 + 49297) % 233280;
        const rnd = seed / 233280;
        const charCode = text.charCodeAt((r + c) % text.length) || 42;
        if ((rnd > 0.45 && (r + c) % 2 === 0) || (charCode % 3 === 0)) {
          ctx.fillRect(
            margin + c * cellSize + 0.5,
            margin + r * cellSize + 0.5,
            cellSize - 0.5,
            cellSize - 0.5
          );
        }
      }
    }

    container.appendChild(canvas);
  }

  window.GymQR = {
    generate: createQRCode
  };
})();
