/* ── v3 finishing layer: per-theme post config + signature effects ───── */
function flare(c, x, y, len, col, a, core = true) {
  if (a <= 0) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  const g = c.createLinearGradient(x - len, 0, x + len, 0); g.addColorStop(0, rgba(col, 0)); g.addColorStop(.5, rgba(col, a)); g.addColorStop(1, rgba(col, 0));
  c.fillStyle = g; c.fillRect(x - len, y - 1.2, len * 2, 2.4); c.globalAlpha = .45; c.fillRect(x - len * .6, y - 4, len * 1.2, 8); c.globalAlpha = 1;
  if (core) { const r = Math.max(6, len * .16), rg = c.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(255,255,255,${Math.min(1, a * 1.1)})`); rg.addColorStop(.35, rgba(col, a * .6)); rg.addColorStop(1, rgba(col, 0)); c.fillStyle = rg; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }
  c.restore();
}
function rays(c, x, y, n, len, col, a, t, a0, a1, mode = 'screen') {
  c.save(); c.globalCompositeOperation = mode;
  for (let i = 0; i < n; i++) {
    const ang = lerp(a0, a1, (i + .5) / n) + Math.sin(t * .17 + i * 1.3) * .035, w = .022 + (hash3(i, 9, 9) % 100) / 100 * .045;
    const g = c.createRadialGradient(x, y, 0, x, y, len); g.addColorStop(0, rgba(col, a * (.55 + .45 * Math.sin(t * .45 + i * 1.7)))); g.addColorStop(1, rgba(col, 0));
    c.fillStyle = g; c.beginPath(); c.moveTo(x, y); c.arc(x, y, len, ang - w, ang + w); c.closePath(); c.fill();
  }
  c.restore();
}
function sparks(c, x, y, t, n, col, seed, dir = -Math.PI / 2, spread = 1.4, speed = 90, grav = 80) {
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const l = (t * (1.2 + (hash3(i, seed, 4) % 60) / 100) + (hash3(i, seed, 1) % 1000) / 1000) % 1;
    const a = dir + ((hash3(i, seed, 2) % 1000) / 1000 - .5) * spread, v = speed * (.5 + (hash3(i, seed, 3) % 100) / 100);
    const px = x + Math.cos(a) * v * l, py = y + Math.sin(a) * v * l + grav * l * l;
    c.fillStyle = rgba(col, (1 - l) * .95); c.fillRect(px - 1, py - 1, 2.2, 2.2);
  }
  c.restore();
}
function motes(c, x0, y0, w, h, t, n, col, a, seed, drift = [6, -4]) {
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const fx = (hash3(i, seed, 1) % 1000) / 1000, fy = (hash3(i, seed, 2) % 1000) / 1000, ph = (hash3(i, seed, 3) % 628) / 100;
    const x = x0 + ((fx * w + t * drift[0] + Math.sin(t * .6 + ph) * 8) % w + w) % w, y = y0 + ((fy * h + t * drift[1] + Math.cos(t * .5 + ph) * 6) % h + h) % h;
    c.fillStyle = rgba(col, a * (.4 + .6 * Math.abs(Math.sin(t * .9 + ph)))); c.beginPath(); c.arc(x, y, 1 + (i % 3) * .5, 0, TAU); c.fill();
  }
  c.restore();
}
function leak(c, t, cols, a) {
  c.save(); c.globalCompositeOperation = 'screen';
  cols.forEach((col, i) => { const x = 480 + Math.sin(t * .11 + i * 2.1) * 560, y = 270 + Math.cos(t * .09 + i * 1.3) * 300, r = 380 + 80 * Math.sin(t * .2 + i);
    const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a * (.7 + .3 * Math.sin(t * .3 + i)))); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, 960, 540); });
  c.restore();
}
function twinkle(c, x, y, r, col, a) {
  if (a <= 0) return; c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = rgba(col, a);
  c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.fill();
  const g = c.createRadialGradient(x, y, 0, x, y, r * .7); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * .7, 0, TAU); c.fill(); c.restore();
}
function hexGrid(c, a, col) {
  c.save(); c.strokeStyle = rgba(col, a); c.lineWidth = 1; const r = 26, hh = r * Math.sqrt(3) / 2; c.beginPath();
  for (let row = -1; row < 13; row++) for (let q = -1; q < 14; q++) { const cx = q * r * 1.5, cy = row * hh * 2 + (q % 2 ? hh : 0);
    for (let k = 0; k < 6; k++) { const a1 = k / 6 * TAU, a2 = (k + 1) / 6 * TAU; c.moveTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r); c.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r); } }
  c.stroke(); c.restore();
}

const POST = {
  'TX-01': { bloom: .9, th: 1, persist: .38, trans: 'shards', tdur: .75, cam: { z: .045, pan: 8 },
    fx(s, t, B) { const T = s.th.tok, L = s.lvl;
      c_beam: { const c = s.c, a = L === 2 ? .08 : .18 + .06 * Math.sin(t * 2.2); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(474, 0, 486, 0); g.addColorStop(0, rgba(T.a1, 0)); g.addColorStop(.5, rgba(T.a1, a)); g.addColorStop(1, rgba(T.a1, 0)); c.fillStyle = g; c.fillRect(440, 0, 80, 250); c.restore(); }
      (s.st.heads || []).forEach(([x, y, col], i) => { const c = s.c;
        c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y + 6, 0, x, y + 6, 70); g.addColorStop(0, rgba(col, L === 2 ? .12 : .32)); g.addColorStop(1, rgba(col, 0)); c.translate(x, y + 6); c.scale(1, .22); c.translate(-x, -(y + 6)); c.fillStyle = g; c.beginPath(); c.arc(x, y + 6, 70, 0, TAU); c.fill(); c.restore();
        if (L < 2) flare(c, x, y, 150, col, .5); if (L === 0) sparks(c, x, y, t, 16, col === T.a1 ? '#B8F6FF' : '#FFC79A', 100 + i, -Math.PI / 2, 2.2, 70, 140); }); } },
  'TX-02': { bloom: .8, th: 1, persist: .22, trans: 'rain', tdur: .9, cam: { z: .035 },
    fx(s, t, B) { const c = s.c, T = s.th.tok, L = s.lvl;
      if (B.i === 0 && L < 2) { const word = 'PHOSPHOR RAIN', font = F(400, 54, 'Share Tech Mono'), total = tw(c, word, font, 8); c.save(); c.font = font; let x = 480 - total / 2;
        [...word].forEach((ch, i) => { const w = c.measureText(ch).width, d = B.t - (.2 + i * .09); if (ch !== ' ' && d > 0 && d < .4) { const a = 1 - d / .4, g = c.createRadialGradient(x + w / 2, 236, 0, x + w / 2, 236, 46); g.addColorStop(0, `rgba(220,255,225,${.8 * a})`); g.addColorStop(1, 'rgba(0,255,65,0)'); c.globalCompositeOperation = 'lighter'; c.fillStyle = g; c.fillRect(x - 40, 190, w + 80, 92); } x += w + 8; }); c.restore(); }
      if (L === 0) { const y = (t * 70) % 600 - 30; c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, y - 24, 0, y + 4); g.addColorStop(0, 'rgba(0,255,65,0)'); g.addColorStop(1, 'rgba(0,255,65,.06)'); c.fillStyle = g; c.fillRect(0, y - 24, 960, 28); c.restore(); } } },
  'TX-03': { bloom: .65, th: 1, trans: 'glass', tdur: .6, cam: { z: .03, pan: 10, rot: .5 },
    fx(s, t, B) { const c = s.c, T = s.th.tok, L = s.lvl;
      hexGrid(c, .035, T.a1);
      if (L < 2 && (B.i === 0 || B.i === 2)) { c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 46; i++) { const l = ((hash3(i, 3, 3) % 1000) / 1000 + t * .12) % 1, a0 = (hash3(i, 4, 4) % 628) / 100, r = 430 * (1 - l), a = a0 + l * 1.4; c.fillStyle = rgba(T.a1, l * (1 - l) * 2.4); c.fillRect(480 + Math.cos(a) * r, 290 + Math.sin(a) * r * .62, 2, 2); } c.restore(); }
      if (L < 2) { const p = (t % 5) / 5, x = -300 + p * 1700; c.save(); c.globalCompositeOperation = 'lighter'; c.translate(x, 0); c.rotate(.35); const g = c.createLinearGradient(-60, 0, 60, 0); g.addColorStop(0, rgba(T.a1, 0)); g.addColorStop(.5, rgba(T.a1, .07)); g.addColorStop(1, rgba(T.a1, 0)); c.fillStyle = g; c.fillRect(-60, -200, 120, 1100); c.restore(); } } },
  'TX-04': { bloom: 1.0, th: 1, persist: .14, trans: 'focus', tdur: 1.0, cam: { z: .05, pan: 12 },
    fx(s, t, B) { const c = s.c, T = s.th.tok, L = s.lvl, street = 452;
      c.save(); c.globalCompositeOperation = 'screen'; [[300, 220, -1.9, .35], [690, 190, -1.25, .28]].forEach(([x, y, base, sp], i) => { const a = base + (L === 2 ? 0 : Math.sin(t * sp + i * 2) * .45), g = c.createRadialGradient(x, y, 0, x, y, 640); g.addColorStop(0, 'rgba(201,211,218,.14)'); g.addColorStop(1, 'rgba(201,211,218,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(x, y); c.arc(x, y, 640, a - .05, a + .05); c.closePath(); c.fill(); }); c.restore();
      if (L < 2) { const on = Math.sin(t * .9) > -.85; if (on) flare(c, 132, 196, 110, T.a1, .35); flare(c, 610, 230, 90, T.a3, .3); if (B.i === 0 && (B.t > .8 || L > 0)) flare(c, 300, 266, 320, T.a2, .3); }
      for (let i = 0; i < 12; i++) { const per = 1.4 + (i % 4) * .3, l = ((t + i * .37) % per) / per, x = (hash3(i, Math.floor((t + i * .37) / per), 7) % 900) + 30, y = street + 16 + (hash3(i, 2, Math.floor((t + i * .37) / per)) % 70), rx = 3 + 36 * l;
        c.strokeStyle = `rgba(201,211,218,${(1 - l) * .4})`; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, rx, rx * .2, 0, 0, TAU); c.stroke(); }
      if (L < 2) { c.save(); c.strokeStyle = 'rgba(220,230,236,.5)'; c.lineWidth = 1; for (let i = 0; i < 26; i++) { const l = ((t * 3 + i * .173) % 1), x = (hash3(i, Math.floor(t * 3 + i * .173), 3) % 940) + 10, y = street + 8 + (i % 6) * 12; c.globalAlpha = 1 - l; c.beginPath(); c.arc(x, y, 3 * l + 1, Math.PI, TAU); c.stroke(); } c.restore(); } } },
  'TX-05': { bloom: .55, th: 1, trans: 'channel', tdur: .45, cam: { z: .015 },
    fx(s, t, B) { const c = s.c, L = s.lvl;
      if (L === 0 && ((B.i === 0 && B.t < 1.1) || (B.i === 1 && B.t < 1.0))) for (let i = 0; i < 3; i++) sliceShift(c, s, hash3(i, Math.floor(t * 8.3), 4) % 500, 10 + (i * 7), ((hash3(i, Math.floor(t * 8.3), 9) % 30) - 15));
      c.save(); c.globalCompositeOperation = 'screen'; const g = c.createLinearGradient(0, 0, 420, 300); g.addColorStop(0, 'rgba(255,255,255,.07)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 960, 540); c.restore();
      vignette(c, 960, 540, .55); } },
  'TX-06': { bloom: .7, th: 1, trans: 'vhs', tdur: .6, skip: [1], cam: { z: .035, weave: 1.4 },
    fx(s, t, B) { const c = s.c, T = s.th.tok, L = Math.min(s.lvl, 1);
      const fl = .85 + .1 * Math.sin(t * 1.7) + .05 * Math.sin(t * 2.9);
      c.save(); c.globalCompositeOperation = 'screen'; const g = c.createRadialGradient(820, 110, 0, 820, 110, 520); g.addColorStop(0, `rgba(255,196,130,${.16 * fl})`); g.addColorStop(1, 'rgba(255,196,130,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(820, 110); c.arc(820, 110, 520, 1.75, 2.45); c.closePath(); c.fill(); c.restore();
      c.save(); c.beginPath(); c.moveTo(820, 110); c.arc(820, 110, 520, 1.75, 2.45); c.closePath(); c.clip(); motes(c, 420, 110, 420, 420, t, 34, '#FFD9A8', .55, 61, [-5, 9]); c.restore();
      if (L === 0) leak(c, t, ['#FF4A2A', '#FF9A3C'], .12); } },
  'TX-07': { bloom: 1.05, th: 1, persist: .16, trans: 'streak', tdur: .6, cam: { z: .04, pan: 10 },
    fx(s, t, B) { const c = s.c, T = s.th.tok, L = Math.min(s.lvl, 1);
      c.save(); c.globalCompositeOperation = 'screen'; const g = c.createRadialGradient(480, 290, 90, 480, 290, 330); g.addColorStop(0, 'rgba(255,120,150,.32)'); g.addColorStop(1, 'rgba(255,92,138,0)'); c.fillStyle = g; c.fillRect(0, 0, 960, 540); c.restore();
      if (L === 0 && B.i !== 1) { const bp = (t % .469) / .469; c.save(); c.globalCompositeOperation = 'lighter'; const fg = c.createLinearGradient(0, 330, 0, 540); fg.addColorStop(0, rgba(T.a1, .16 * Math.pow(1 - bp, 3))); fg.addColorStop(1, rgba(T.a1, 0)); c.fillStyle = fg; c.fillRect(0, 330, 960, 210); c.restore();
        for (let i = 0; i < 8; i++) sliceShift(c, s, 300 + i * 5, 5, Math.sin(t * 3 + i * .8) * 1.2); }
      flare(c, 480, 330, 380, T.a1, .28); } },
  'TX-08': { bloom: .75, th: 1, persist: .34, trans: 'crt', tdur: 1.1,
    fx(s, t, B) { const c = s.c, T = s.th.tok; c.save(); rr(c, 28, 28, 904, 484, 28); c.clip();
      const y = 28 + (t * 38) % 520; c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(0, y - 60, 0, y); g.addColorStop(0, rgba(T.a2, 0)); g.addColorStop(1, rgba(T.a2, .06)); c.fillStyle = g; c.fillRect(0, y - 60, 960, 60);
      c.globalCompositeOperation = 'screen'; const gl = c.createLinearGradient(28, 28, 380, 300); gl.addColorStop(0, 'rgba(255,255,255,.08)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.fillRect(28, 28, 904, 484); c.restore(); } },
  'TX-09': { bloom: .8, th: 1, trans: 'cut', cam: { z: .03 },
    fx(s, t, B) { const c = s.c, T = s.th.tok;
      if (B.i === 0 && B.t > 9) { const e = eio(clamp((B.t - 9) / 3)), ly = 540 - 70 * e; flare(c, 480, ly, 420, T.a2, .45 * e); flare(c, 610, ly + 4, 120, '#FFFFFF', .3 * e, false); }
      if (B.i === 2) [[230, 200, T.a1], [700, 160, T.a2], [560, 380, '#E6E9F0'], [300, 420, T.a3]].forEach(([x, y, col], k) => flare(c, x, y, 70 + 10 * Math.sin(t * 1.3 + k), col, .35 * pin(B, .8, .3 + k * .25))); } },
  'TX-10': { bloom: 0, trans: 'sand', tdur: 1.0, skip: [1], cam: { z: .04, pan: 12 },
    fx(s, t, B) { const c = s.c, L = s.lvl;
      rays(c, 760, 160, 10, 760, '#FFF6E2', .22, t, Math.PI * .55, Math.PI * 1.02);
      if (s.st.ryf && L < 2 && B.i !== 2) { c.save(); for (const [k, x0] of [[1, 170], [1, 430], [2, 610], [2, 300], [1, 820]]) { const y0 = s.st.ryf(k, x0); for (let i = 0; i < 14; i++) { const l = ((hash3(i, x0, 3) % 1000) / 1000 + t * .45) % 1; c.fillStyle = `rgba(243,233,218,${(1 - l) * .55})`; c.beginPath(); c.arc(x0 + l * 130 + Math.sin(t * 2 + i) * 3, y0 - 4 - l * 26 - Math.sin(l * 3) * 6, 1.2 + l * 2.5, 0, TAU); c.fill(); } } c.restore(); }
      if (L === 0 && B.i !== 1) for (let i = 0; i < 14; i++) sliceShift(c, s, 380 + i * 6, 6, Math.sin(t * 4 + i * .9) * 1.3); } },
  'TX-11': { bloom: .55, th: 1, persist: .26, trans: 'crash', tdur: .4, cam: { z: .03, shake: 1.4 },
    fx(s, t, B) { const c = s.c, L = Math.min(s.lvl, 1);
      c.save(); c.globalCompositeOperation = 'lighter'; for (let i = 0; i < (L === 0 ? 46 : 20); i++) { const l = ((hash3(i, 5, 5) % 1000) / 1000 + t * (.35 + (i % 5) * .08)) % 1, x0 = (hash3(i, 6, 6) % 960), x = x0 + l * 160 * (i % 2 ? 1 : -1) + Math.sin(t * 3 + i) * 8, y = 560 - l * 460;
        c.fillStyle = `rgba(255,${150 + (i % 4) * 20},60,${(1 - l) * .85})`; c.fillRect(x, y, 2.4, 2.4 + (L === 0 ? 3 : 0)); } c.restore();
      if (L === 0) for (let i = 0; i < 12; i++) sliceShift(c, s, 310 + i * 9, 9, Math.sin(t * 5 + i) * 1.6); } },
  'TX-12': { bloom: 1.05, th: 1, persist: .45, trans: 'slow', tdur: 1.3, cam: { z: .05, rot: 1.4 },
    fx(s, t, B) { const c = s.c, T = s.th.tok; c.save(); c.globalCompositeOperation = 'screen';
      [[T.a3, 0], [T.a2, 2.1], [T.a1, 4.2]].forEach(([col, o]) => { const x = 480 + Math.cos(t * .05 + o) * 320, y = 270 + Math.sin(t * .04 + o) * 160, g = c.createRadialGradient(x, y, 0, x, y, 300); g.addColorStop(0, rgba(col, .09)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, 960, 540); });
      c.restore();
      if (B.i === 3 || (B.i < 2 && s.lvl === 2)) for (let i = 0; i < 6; i++) { const a = t * .5 + i * TAU / 6; twinkle(c, 480 + Math.cos(a) * 210, 262 + Math.sin(a) * 32, 7, T.a1, .5 + .4 * Math.sin(t * 3 + i)); } } },
  'TX-13': { bloom: .5, th: 1, trans: 'iris', tdur: .9, skip: [1], cam: { z: .04, pan: 14 },
    fx(s, t, B) { const c = s.c, T = s.th.tok, fl = .1 + .025 * Math.sin(t * 1.8) + .015 * Math.sin(t * 3.1);
      c.save(); c.globalCompositeOperation = 'screen'; const g = c.createRadialGradient(260, 420, 0, 260, 420, 560); g.addColorStop(0, `rgba(255,170,80,${fl})`); g.addColorStop(1, 'rgba(255,170,80,0)'); c.fillStyle = g; c.fillRect(0, 0, 960, 540);
      const bg = c.createLinearGradient(0, 0, 700, 540); bg.addColorStop(0, 'rgba(255,230,180,.10)'); bg.addColorStop(1, 'rgba(255,230,180,0)'); c.fillStyle = bg; c.beginPath(); c.moveTo(-40, -40); c.lineTo(220, -40); c.lineTo(760, 560); c.lineTo(420, 560); c.closePath(); c.fill(); c.restore();
      c.save(); c.beginPath(); c.moveTo(-40, -40); c.lineTo(220, -40); c.lineTo(760, 560); c.lineTo(420, 560); c.closePath(); c.clip(); motes(c, 0, 0, 900, 540, t, 40, '#FFE6B0', .5, 77, [4, 6]); c.restore();
      (s.st.tops || []).forEach(([x, y], k) => twinkle(c, x + 10, y - 8, 9, T.a1, Math.max(0, Math.sin(t * 1.6 + k * 1.7)) * .85)); } },
  'TX-14': { bloom: 0, trans: 'page', tdur: .8, cam: { z: .02 },
    fx(s, t, B) { const c = s.c; if (B.i !== 0) return;
      [[0, 140, 1.2], [1, 330, .9], [2, 460, 1.4]].forEach(([i, y, sc]) => { const x = 1100 - ((t * (16 + i * 5) + i * 400) % 1400);
        c.save(); c.globalAlpha = .18; c.fillStyle = '#2E2318'; c.beginPath(); for (let k = 0; k < 6; k++) c.arc(x + 30 + k * 26 * sc, y + 40 + Math.sin(k) * 6, 26 * sc, 0, TAU); c.fill(); c.restore();
        const g = c.createRadialGradient(x, y, 0, x, y, 120 * sc); g.addColorStop(0, 'rgba(255,253,246,.55)'); g.addColorStop(1, 'rgba(255,253,246,0)'); c.fillStyle = g; for (let k = 0; k < 6; k++) { c.beginPath(); c.arc(x + k * 26 * sc, y + Math.sin(k) * 6, 34 * sc, 0, TAU); c.fill(); } }); } },
  'TX-15': { bloom: 0, trans: 'soft', tdur: 1.1, skip: [1], cam: { z: .035, pan: 12 },
    fx(s, t, B) { const c = s.c, L = Math.min(s.lvl, 1); if (B.i === 2) return;
      rays(c, 900, -20, 9, 820, '#FFF4D6', .2, t, Math.PI * .55, Math.PI * .95);
      if (L === 0) for (let i = 0; i < 18; i++) { const l = ((hash3(i, 8, 8) % 1000) / 1000 + t * .07) % 1, x = -40 + l * 1040, y = 140 + (hash3(i, 9, 9) % 300) + Math.sin(t * 1.3 + i) * 22, rot = t * (1 + (i % 3)) + i;
        c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, .45 + .4 * Math.sin(t * 2 + i)); c.fillStyle = i % 3 ? 'rgba(247,198,208,.9)' : 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(0, 0, 5, 3, 0, 0, TAU); c.fill(); c.restore(); } } },
  'TX-16': { bloom: 0, trans: 'paper', tdur: .55, cam: { beat: .469 } },
  'TX-17': { bloom: .85, th: 1, persist: .22, trans: 'ink', tdur: 1.0, cam: { z: .05, rot: .9 },
    fx(s, t, B) { const c = s.c, T = s.th.tok, L = Math.min(s.lvl, 1);
      for (let i = 0; i < 16; i++) { const a = (hash3(i, 2, 2) % 628) / 100, r = 150 + (hash3(i, 3, 3) % 140), x = 480 + Math.cos(a) * r * 1.3, y = 280 + Math.sin(a) * r * .9, ph = (t * .7 + i * .37) % 1.8; twinkle(c, x, y, 6 + (i % 3) * 2, T.a3, ph < .6 ? Math.sin(ph / .6 * Math.PI) * .9 : 0); }
      if (B.i === 0 && L === 0) { c.save(); c.beginPath(); c.moveTo(330, 470); c.lineTo(330, 210); c.arc(480, 210, 150, Math.PI, TAU); c.lineTo(630, 470); c.closePath(); c.clip(); c.globalCompositeOperation = 'screen';
        for (let i = 0; i < 9; i++) { const y = 470 - ((t * 22 + i * 46) % 420); c.strokeStyle = 'rgba(240,210,122,.07)'; c.lineWidth = 3; c.beginPath(); for (let x = 330; x <= 630; x += 10) { const yy = y + Math.sin(x * .05 + t * 1.5 + i) * 5; x === 330 ? c.moveTo(x, yy) : c.lineTo(x, yy); } c.stroke(); } c.restore(); } } },
  'TX-18': { bloom: 0, trans: 'shatter', tdur: .65, cam: { z: .02 },
    fx(s, t, B) { const c = s.c; if (B.i === 0) { const q = clamp((B.t - 1.6) / .5); if (q > 0 && q < 1) { c.save(); c.strokeStyle = '#111'; c.lineCap = 'round'; for (let i = 0; i < 22; i++) { const a = i / 22 * TAU, r1 = 90 + q * 40, r2 = r1 + 30 + (i % 3) * 18; c.lineWidth = 4 * (1 - q); c.beginPath(); c.moveTo(760 + Math.cos(a) * r1, 300 + Math.sin(a) * r1 * .7); c.lineTo(760 + Math.cos(a) * r2, 300 + Math.sin(a) * r2 * .7); c.stroke(); } c.restore(); } } } },
  'TX-19': { bloom: 0, trans: 'whip', tdur: .45,
    post(s, t, B, FOK) { const c = s.c, cv = s.cv, sm = s.tsC || (s.tsC = document.createElement('canvas')), w = Math.max(2, Math.round(cv.width / 7)), h = Math.max(2, Math.round(cv.height / 7));
      if (sm.width !== w || sm.height !== h) { sm.width = w; sm.height = h; } const g = sm.getContext('2d'); g.imageSmoothingQuality = 'high'; g.globalCompositeOperation = 'copy'; g.filter = FOK ? 'blur(1px) saturate(1.15)' : 'none'; g.drawImage(cv, 0, 0, w, h); g.filter = 'none';
      c.imageSmoothingQuality = 'high'; const band = 140, strip = 7;
      for (let y = 0; y < band; y += strip) { const a = Math.pow(1 - y / band, 1.3) * .95; c.globalAlpha = a; c.drawImage(sm, 0, y / 540 * h, w, strip / 540 * h, 0, y, 960, strip); c.drawImage(sm, 0, (540 - y - strip) / 540 * h, w, strip / 540 * h, 0, 540 - y - strip, 960, strip); }
      c.globalAlpha = 1; } },
  'TX-20': { bloom: 0, trans: 'cut',
    fx(s, t, B) { const c = s.c; if (B.i === 2) return; const vx = 480, vy = 236, Fc = 300, pj = (x, y, z) => [vx + x * Fc / z, vy - y * Fc / z], zc = s.st.zc || 0;
      c.save(); c.globalCompositeOperation = 'screen';
      for (let k = 22; k >= 0; k--) { const z = k * 1.2 - (zc % 1.2) + .5; if (z < .34) continue; const P = [pj(-.22, -.749, z), pj(.22, -.749, z), pj(.22, -.749, z + .9), pj(-.22, -.749, z + .9)];
        c.fillStyle = `rgba(255,255,255,${.16 * Math.min(1, 2.2 / z)})`; c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill();
        const [lx, ly] = pj(0, .549, z + .3), g = c.createRadialGradient(lx, ly, 0, lx, ly, 70 / z + 6); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(lx, ly, 70 / z + 6, 0, TAU); c.fill(); }
      const hz = c.createRadialGradient(vx, vy, 0, vx, vy, 300); hz.addColorStop(0, 'rgba(255,255,255,.45)'); hz.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = hz; c.fillRect(0, 0, 960, 540); c.restore(); } }
};
