const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 512,
    height: 512,
    show: false,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      offscreen: true,
    },
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 512px;
      height: 512px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 512px;
      height: 512px;
    }
  </style>
</head>
<body>
  <canvas id="c" width="512" height="512"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cx = 256;
    const cy = 256;

    // Helper: draw rounded rect squircle
    function drawSquircle(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    // 1. App Tile Background
    drawSquircle(16, 16, 480, 480, 96);
    const bgGrad = ctx.createRadialGradient(256, 200, 30, 256, 256, 320);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.55, '#090d16');
    bgGrad.addColorStop(1, '#030712');
    ctx.fillStyle = bgGrad;
    ctx.fill();

    // Subtle border glow
    ctx.lineWidth = 6;
    const borderGrad = ctx.createLinearGradient(16, 16, 496, 496);
    borderGrad.addColorStop(0, 'rgba(6, 182, 212, 0.85)');
    borderGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.6)');
    borderGrad.addColorStop(1, 'rgba(6, 182, 212, 0.4)');
    ctx.strokeStyle = borderGrad;
    ctx.stroke();

    // 2. Radar Grid Rings
    const ringRadii = [190, 135, 80];
    const ringOpacities = [0.35, 0.45, 0.55];

    ringRadii.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = \`rgba(6, 182, 212, \${ringOpacities[idx]})\`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });

    // 3. Coordinate Crosshairs
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
    ctx.lineWidth = 2;
    // Horiz
    ctx.moveTo(cx - 190, cy);
    ctx.lineTo(cx + 190, cy);
    // Vert
    ctx.moveTo(cx, cy - 190);
    ctx.lineTo(cx, cy + 190);
    ctx.stroke();

    // Crosshair tick marks
    [40, 80, 120, 160].forEach(d => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 1.5;
      // top/bottom ticks
      ctx.moveTo(cx - 5, cy - d); ctx.lineTo(cx + 5, cy - d);
      ctx.moveTo(cx - 5, cy + d); ctx.lineTo(cx + 5, cy + d);
      // left/right ticks
      ctx.moveTo(cx - d, cy - 5); ctx.lineTo(cx - d, cy + 5);
      ctx.moveTo(cx + d, cy - 5); ctx.lineTo(cx + d, cy + 5);
      ctx.stroke();
    });

    // 4. Sweeping Radar Beam (Sector Gradient)
    const sweepStart = -Math.PI * 0.5; // -90 deg (12 o'clock)
    const sweepEnd = -Math.PI * 0.15;  // -27 deg (~1:30 o'clock)

    const sectorGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 190);
    sectorGrad.addColorStop(0, 'rgba(34, 211, 238, 0.45)');
    sectorGrad.addColorStop(1, 'rgba(6, 182, 212, 0.12)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 190, sweepStart, sweepEnd, false);
    ctx.closePath();
    ctx.fillStyle = sectorGrad;
    ctx.fill();
    ctx.restore();

    // Leading Sweep Line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 190 * Math.cos(sweepEnd), cy + 190 * Math.sin(sweepEnd));
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // 5. Macro Catalyst Target Blip (Red Alert)
    const blipX = cx + 115 * Math.cos(-Math.PI * 0.28);
    const blipY = cy + 115 * Math.sin(-Math.PI * 0.28);

    // Outer Ping Wave
    ctx.beginPath();
    ctx.arc(blipX, blipY, 20, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Blip Core
    ctx.beginPath();
    ctx.arc(blipX, blipY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Blip Highlight center
    ctx.beginPath();
    ctx.arc(blipX - 2, blipY - 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fee2e2';
    ctx.fill();

    // Secondary Target Blip (Emerald/Cyan flow)
    const blip2X = cx - 110;
    const blip2Y = cy + 65;
    ctx.beginPath();
    ctx.arc(blip2X, blip2Y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 6. Bullseye Center
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  </script>
</body>
</html>
  `;

  await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

  // Allow canvas rendering to complete
  await new Promise(resolve => setTimeout(resolve, 500));

  const image = await win.capturePage();
  const png512 = image.toPNG();

  // Create DIB entries helper
  function createDIB(img, size) {
    const resized = img.resize({ width: size, height: size });
    const raw = resized.toBitmap(); // BGRA
    const header = Buffer.alloc(40);
    header.writeUInt32LE(40, 0); // biSize
    header.writeInt32LE(size, 4); // biWidth
    header.writeInt32LE(size * 2, 8); // biHeight (XOR + AND mask)
    header.writeUInt16LE(1, 12); // biPlanes
    header.writeUInt16LE(32, 14); // biBitCount
    header.writeUInt32LE(0, 16); // biCompression
    header.writeUInt32LE(size * size * 4, 20); // biSizeImage

    // DIB rows are bottom-to-top
    const xorMask = Buffer.alloc(size * size * 4);
    const rowBytes = size * 4;
    for (let y = 0; y < size; y++) {
      const srcY = size - 1 - y;
      raw.copy(xorMask, y * rowBytes, srcY * rowBytes, (srcY + 1) * rowBytes);
    }

    const andRowBytes = Math.ceil(size / 32) * 4;
    const andMask = Buffer.alloc(andRowBytes * size, 0);

    return Buffer.concat([header, xorMask, andMask]);
  }

  // Multi-resolution ICO: 256, 128, 64, 48, 32, 16
  const sizes = [256, 128, 64, 48, 32, 16];
  const dibs = sizes.map(size => ({
    size,
    buffer: createDIB(image, size),
  }));

  const numImages = dibs.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dataStartOffset = headerSize + dirEntrySize * numImages;

  const icoHeader = Buffer.alloc(headerSize);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type 1 = Icon
  icoHeader.writeUInt16LE(numImages, 4); // Count

  let currentOffset = dataStartOffset;
  const dirEntries = [];
  const imageBuffers = [];

  for (const { size, buffer } of dibs) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // bWidth (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1); // bHeight (0 = 256)
    entry.writeUInt8(0, 2); // bColorCount
    entry.writeUInt8(0, 3); // bReserved
    entry.writeUInt16LE(1, 4); // wPlanes
    entry.writeUInt16LE(32, 6); // wBitCount
    entry.writeUInt32LE(buffer.length, 8); // dwBytesInRes
    entry.writeUInt32LE(currentOffset, 12); // dwImageOffset

    dirEntries.push(entry);
    imageBuffers.push(buffer);
    currentOffset += buffer.length;
  }

  const icoBuffer = Buffer.concat([icoHeader, ...dirEntries, ...imageBuffers]);

  // Ensure directories exist
  const dirs = [
    path.join(__dirname, '../build'),
    path.join(__dirname, '../public'),
    path.join(__dirname, '../electron'),
  ];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // Save icon.png and icon.ico to build, public, and electron
  for (const dir of dirs) {
    fs.writeFileSync(path.join(dir, 'icon.png'), png512);
    fs.writeFileSync(path.join(dir, 'icon.ico'), icoBuffer);
  }

  console.log('SUCCESS: Icons generated successfully at build/, public/, electron/');
  app.quit();
});
