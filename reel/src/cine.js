/* ── v4 lens & film layer: textures, title sheen, per-theme cinema settings ── */
let DIRT = null, GRAINS = null;
function dirtTex() {
  if (DIRT) return DIRT;
  DIRT = document.createElement('canvas'); DIRT.width = 480; DIRT.height = 270;
  const g = DIRT.getContext('2d'), R = rng(4242);
  g.fillStyle = '#000'; g.fillRect(0, 0, 480, 270);
  for (let i = 0; i < 110; i++) { const x = R() * 480, y = R() * 270, r = 2 + Math.pow(R(), 2.2) * 38, a = .06 + R() * .32, gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(.65, `rgba(255,255,255,${a * .55})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  for (let i = 0; i < 16; i++) { const x = R() * 480, y = R() * 270, r = 8 + R() * 20, rot = R(); g.strokeStyle = `rgba(255,255,255,${.08 + R() * .14})`; g.lineWidth = 1 + R() * 1.5; g.beginPath();
    for (let k = 0; k <= 6; k++) { const a = rot + k / 6 * TAU; k ? g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : g.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.stroke(); }
  for (let i = 0; i < 9; i++) { const x = R() * 480, y = R() * 270; g.save(); g.translate(x, y); g.rotate(R() * TAU); g.scale(1, .12 + R() * .2); const gr = g.createRadialGradient(0, 0, 0, 0, 0, 60 + R() * 80); gr.addColorStop(0, `rgba(255,255,255,${.1 + R() * .12})`); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 140, 0, TAU); g.fill(); g.restore(); }
  return DIRT;
}
function grainTex(i) {
  if (!GRAINS) {
    GRAINS = [0, 1, 2].map(k => { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'), im = g.createImageData(256, 256), R = rng(900 + k);
      for (let p = 0; p < im.data.length; p += 4) { const v = 128 + ((R() + R() + R() - 1.5) * 120); im.data[p] = im.data[p + 1] = im.data[p + 2] = v; im.data[p + 3] = 255; }
      g.putImageData(im, 0, 0); return cv; });
  }
  return GRAINS[i % 3];
}
/* a bright band that travels across a title, with a small flare riding it */
function sheenText(c, o, p) {
  if (p <= 0 || p >= 1) return;
  const size = parseFloat(o.font.split(' ')[1]) || 40, wd = tw(c, o.str, o.font, o.tr || 0);
  const x0 = o.al === 'center' ? o.x - wd / 2 : o.al === 'right' ? o.x - wd : o.x;
  const gx0 = x0 - 90, gx1 = x0 + wd + 90, u = eio(p);
  const g = c.createLinearGradient(gx0, o.y - size, gx1, o.y + size * .3);
  g.addColorStop(0, rgba(o.col, 0)); g.addColorStop(clamp(u - .1), rgba(o.col, 0)); g.addColorStop(clamp(u - .02), rgba(o.col, .55)); g.addColorStop(u, rgba(o.col, .95)); g.addColorStop(clamp(u + .02), rgba(o.col, .55)); g.addColorStop(clamp(u + .1), rgba(o.col, 0)); g.addColorStop(1, rgba(o.col, 0));
  c.save(); c.globalCompositeOperation = 'lighter'; txt(c, o.str, o.x, o.y, { font: o.font, fill: g, track: o.tr || 0, align: o.al || 'left' }); c.restore();
  const fx = lerp(gx0, gx1, u); if (fx > x0 - 10 && fx < x0 + wd + 10) flare(c, fx, o.y - size * .38, Math.min(220, 60 + size * 1.6), o.col, .4 * Math.sin(Math.PI * p));
}

const CINE = {
  'TX-01': { grade: { f: 'contrast(1.08) saturate(1.12)', tint: ['#0A5A78', .18], lift: ['#06202E', .10] }, rays: { x: 480, y: 250, a: .55 }, dirt: .45, ca: 2.2, focus: .5,
    sheen: [{ b: 0, at: 1.6, dur: 1.1, str: 'VECTOR GRID', x: 480, y: 140, font: F(700, 60, 'Orbitron'), tr: 14, al: 'center', col: '#FFFFFF' }] },
  'TX-02': { grade: { f: 'contrast(1.1) saturate(1.05)', tint: ['#0B6E2A', .2] }, rays: { x: 480, y: 252, a: .3 }, dirt: .2, ca: 1.4,
    sheen: [{ b: 0, at: 2, dur: 1, str: 'PHOSPHOR RAIN', x: 480, y: 252, font: F(400, 54, 'Share Tech Mono'), tr: 8, al: 'center', col: '#E8FFE8' }] },
  'TX-03': { grade: { f: 'contrast(1.06) saturate(1.08)', tint: ['#0E3A5A', .18] }, rays: { x: 480, y: 290, a: .3 }, dirt: .3, ca: 1.2,
    sheen: [{ b: 0, at: 1.8, dur: .9, str: 'GLASS HUD', x: 40, y: 62, font: F(600, 30, 'Chakra Petch'), tr: 4, al: 'left', col: '#FFFFFF' }] },
  'TX-04': { grade: { f: 'contrast(1.12) saturate(1.15)', tint: ['#0B4A55', .22], lift: ['#1A0A18', .08] }, rays: { x: 300, y: 262, a: .7 }, dirt: .6, ca: 2.4, halo: ['#FF2E88', .35],
    sheen: [{ b: 0, at: 1.4, dur: 1.3, str: 'RAINLIGHT NOIR', x: 60, y: 292, font: F(600, 76, 'Saira Condensed'), tr: 6, al: 'left', col: '#FFE0EE' }] },
  'TX-05': { grade: { f: 'contrast(1.12) saturate(1.25)' }, ca: 3.5,
    sheen: [{ b: 0, at: 1.4, dur: .8, str: 'STUTTER BROADCAST', x: 480, y: 76, font: F(400, 40, 'Bungee'), tr: 2, al: 'center', col: '#FFFFFF' }] },
  'TX-06': { grade: { f: 'contrast(1.06) saturate(.92) sepia(.12)', tint: ['#183848', .16], lift: ['#2A1408', .12] }, rays: { x: 820, y: 110, a: .35 }, halo: ['#FF3A2A', .5], dirt: .25, ca: 1.4, grain: .07 },
  'TX-07': { grade: { f: 'contrast(1.1) saturate(1.2)', tint: ['#5A1A6A', .16] }, rays: { x: 480, y: 290, a: .75 }, dirt: .65, ca: 2.0, halo: ['#FF2A6D', .3],
    sheen: [{ b: 0, at: 1.2, dur: 1.2, str: 'NIGHT DRIVE', x: 480, y: 136, font: F(400, 66, 'Monoton'), tr: 6, al: 'center', col: '#FFFFFF' }] },
  'TX-08': { grade: { f: 'contrast(1.1) saturate(1.05)', tint: ['#0A3A12', .18] }, rays: { x: 480, y: 270, a: .18 }, ca: 1.6,
    sheen: [{ b: 0, at: 2, dur: 1, str: 'COLD STORAGE', x: 64, y: 94, font: F(400, 26, 'Michroma'), tr: 6, al: 'left', col: '#E8FFE8' }] },
  'TX-09': { grade: { f: 'contrast(1.08) saturate(1.08)', tint: ['#10204A', .18] }, rays: { x: 480, y: 470, a: .5 }, dirt: .4, halo: ['#FFB040', .25], ca: 1.2,
    sheen: [{ b: 1, at: 1.3, dur: 1.1, str: 'THE OPEN CHANNEL', x: 480, y: 300, font: F(700, 62, 'Oswald'), tr: 5, al: 'center', col: '#FFF4D0' }] },
  'TX-10': { grade: { f: 'contrast(1.08) saturate(.9) sepia(.1)', lift: ['#3A2A18', .08] }, grain: .06, focus: .7,
    sheen: [{ b: 0, at: 3.6, dur: 1.6, str: '2.4B', x: 480, y: 336, font: F(700, 210, 'Syncopate'), tr: 4, al: 'center', col: '#FFF3DC' }] },
  'TX-11': { grade: { f: 'contrast(1.15) saturate(1.25)', tint: ['#0E5A66', .14], lift: ['#3A1404', .08] }, rays: { x: 480, y: 300, a: .45 }, dirt: .4, ca: 2.6,
    sheen: [{ b: 0, at: .9, dur: .9, str: 'WASTELAND CHROME', x: 480, y: 332, font: F(400, 92, 'Anton'), tr: 3, al: 'center', col: '#FFFFFF' }] },
  'TX-12': { grade: { f: 'contrast(1.1) saturate(1.1)', tint: ['#101A40', .15] }, rays: { x: 480, y: 270, a: .8 }, dirt: .55, ca: 2.2, halo: ['#F2A65A', .25], focus: .9 },
  'TX-13': { grade: { f: 'contrast(1.08) saturate(1.05) sepia(.08)', tint: ['#3A2410', .14] }, rays: { x: 260, y: 420, a: .3 }, halo: ['#FFAA50', .3], dirt: .2,
    sheen: [{ b: 0, at: 2.4, dur: 1.3, str: 'CLOCKWORK REALM', x: 480, y: 66, font: F(600, 36, 'Cinzel'), tr: 8, al: 'center', col: '#FFE6A8' }] },
  'TX-14': { grade: { f: 'contrast(1.05) saturate(.95) sepia(.1)' }, grain: .05 },
  'TX-15': { grade: { f: 'contrast(1.03) saturate(1.05)', lift: ['#3A3020', .05] }, focus: .6 },
  'TX-16': { grade: { f: 'contrast(1.06) saturate(1.06)' }, grain: .04 },
  'TX-17': { grade: { f: 'contrast(1.1) saturate(1.05)', tint: ['#3A2A08', .14] }, rays: { x: 480, y: 150, a: .4 }, dirt: .4, halo: ['#FFC060', .22], ca: 1.6, focus: .8,
    sheen: [{ b: 0, at: 2.8, dur: 1.4, str: 'SILHOUETTE & SMOKE', x: 480, y: 278, font: F(500, 44, 'Bodoni Moda'), tr: 4, al: 'center', col: '#FFF4D0' }] },
  'TX-18': { grade: { f: 'contrast(1.08) saturate(1.2)' }, ca: 2.8 },
  'TX-19': { grade: { f: 'contrast(1.02) saturate(1.04)', lift: ['#3A2028', .05] } },
  'TX-20': { grade: { f: 'contrast(1.04) saturate(.85) hue-rotate(-6deg)', tint: ['#2E6F5E', .08] }, focus: .5 }
};
