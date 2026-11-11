/* ── Scene helpers (logical canvas 960×540) ───────────────────────────── */
const SCENES = {};
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, p) => a + (b - a) * p;
const eo = p => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));            // expo.out
const eio = p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2); // cubic in-out
const eioX = p => (p <= 0 ? 0 : p >= 1 ? 1 : p < .5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2);
const p4 = p => 1 - Math.pow(1 - clamp(p), 4);
const smooth = (a, b, x) => { const p = clamp((x - a) / (b - a)); return p * p * (3 - 2 * p); };
const stepq = (p, n) => Math.floor(clamp(p) * n) / n;
const hash3 = (a, b, c) => ((Math.imul(a | 0, 2654435761) ^ Math.imul(b | 0, 40503) ^ Math.imul(c | 0, 2246822519)) >>> 0);
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const F = (w, size, fam) => `${w} ${size}px "${fam}", system-ui, sans-serif`;
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
function mix(h1, h2, p) {
  const a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
  const c = [16, 8, 0].map(s => Math.round(lerp(a >> s & 255, b >> s & 255, p)));
  return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
}
/* tracked text: o = {font, fill, stroke, lw, track, align, base, glow, gc, alpha} */
function txt(c, s, x, y, o = {}) {
  c.save();
  c.font = o.font || '16px sans-serif';
  c.textBaseline = o.base || 'alphabetic';
  if (o.alpha != null) c.globalAlpha *= o.alpha;
  if (o.glow) { c.shadowBlur = o.glow; c.shadowColor = o.gc || o.fill || '#fff'; }
  const tr = o.track || 0, al = o.align || 'left';
  const chars = [...s], ws = chars.map(ch => c.measureText(ch).width);
  const total = ws.reduce((a, b) => a + b, 0) + tr * (chars.length - 1);
  let cx = al === 'center' ? x - total / 2 : al === 'right' ? x - total : x;
  c.textAlign = 'left';
  chars.forEach((ch, i) => {
    if (o.stroke) { c.lineWidth = o.lw || 1; c.strokeStyle = o.stroke; c.lineJoin = 'round'; c.strokeText(ch, cx, y); }
    if (o.fill) { c.fillStyle = o.fill; c.fillText(ch, cx, y); }
    cx += ws[i] + tr;
  });
  c.restore();
  return total;
}
function tw(c, s, font, tr = 0) { c.save(); c.font = font; const w = [...s].reduce((a, ch) => a + c.measureText(ch).width, 0) + tr * ([...s].length - 1); c.restore(); return w; }
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function vignette(c, W, H, a, col = '0,0,0') {
  const g = c.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, W * .72);
  g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`);
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function scanlines(c, W, H, a) { c.fillStyle = `rgba(0,0,0,${a})`; for (let y = 0; y < H; y += 3) c.fillRect(0, y, W, 1); }
let GRAIN = null;
function grain(c, W, H, a, t, animate) {
  if (!GRAIN) {
    GRAIN = document.createElement('canvas'); GRAIN.width = GRAIN.height = 192;
    const g = GRAIN.getContext('2d'), im = g.createImageData(192, 192), R = rng(7);
    for (let i = 0; i < im.data.length; i += 4) { const v = R() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0);
  }
  c.save(); c.globalAlpha = a; c.globalCompositeOperation = 'overlay';
  const ox = animate ? (hash3(Math.floor(t * 24), 1, 2) % 192) : 0, oy = animate ? (hash3(Math.floor(t * 24), 3, 4) % 192) : 0;
  for (let x = -ox; x < W; x += 192) for (let y = -oy; y < H; y += 192) c.drawImage(GRAIN, x, y);
  c.restore();
}
let SPRITE = null;
function sprite() {
  if (!SPRITE) {
    SPRITE = document.createElement('canvas'); SPRITE.width = SPRITE.height = 128;
    const g = SPRITE.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.45, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  }
  return SPRITE;
}
/* perspective floor grid (shared by TX-01 and TX-07) */
function floorGrid(c, W, H, hy, ph, col, a, glow) {
  c.save(); c.beginPath(); c.rect(0, hy, W, H - hy); c.clip();
  c.strokeStyle = col;
  const pass = (lw, al) => {
    c.lineWidth = lw;
    for (let i = 0; i < 26; i++) { const z = i + 1 - ph; const y = hy + 280 / z; if (y > H + 4) continue; c.globalAlpha = al * clamp((y - hy) / 140); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    for (let k = -18; k <= 18; k++) { c.globalAlpha = al * .85; c.beginPath(); c.moveTo(W / 2 + k * 7, hy); c.lineTo(W / 2 + k * 140, H + 60); c.stroke(); }
  };
  if (glow) pass(4, a * .22);
  pass(1, a);
  c.restore();
}
/* polyline helpers */
function polyLen(pts) { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return L; }
function polyAt(pts, L, d) {
  const tot = L[L.length - 1]; d = ((d % tot) + tot) % tot;
  let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const seg = L[i] - L[i - 1] || 1, p = (d - L[i - 1]) / seg;
  return [lerp(pts[i - 1][0], pts[i][0], p), lerp(pts[i - 1][1], pts[i][1], p), Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])];
}
function sevenSeg(c, ch, x, y, w, h, on, off) {
  const S = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcfgd' }[ch] || '';
  const t = w * .16, segs = {
    a: [x + t, y, w - 2 * t, t], d: [x + t, y + h - t, w - 2 * t, t], g: [x + t, y + h / 2 - t / 2, w - 2 * t, t],
    f: [x, y + t, t, h / 2 - t * 1.2], b: [x + w - t, y + t, t, h / 2 - t * 1.2],
    e: [x, y + h / 2 + t * .2, t, h / 2 - t * 1.2], c: [x + w - t, y + h / 2 + t * .2, t, h / 2 - t * 1.2]
  };
  for (const k in segs) { c.fillStyle = S.includes(k) ? on : off; const [a, b, d, e] = segs[k]; c.fillRect(a, b, d, e); }
}


/* ── v2 additions: shared sample data, beat envelopes, transitions ───── */
const SAMPLE = {
  bars: [62, 84, 48, 91, 70, 56], cats: ['N1', 'N2', 'N3', 'N4', 'N5', 'N6'],
  line: [.32, .38, .35, .47, .52, .49, .61, .66, .63, .74, .79, .86],
  share: [34, 22, 31, 13], kpi: 87.4
};
const pin = (B, d, delay = 0) => clamp((B.t - delay) / d);          // 0→1 entering
const pout = (B, d) => clamp((B.t - (B.d - d)) / d);                // 0→1 leaving
const env = (B, a = .6, b = .5) => pin(B, a) * (1 - pout(B, b));
/* eat-away cells (shard-out / dissolve). p 0..1 */
function cells(c, p, x, y, w, h, cell, col, seed, shard) {
  if (p <= 0) return;
  const nx = Math.ceil(w / cell), ny = Math.ceil(h / cell);
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const r = (hash3(i, j, seed) % 1000) / 1000;
    if (r < p) {
      c.fillStyle = col; c.fillRect(x + i * cell, y + j * cell, cell + .6, cell + .6);
      if (shard && p - r < .12) { c.fillStyle = shard; const k = (p - r) / .12; c.globalAlpha = 1 - k; c.fillRect(x + i * cell + cell * .25, y + j * cell - k * 60, cell * .5, cell * .5); c.globalAlpha = 1; }
    }
  }
}
/* copy horizontal slices of what is already drawn, shifted sideways (VHS roll, glitch) */
function sliceShift(c, s, y, h, dx) {
  const k = s.k || 1, cv = c.canvas; if (!cv || !cv.width) return;
  const sy = Math.max(0, Math.round(y * k)), sh = Math.max(1, Math.min(cv.height - sy, Math.round(h * k)));
  if (sh <= 0 || sy >= cv.height) return;
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(cv, 0, sy, cv.width, sh, Math.round(dx * k), sy, cv.width, sh); c.restore();
}
function noiseBand(c, y, h, t, a, W = 960) {
  for (let i = 0; i < 18; i++) { c.fillStyle = `rgba(220,220,220,${a * (.4 + (hash3(i, Math.floor(t * 30), 2) % 60) / 100)})`; c.fillRect(hash3(i, Math.floor(t * 30), 8) % W, y + (i % 6) * (h / 6), 30 + hash3(i, 1, Math.floor(t * 30)) % 220, Math.max(1, h / 9)); }
}
function cursor(c, x, y, press) {
  c.save(); c.translate(x, y); if (press) c.scale(.9, .9);
  c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 20); c.lineTo(5, 15); c.lineTo(9, 24); c.lineTo(12, 23); c.lineTo(8, 14); c.lineTo(15, 14); c.closePath();
  c.fillStyle = '#fff'; c.fill(); c.strokeStyle = '#000'; c.lineWidth = 1.4; c.stroke(); c.restore();
}
/* cursor path: from a to b with ease, returns [x,y] */
const glide = (a, b, p) => [lerp(a[0], b[0], eio(clamp(p))), lerp(a[1], b[1], eio(clamp(p)))];
function rectPerim(c, x, y, w, h, p) {   // draw a rect outline progressively, clockwise from top-left
  const L = 2 * (w + h); let d = L * clamp(p); c.beginPath(); c.moveTo(x, y);
  const seg = [[w, 0], [0, h], [-w, 0], [0, -h]]; let cx = x, cy = y;
  for (const [dx, dy] of seg) { const l = Math.abs(dx + dy); const u = Math.min(1, d / l); cx += dx * u; cy += dy * u; c.lineTo(cx, cy); d -= l; if (d <= 0) break; }
  c.stroke();
}
function countTo(v, p, dec = 0) { return (v * clamp(p)).toFixed(dec); }
