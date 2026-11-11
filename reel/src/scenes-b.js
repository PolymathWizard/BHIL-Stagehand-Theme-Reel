/* ── TX-06 OTHERSIDE '83 ─────────────────────────────────────────────── */
SCENES['TX-06'] = {
  beats: [['S1', 'Title assembly', 6], ['S2', 'VHS roll to chapter', 3.5], ['S4', 'Two worlds: scrub, gap, the turn', 9.5], ['S5', 'Flashlight reveal', 3.5]],
  init(s) {
    const R = s.R; s.st.ash = Array.from({ length: 60 }, () => [R() * 960, R() * 540, 8 + R() * 18, 6 + R() * 16, R() * TAU, .8 + R() * 1.6]);
    s.st.hid = SAMPLE.line.map((v, i) => .18 + i * .055 + (i > 7 ? .1 : 0));
    s.st.pines = Array.from({ length: 26 }, (_, i) => [i * 40 - 10 + R() * 20, 60 + R() * 70]);
  },
  draw(s, t, B) {
    const { c, W, H } = s, T = s.th.tok, lvl = Math.min(s.lvl, 1);
    let f = 0, cardS = 1;
    if (B.i === 2) { const fp = smooth(2.2, 3.0, B.t), bk = smooth(7.0, 7.8, B.t); f = fp - bk; cardS = B.t < 5 ? Math.abs(Math.cos(Math.PI * fp)) : Math.abs(Math.cos(Math.PI * bk)); }
    c.fillStyle = mix(T.bg, '#18222E', f); c.fillRect(0, 0, W, H);
    const lamp = c.createRadialGradient(820, 120, 0, 820, 120, 260); lamp.addColorStop(0, `rgba(255,190,120,${.16 * (1 - f)})`); lamp.addColorStop(1, 'rgba(255,190,120,0)'); c.fillStyle = lamp; c.fillRect(560, 0, 400, 400);
    s.st.ash.forEach(([x0, y0, sp, sw, ph, r]) => { const y = ((y0 - t * sp * (1 - 2 * f)) % H + H) % H, x = x0 + Math.sin(t * .5 + ph) * sw; c.fillStyle = f > .5 ? rgba(T.a2, .5) : rgba(T.ink, .32); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); });
    c.fillStyle = mix('#030304', '#0C1219', f); c.beginPath(); c.moveTo(0, H); s.st.pines.forEach(([x, h]) => { c.lineTo(x, H - 20); c.lineTo(x + 20, H - 20 - h); c.lineTo(x + 40, H - 20); }); c.lineTo(W, H); c.closePath(); c.fill();
    const title = (x, y, size, p, str) => { const font = F(900, size, 'Fraunces'), chars = [...str]; c.save(); c.font = font; const ws = chars.map(ch => c.measureText(ch).width); c.restore(); const tot = ws.reduce((a, b) => a + b, 0) - 2 * (chars.length - 1); let xx = x - tot / 2; const st = mix(T.a1, '#B9C7D3', f); chars.forEach((ch, i) => { const off = (i - (chars.length - 1) / 2) * 24 * (1 - p); txt(c, ch, xx + off, y, { font, stroke: st, lw: size > 60 ? 2.4 : 2, fill: rgba(T.a1, .07), glow: 18, gc: st }); xx += ws[i] - 2; }); };
    if (B.i === 0) {
      title(480, 206, 84, eio(pin(B, 3.5)), "OTHERSIDE ’83");
      txt(c, 'TX-06 · THE WORLD UNDER THE SURFACE', 480, 252, { font: F(400, 24, 'VT323'), fill: T.ink, alpha: .8 * pin(B, .8, 2.6), align: 'center', track: 2 });
      txt(c, 'PLAY ▶  NOV 06 1983  11:47 PM', 40, 512, { font: F(400, 22, 'VT323'), fill: T.ink, alpha: .7 });
    } else if (B.i === 1) {
      txt(c, 'CHAPTER TWO', 480, 168, { font: F(400, 26, 'VT323'), fill: T.ink, align: 'center', track: 6, alpha: .85 });
      title(480, 250, 58, 1, 'The Basement Ledger');
      txt(c, 'Where the numbers stopped adding up.', 480, 300, { font: F(400, 24, 'Crimson Pro'), fill: T.ink, align: 'center', alpha: .9 });
      const roll = 1 - pin(B, 1.2);
      if (roll > 0) {
        if (lvl === 0) { for (let k = 0; k < 9; k++) { const y = (k * 60 + B.t * 900) % H; sliceShift(c, s, y, 22, (hash3(k, Math.floor(t * 20), 4) % 40 - 20) * roll); } noiseBand(c, (B.t * 700) % H, 40, t, .35 * roll); txt(c, 'TRACKING', 40, 60, { font: F(400, 28, 'VT323'), fill: T.ink, alpha: roll }); }
        else { c.fillStyle = `rgba(7,6,8,${clamp(1 - B.t / .15)})`; c.fillRect(0, 0, W, H); }
      }
    } else if (B.i === 2) {
      DATA4['TX-06'](s, t, B, { f, cardS });
    } else {
      const real = s.pointer && lvl === 0, p = B.t / B.d, sp = real ? s.pointer : [lerp(160, 800, eio(p)), 270 + Math.sin(p * Math.PI * 2) * 70];
      txt(c, 'THE SIGNAL WAS THERE ALL ALONG', 480, 260, { font: F(900, 40, 'Fraunces'), stroke: T.a1, lw: 1.6, fill: rgba(T.a1, .1), align: 'center', glow: 12, gc: T.a1 });
      txt(c, 'Three readings, one direction. Sample note.', 480, 304, { font: F(400, 22, 'Crimson Pro'), fill: T.ink, align: 'center', alpha: .9 });
      if (lvl === 0) { const g = c.createRadialGradient(sp[0], sp[1], 50, sp[0], sp[1], 170); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.9)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
        c.fillStyle = 'rgba(255,240,200,.05)'; c.beginPath(); c.arc(sp[0], sp[1], 60, 0, TAU); c.fill(); }
      txt(c, 'S5 · FLASHLIGHT CURSOR' + (lvl === 0 ? '' : ' (OFF AT TEMPERED)'), 480, 470, { font: F(400, 20, 'VT323'), fill: T.ink, align: 'center', alpha: .6, track: 2 });
    }
    grain(c, W, H, .1, t, lvl === 0); vignette(c, W, H, .75);
  }
};

/* ── TX-07 NIGHT DRIVE ───────────────────────────────────────────────── */
SCENES['TX-07'] = {
  beats: [['S1', 'Sunset cruise', 6], ['S2', 'Neon sign headers', 4], ['S4', 'Equalizer: peak, average, re-sort', 9.5], ['S5', 'Passing-light CTA', 3]],
  init(s) { const R = s.R; s.st.stars = Array.from({ length: 90 }, () => [R() * 960, R() * 250, R() * TAU, .6 + R()]); s.st.mtn = Array.from({ length: 25 }, (_, i) => [i * 40, 330 - (12 + R() * 48) * (0.4 + .6 * Math.abs(Math.sin(i * .7)))]); s.st.ph = 0; s.st.streaks = Array.from({ length: 16 }, () => [R(), 340 + R() * 160, .6 + R()]); },
  draw(s, t, B, dt = 0) {
    const { c, W, H } = s, T = s.th.tok, lvl = Math.min(s.lvl, 1), hy = 330;
    const sky = c.createLinearGradient(0, 0, 0, hy); sky.addColorStop(0, T.bg); sky.addColorStop(.55, '#2A0B4A'); sky.addColorStop(.86, '#8E1F72'); sky.addColorStop(1, '#FF5C8A'); c.fillStyle = sky; c.fillRect(0, 0, W, hy);
    s.st.stars.forEach(([x, y, ph, r]) => { c.fillStyle = `rgba(243,232,255,${.25 + .3 * Math.sin(t * 1.6 + ph)})`; c.fillRect(x, y, r, r); });
    if (lvl === 0) { const sc = t % 9; if (sc < .7) { const x = 700 - sc * 500, y = 40 + sc * 120, g = c.createLinearGradient(x, y, x + 90, y - 22); g.addColorStop(0, 'rgba(255,255,255,.8)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.strokeStyle = g; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 90, y - 22); c.stroke(); } }
    const sx = 480, sy = 290, sr = 118; c.save(); c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.clip();
    const sg = c.createLinearGradient(0, sy - sr, 0, sy + sr); sg.addColorStop(0, T.a3); sg.addColorStop(1, T.a1); c.fillStyle = sg; c.fillRect(sx - sr, sy - sr, sr * 2, sr);
    let y = sy, i = 0; const ph = (t * 7) % 14; c.fillRect(sx - sr, y, sr * 2, ph * .6); y += ph; while (y < sy + sr) { const bh = Math.max(2, 11 - i * 1.1), gap = 2.5 + i * 1.3; c.fillRect(sx - sr, y, sr * 2, bh); y += bh + gap; i++; } c.restore();
    c.fillStyle = '#1A0833'; c.beginPath(); c.moveTo(0, hy); s.st.mtn.forEach(([x, yy]) => c.lineTo(x, yy)); c.lineTo(W, hy); c.closePath(); c.fill();
    c.strokeStyle = rgba(T.a1, .55); c.lineWidth = 1.2; c.beginPath(); s.st.mtn.forEach(([x, yy], k) => k ? c.lineTo(x, yy) : c.moveTo(x, yy)); c.stroke();
    const fg = c.createLinearGradient(0, hy, 0, H); fg.addColorStop(0, '#2A0846'); fg.addColorStop(1, T.bg); c.fillStyle = fg; c.fillRect(0, hy, W, H - hy);
    const spd = [.6, .35, .3, 1.4][B.i] * (lvl === 0 ? 1 : .6); s.st.ph = (s.st.ph + dt * spd) % 1;
    floorGrid(c, W, H, hy, s.st.ph, T.a1, .7, lvl === 0);
    c.fillStyle = 'rgba(11,4,32,.55)'; c.beginPath(); c.moveTo(470, hy); c.lineTo(490, hy); c.lineTo(760, H); c.lineTo(200, H); c.closePath(); c.fill();
    c.strokeStyle = rgba(T.a2, .8); c.lineWidth = 1.5; c.beginPath(); c.moveTo(470, hy); c.lineTo(200, H); c.moveTo(490, hy); c.lineTo(760, H); c.stroke();
    for (let k = 0; k < 14; k++) { const z = k + 1 - s.st.ph, y0 = hy + 220 / z, y1 = hy + 220 / (z - .45); if (y0 > H || z - .45 <= 0) continue; c.fillStyle = rgba(T.a3, .8 * clamp((y0 - hy) / 80)); const w0 = 1 + 6 / z; c.fillRect(480 - w0 / 2, y0, w0, Math.min(H, y1) - y0); }
    const palm = (px, dir) => { c.strokeStyle = '#0A0216'; c.lineCap = 'round'; c.lineWidth = 8; c.beginPath(); c.moveTo(px, H + 10); c.quadraticCurveTo(px + dir * 10, 400, px + dir * 34, 286); c.stroke(); const tx = px + dir * 34, ty = 286; c.lineWidth = 5; for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + (k - 3.5) * .42 + Math.sin(t * .8 + k) * .03, L = 70 + (k % 3) * 14; c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(tx + Math.cos(a) * L * .6, ty + Math.sin(a) * L * .6 - 18, tx + Math.cos(a) * L, ty + Math.sin(a) * L + 34); c.stroke(); } c.lineCap = 'butt'; };
    palm(96, 1); palm(870, -1);
    const neon = (str, x, y, font, col, on, al = 'center', track = 6) => { txt(c, str, x, y, { font, fill: on ? '#FFFFFF' : rgba(col, .18), track, align: al, glow: on ? 22 : 0, gc: col }); if (on) { c.save(); c.translate(0, hy * 2 - y + 20); c.scale(1, -.4); txt(c, str, x, y, { font, fill: rgba(col, .2), track, align: al }); c.restore(); } };
    const flick = (bt, at) => lvl > 0 ? bt > at : (bt > at + .5 || (bt > at && bt < at + .12) || (bt > at + .28 && bt < at + .36));
    if (B.i === 0) {
      const tg = c.createLinearGradient(0, 80, 0, 140); tg.addColorStop(0, T.a2); tg.addColorStop(.5, '#FFFFFF'); tg.addColorStop(1, T.a1);
      txt(c, 'NIGHT DRIVE', 480, 136, { font: F(400, 66, 'Monoton'), fill: tg, track: 6, align: 'center', glow: lvl === 0 ? 22 : 10, gc: T.a2 });
      const on = flick(B.t, .9); c.save(); c.translate(620, 196); c.rotate(-.12);
      txt(c, 'after hours', 0, 0, { font: F(400, 54, 'Mr Dafoe'), fill: on ? '#FFC2D6' : rgba(T.a1, .2), glow: on ? 18 : 0, gc: T.a1, align: 'center' });
      c.strokeStyle = T.a1; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-110, 14); c.lineTo(-110 + 220 * eo(pin(B, .9, 1.6)), 14); c.stroke(); c.restore();
      txt(c, 'TX-07 · AFTER HOURS', 920, 520, { font: F(400, 14, 'Share Tech Mono'), fill: T.ink, alpha: .75, align: 'right', track: 3 });
    } else if (B.i === 1) {
      c.fillStyle = 'rgba(11,4,32,.55)'; c.fillRect(0, 0, W, H);
      neon('02', 200, 190, F(400, 110, 'Monoton'), T.a2, flick(B.t, .2), 'center', 4);
      neon('THE CRUISE', 600, 170, F(400, 52, 'Monoton'), T.a1, flick(B.t, .8), 'center', 6);
      const on3 = flick(B.t, 1.6); c.save(); c.translate(610, 238); c.rotate(-.08); txt(c, 'late night, long road', 0, 0, { font: F(400, 46, 'Mr Dafoe'), fill: on3 ? '#FFE2B8' : rgba(T.a3, .2), glow: on3 ? 16 : 0, gc: T.a3, align: 'center' });
      c.strokeStyle = T.a3; c.lineWidth = 2; c.beginPath(); c.moveTo(-150, 14); c.lineTo(-150 + 300 * eo(pin(B, .8, 2)), 14); c.stroke(); c.restore();
      txt(c, 'S2 · HEADERS FLICK ON LIKE SIGNS', 480, 300, { font: F(400, 13, 'Share Tech Mono'), fill: T.ink, align: 'center', alpha: .75 * pin(B, .4, 2.4), track: 3 });
    } else if (B.i === 2) {
      DATA4['TX-07'](s, t, B, {});
    } else {
      s.st.streaks.forEach(([o, yy, k]) => { const p = (o + t * k * 1.2) % 1, x = p * 1400 - 220, g = c.createLinearGradient(x - 260, 0, x, 0); g.addColorStop(0, rgba(k > 1 ? T.a2 : T.a1, 0)); g.addColorStop(1, rgba(k > 1 ? T.a2 : T.a1, .8)); c.fillStyle = g; c.fillRect(x - 260, yy, 260, 2); });
      const bx = 380, by = 220, bw = 200, bh = 60, cp = pin(B, .9), hov = B.t > .9, press = B.t > 1.6 && B.t < 1.8;
      c.save(); c.shadowBlur = hov ? 28 : 10; c.shadowColor = T.a2; c.strokeStyle = hov ? '#FFFFFF' : T.a2; c.lineWidth = 3; rr(c, bx, by, bw, bh, 30); c.stroke(); c.restore();
      c.fillStyle = rgba(T.a2, press ? .35 : hov ? .14 : .05); rr(c, bx, by, bw, bh, 30); c.fill();
      txt(c, 'GET IN ▶', 480, by + 39, { font: F(400, 24, 'Monoton'), fill: '#FFFFFF', align: 'center', track: 3 });
      const [mx, my] = glide([760, 460], [530, 252], cp); cursor(c, mx, my, press);
      txt(c, 'S5 · PASSING-LIGHT CTA', 480, 330, { font: F(400, 13, 'Share Tech Mono'), fill: T.ink, align: 'center', alpha: .7, track: 3 });
    }
  }
};

/* ── TX-08 COLD STORAGE ──────────────────────────────────────────────── */
SCENES['TX-08'] = {
  beats: [['S1', 'Wireframe survey', 6.5], ['S2', 'Terminal type-on', 4.5], ['S4', 'Meters: limit line, ranked load', 9.5], ['S5', 'Hardware keys', 3.5]],
  init(s) { const R = s.R, a = R() * 9, b = R() * 9; s.st.h = (x, z) => .5 * Math.sin(x * 3.1 + a) * Math.cos(z * 4.2 + b) + .3 * Math.sin(x * 7.3 + z * 5.1 + a); },
  draw(s, t, B) {
    const { c, W, H, lvl } = s, T = s.th.tok, blink = lvl === 2 || (t % 1) < .5;
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);
    c.fillStyle = '#020702'; rr(c, 28, 28, 904, 484, 28); c.fill();
    const sg = c.createRadialGradient(480, 270, 50, 480, 270, 520); sg.addColorStop(0, rgba(T.a2, .06)); sg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = sg; c.fillRect(28, 28, 904, 484);
    const type = (lines, x, y0, lh, size, budget) => { let b = budget, lx = x, ly = y0; lines.forEach(([l, col], k) => { if (b <= 0) return; const sh = l.slice(0, b); b -= l.length; const y = y0 + k * lh; const w = txt(c, sh, x, y, { font: F(400, size, 'VT323'), fill: col }); lx = x + w + 3; ly = y; }); if (blink) { c.fillStyle = T.a2; c.fillRect(lx, ly - size * .75, size * .45, size * .82); } };
    const header = (str) => { txt(c, str, 64, 94, { font: F(400, 26, 'Michroma'), fill: T.a2, track: 6, glow: lvl === 2 ? 0 : 12, gc: T.a2 }); };
    if (B.i === 0) {
      const prog = lvl === 2 ? 1 : pin(B, 5), cols = 22, rows = 12;
      const P = (i, j) => { const x = i / (cols - 1) * 2 - 1, z = j / (rows - 1), hv = s.st.h(x, z); return [290 + x * 230 * (1 - z * .45), 452 - z * 210 - hv * 70 * (1 - z * .3)]; };
      c.strokeStyle = rgba(T.a2, .75); c.lineWidth = 1; const rd = prog * rows * 2;
      for (let j = 0; j < rows; j++) { const pr = clamp(rd - j); if (pr <= 0) break; c.beginPath(); for (let i = 0; i <= Math.floor(pr * (cols - 1)); i++) { const [x, y] = P(i, j); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
      for (let i = 0; i < cols; i++) { const pr = clamp(rd - rows - i * (rows / cols)); if (pr <= 0) break; c.beginPath(); for (let j = 0; j <= Math.floor(pr * (rows - 1)); j++) { const [x, y] = P(i, j); j ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
      if (lvl < 2 && prog >= 1) { const a = (t * 1.2) % TAU, cx = 290, cy = 400; c.strokeStyle = rgba(T.a2, .5); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * 250, cy + Math.sin(a) * 90); c.stroke(); }
      type([['> INITIATE HULL SURVEY', T.a2], ['  SECTOR 7G ......... NOMINAL', T.a1], ['  COOLANT LOOP B .... 0.82 BAR', T.a1], ['  CARGO MASS ........ 20.4 KT', T.a1], ['> AWAITING PROTOCOL 12', T.a2]], 560, 150, 30, 24, lvl === 2 ? 999 : Math.floor(B.t * 30));
      txt(c, 'ELAPSED', 560, 330, { font: F(400, 20, 'VT323'), fill: T.ink, alpha: .6 });
      [...String(482 + Math.floor(t)).padStart(4, '0').slice(-4)].forEach((d, i) => sevenSeg(c, d, 650 + i * 34, 300, 26, 44, T.a1, rgba(T.a1, .08)));
      header('COLD STORAGE'); txt(c, 'TX-08 · HULL SYSTEMS CONSOLE', 66, 124, { font: F(400, 20, 'VT323'), fill: T.ink, alpha: .6, track: 1 });
    } else if (B.i === 1) {
      header('PROTOCOL 12');
      const L = [['> REQUEST ROUTE TO SECTOR 4', T.a2], ['  COMPUTING .......................... OK', T.a1], ['  HULL INTEGRITY ................. 98.2%', T.a1], ['  CREW STATUS ............ ALL STATIONS', T.a1], ['  SAMPLE READOUT · NO LIVE DATA', T.ink], ['> PROTOCOL 12 STANDING BY', T.a2]];
      type(L, 70, 170, 40, 32, Math.floor(B.t * 40));
      const pb = pin(B, 3.6, .3); for (let k = 0; k < 40; k++) { c.fillStyle = k / 40 < pb ? T.a2 : rgba(T.a2, .08); c.fillRect(70 + k * 20, 440, 16, 16); }
      txt(c, 'S2 · TERMINAL TYPE-ON, REAL TEXT IN THE DOM', 70, 480, { font: F(400, 18, 'VT323'), fill: T.ink, alpha: .55 });
    } else if (B.i === 2) {
      DATA4['TX-08'](s, t, B, { header });
    } else {
      header('COMMAND KEYS');
      const keys = ['NAV', 'COMMS', 'LOG', 'SEAL', 'VENT', 'AUX'], presses = [[0, .4], [2, 1.0], [3, 1.7]];
      keys.forEach((k, i) => {
        const x = 110 + i * 126, y = 300, pr = presses.find(([ki, at]) => ki === i && B.t > at && B.t < at + .3), done = presses.find(([ki, at]) => ki === i && B.t > at), d = pr ? 5 : 0;
        c.fillStyle = '#4A463C'; rr(c, x, y + 10, 100, 80, 10); c.fill();
        c.fillStyle = pr ? '#CFC7B0' : T.ink; rr(c, x, y + d, 100, 80, 10); c.fill(); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 2; rr(c, x, y + d, 100, 80, 10); c.stroke();
        txt(c, k, x + 50, y + 48 + d, { font: F(400, 13, 'Michroma'), fill: '#2A2720', align: 'center', track: 1 });
        c.fillStyle = done ? (i === 3 ? T.a1 : T.a2) : rgba(T.a2, .1); c.beginPath(); c.arc(x + 50, y - 26, 8, 0, TAU); c.fill();
      });
      type([['> SEAL CONFIRMED', T.a2]], 110, 200, 30, 30, B.t > 1.8 ? Math.floor((B.t - 1.8) * 30) : 0);
      c.fillStyle = rgba(T.a3, .15); c.beginPath(); c.arc(860, 120, 9, 0, TAU); c.fill(); txt(c, 'BREACH OFF', 860, 150, { font: F(400, 14, 'VT323'), fill: T.ink, alpha: .45, align: 'center' });
    }
    c.save(); rr(c, 28, 28, 904, 484, 28); c.clip(); scanlines(c, W, H, lvl === 2 ? .04 : .07); vignette(c, W, H, .8);
    if (lvl === 0) { c.fillStyle = `rgba(0,0,0,${.03 * (.5 + .5 * Math.sin(t * TAU * 1.5))})`; c.fillRect(0, 0, W, H); }
    c.restore(); c.strokeStyle = rgba(T.ink, .14); c.lineWidth = 3; rr(c, 28, 28, 904, 484, 28); c.stroke();
  }
};

/* ── TX-09 SPACE OPERA ───────────────────────────────────────────────── */
SCENES['TX-09'] = {
  beats: [['S1', 'Receding crawl', 12], ['S2', 'Clock wipe to chapter', 3], ['S4', 'Star map folds into share', 9.5], ['S2', 'Hyperspace, back to the top', 1.8]],
  init(s) { const R = s.R; s.st.stars = Array.from({ length: 230 }, () => [R() * 960, R() * 540, Math.floor(R() * 3)]); },
  draw(s, t, B) {
    const { c, W, H } = s, T = s.th.tok, lvl = Math.min(s.lvl, 1);
    const stars = (dim, streak) => { if (dim > .3) [[260, 180, '#3A2A6A', 280], [720, 360, '#1E3A6A', 320], [600, 120, '#4A3A20', 200]].forEach(([x, y, col, r], i) => { const xx = x + Math.sin(t * .03 + i) * 30, g = c.createRadialGradient(xx, y, 0, xx, y, r); g.addColorStop(0, rgba(col, .55 * dim)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.fillRect(0, 0, W, H); }); s.st.stars.forEach(([x0, y0, l]) => {
      const x = ((x0 - t * [2, 5, 10][l]) % W + W) % W, a = [.35, .6, .95][l] * dim;
      if (streak > 0) { const dx = x - 480, dy = y0 - 270, k = streak * .6; c.strokeStyle = `rgba(200,220,255,${a})`; c.lineWidth = l + .5; c.beginPath(); c.moveTo(x, y0); c.lineTo(x + dx * k, y0 + dy * k); c.stroke(); }
      else { c.fillStyle = `rgba(230,233,240,${a})`; c.fillRect(x, y0, l * .6 + .8, l * .6 + .8); } }); };
    const crawl = cc => {
      c.fillStyle = T.bg; c.fillRect(0, 0, W, H); stars(1, 0);
      const L = [['PART III', F(400, 26, 'News Cycle'), 1.2], ['THE MARGIN WARS', F(700, 54, 'Oswald'), 1.3], ['', '', 1],
        ['Four rival platforms race to claim', '', 1], ['the last open channel to the buyer.', '', 1], ['Each holds a piece of the map,', '', 1],
        ['none holds the whole of it. In the Lab,', '', 1], ['an intelligence team assembles the', '', 1], ['evidence that will decide the next', '', 1], ['quarter of the long campaign…', '', 1]];
      const hy = 130, bot = 640, fo = 2.4; let acc = 0;
      L.forEach(([line, font, gap], i) => { const d = (cc + 7) * .42 - acc; acc += gap * 1.05; if (!line || d <= 0) return;
        const sc = fo / (fo + d), y = hy + (bot - hy) * sc, a = clamp(sc * 2.3 - .25); if (a <= 0 || y > H + 40) return;
        const base = font || F(400, 32, 'News Cycle'), size = parseFloat(base.split(' ')[1]) * sc * 1.25;
        txt(c, line, 480, y, { font: base.replace(/ [\d.]+px/, ` ${size.toFixed(1)}px`), fill: T.a1, alpha: a, align: 'center', track: i < 2 ? 4 * sc : 0 }); });
      if (cc > 9) { const r = 900, py = H + r - 70 * eio(clamp((cc - 9) / 3)), g = c.createRadialGradient(480, py - r * .2, r * .6, 480, py, r); g.addColorStop(0, '#1A2B4A'); g.addColorStop(1, '#0A1020'); c.fillStyle = g; c.beginPath(); c.arc(480, py, r, 0, TAU); c.fill(); c.save(); c.shadowBlur = 28; c.shadowColor = T.a2; c.strokeStyle = rgba(T.a2, .8); c.lineWidth = 4; c.beginPath(); c.arc(480, py, r, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); c.restore(); }
    };
    const card = () => { c.fillStyle = T.bg; c.fillRect(0, 0, W, H); stars(.35, 0); txt(c, 'CHAPTER ONE', 480, 230, { font: F(400, 15, 'Space Mono'), fill: T.a1, track: 8, align: 'center' }); txt(c, 'THE OPEN CHANNEL', 480, 300, { font: F(700, 62, 'Oswald'), fill: T.ink, track: 5, align: 'center' }); c.fillStyle = T.a1; c.fillRect(400, 326, 160, 2); };
    const map = (a) => {
      c.fillStyle = T.bg; c.fillRect(0, 0, W, H); stars(.6, 0); c.save(); c.globalAlpha = a;
      const N = [[230, 200, 'I', T.a1], [700, 160, 'II', T.a2], [560, 380, 'III', '#E6E9F0'], [300, 420, 'IV', T.a3]];
      c.setLineDash([6, 8]); c.lineDashOffset = -t * 20; c.strokeStyle = rgba(T.a1, .35); c.lineWidth = 1.2; [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]].forEach(([u, v]) => { c.beginPath(); c.moveTo(N[u][0], N[u][1]); c.lineTo(N[v][0], N[v][1]); c.stroke(); }); c.setLineDash([]);
      N.forEach(([x, y, num, col], k) => { const sh = SAMPLE.share[k], p = eo(pin(B, .8, .3 + k * .25)), r = Math.sqrt(sh) * 5 * p;
        const g = c.createRadialGradient(x, y, 0, x, y, r * 2.2); g.addColorStop(0, rgba(col, .5)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 2.2, 0, TAU); c.fill();
        c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
        txt(c, `FACTION ${num}`, x + r + 12, y - 4, { font: F(700, 18, 'Oswald'), fill: T.ink, track: 3, alpha: p }); txt(c, `${Math.round(sh * p)}% OF CHANNEL · SAMPLE`, x + r + 12, y + 16, { font: F(400, 11, 'Space Mono'), fill: col, alpha: p });
        const units = Math.round(sh / 2 * pin(B, 1.5, 1.4 + k * .2)); for (let u = 0; u < units; u++) { const ux = 600 + u * 14, uy = 448 + k * 18; c.fillStyle = col; c.beginPath(); c.moveTo(ux, uy); c.lineTo(ux + 10, uy + 4); c.lineTo(ux, uy + 8); c.closePath(); c.fill(); } });
      txt(c, 'FLEET STRENGTH', 600, 438, { font: F(400, 11, 'Space Mono'), fill: T.ink, alpha: .6, track: 3 });
      txt(c, 'THE FACTIONS', 60, 80, { font: F(700, 34, 'Oswald'), fill: T.ink, track: 5 }); txt(c, 'S4 · COMPETITORS AS A STAR MAP', 60, 102, { font: F(400, 11, 'Space Mono'), fill: T.a1, track: 3 });
      c.restore();
    };
    if (B.i === 0) crawl(B.t);
    else if (B.i === 1) { if (B.t < .8) { crawl(12); const p = eio(B.t / .8); c.save(); c.beginPath(); c.moveTo(480, 270); c.arc(480, 270, 800, -Math.PI / 2, -Math.PI / 2 + TAU * p); c.closePath(); c.clip(); card(); c.restore(); } else card(); }
    else if (B.i === 2) { const X = { stars }; if (B.t < .7) { card(); c.save(); c.beginPath(); c.rect(0, 0, W * eio(B.t / .7), H); c.clip(); DATA4['TX-09'](s, t, B, X); c.restore(); } else DATA4['TX-09'](s, t, B, X); }
    else { c.fillStyle = T.bg; c.fillRect(0, 0, W, H); stars(1, (lvl === 0 ? 1 : .4) * eio(clamp(B.t / 1.2))); c.fillStyle = `rgba(0,0,0,${clamp((B.t - 1.3) / .5)})`; c.fillRect(0, 0, W, H); }
    txt(c, 'TX-09 · SPACE OPERA', 28, 36, { font: F(400, 12, 'Space Mono'), fill: T.ink, alpha: .55, track: 3 });
  }
};

/* ── TX-10 SANDSCALE ─────────────────────────────────────────────────── */
SCENES['TX-10'] = {
  beats: [['S1', 'Monumental rise', 7], ['S2', 'Sand-sweep wipe', 3], ['S4', 'Stone slabs: tallest, average, order', 9.5], ['S2', 'Infrared chapter', 4]],
  init(s) { const R = s.R; s.st.dust = Array.from({ length: 34 }, () => [R() * 960, 120 + R() * 330, .8 + R() * 1.4, R() * TAU]); s.st.ph = [R() * 9, R() * 9, R() * 9, R() * 9]; s.st.wind = Array.from({ length: 40 }, () => [R(), 330 + R() * 160, .5 + R()]); },
  draw(s, t, B) {
    const { c, W, H, lvl } = s, T = s.th.tok, lb = 69;
    const ridges = [[350, 18, '#E2CDA8', 2, .006], [385, 26, '#D2B387', 4, .0045], [425, 30, '#B48E5E', 7, .0038], [472, 36, '#8C6A43', 11, .003]];
    const ry = (k, x) => { const [b, a, , v, fq] = ridges[k], off = lvl === 2 ? 0 : t * v; return b - a * Math.pow(1 - Math.abs(Math.sin((x + off) * fq + s.st.ph[k])), 1.6); }; s.st.ryf = ry;
    const sky = () => { const g = c.createLinearGradient(0, lb, 0, 380); g.addColorStop(0, T.bg); g.addColorStop(1, '#E7D2B0'); c.fillStyle = g; c.fillRect(0, 0, W, H); const sun = c.createRadialGradient(760, 160, 0, 760, 160, 120); sun.addColorStop(0, 'rgba(255,248,235,.9)'); sun.addColorStop(.3, 'rgba(255,240,215,.4)'); sun.addColorStop(1, 'rgba(255,240,215,0)'); c.fillStyle = sun; c.fillRect(600, 40, 320, 260); };
    const dunes = (upto = 4) => { ridges.slice(0, upto).forEach(([b, a, col], k) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 8) c.lineTo(x, ry(k, x)); c.lineTo(W, H); c.closePath(); c.fill(); if (k < 3) { const hz = c.createLinearGradient(0, b - a, 0, b + 40); hz.addColorStop(0, 'rgba(243,233,218,0)'); hz.addColorStop(1, 'rgba(243,233,218,.35)'); c.fillStyle = hz; c.fillRect(0, b - a, W, 80); } }); };
    const figure = (x, y, sc = 1) => { c.strokeStyle = T.ink; c.fillStyle = T.ink; c.lineWidth = 1.6 * sc; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 8 * sc); c.stroke(); c.beginPath(); c.arc(x, y - 10.5 * sc, 2.2 * sc, 0, TAU); c.fill(); };
    const dust = () => { s.st.dust.forEach(([x0, y0, r, ph]) => { const x = (x0 + (lvl === 2 ? 0 : t * 14)) % W, y = y0 + Math.sin(t * .7 + ph) * 4; c.fillStyle = rgba(T.a2, .35); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); });
      if (lvl < 2) s.st.wind.forEach(([o, y, k]) => { const x = ((o * 1200 + t * 120 * k) % 1200) - 120; c.strokeStyle = 'rgba(243,233,218,.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 40 * k, y - 2); c.stroke(); }); };
    const desert = (p) => { sky(); txt(c, '2.4B', 480, lerp(560, 336, p), { font: F(700, 210, 'Syncopate'), fill: rgba(T.ink, .9), align: 'center', track: 4 }); const hz = c.createLinearGradient(0, 180, 0, 380); hz.addColorStop(0, 'rgba(243,233,218,0)'); hz.addColorStop(1, `rgba(243,233,218,${.85 - .45 * p})`); c.fillStyle = hz; c.fillRect(0, 180, W, 200); dunes(); figure(640, ry(2, 640)); dust(); txt(c, 'A force too large to see whole.', 480, 128, { font: F(500, 26, 'Cormorant Garamond'), fill: T.ink, align: 'center', alpha: .92 }); };
    const slabs = (p0, ir) => { sky(); dunes(2);
      c.strokeStyle = rgba(T.a2, .25); c.lineWidth = 1; for (let k = 0; k < 6; k++) { c.beginPath(); for (let x = 0; x <= W; x += 10) { const y = 300 + k * 16 - 30 * Math.exp(-((x - 520) ** 2) / (2 * 160 * 160)) * (1 - k / 7) + Math.sin(x * .02 + k) * 3; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
      const ground = 430; c.fillStyle = '#C9A77A'; c.fillRect(0, ground, W, H - ground);
      SAMPLE.bars.forEach((v, i) => { const p = eo(clamp((p0 - i * .08) / .7)), x = 150 + i * 116, w = 70, h = v / 100 * 250 * p, top = ground - h;
        c.fillStyle = 'rgba(43,38,32,.18)'; c.beginPath(); c.moveTo(x + w, ground); c.lineTo(x + w + h * .35, ground); c.lineTo(x + w + 8, top + 10); c.lineTo(x + w, top); c.closePath(); c.fill();
        const g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#6E5536'); g.addColorStop(.4, '#8C6A43'); g.addColorStop(1, '#5A452B'); c.fillStyle = g; c.fillRect(x, top, w, h);
        c.fillStyle = 'rgba(255,240,215,.35)'; c.fillRect(x, top, w, 3); c.fillStyle = 'rgba(43,38,32,.18)'; for (let k = 0; k < h; k += 22) c.fillRect(x + 6, top + k + 10, w - 12, 1);
        if (ir && (i === 1 || i === 3)) { const hg = c.createRadialGradient(x + w / 2, top + 20, 0, x + w / 2, top + 20, 90); hg.addColorStop(0, 'rgba(255,255,255,.9)'); hg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = hg; c.fillRect(x - 60, top - 70, w + 120, 180); }
        if (p > .5) txt(c, String(Math.round(v * p)), x + w / 2, top - 12, { font: F(400, 18, 'IBM Plex Mono'), fill: T.ink, align: 'center' });
        txt(c, SAMPLE.cats[i], x + w / 2, ground + 22, { font: F(400, 11, 'IBM Plex Mono'), fill: T.ink, align: 'center', alpha: .8 }); });
      figure(150 + 3 * 116 + 84, 430, 1.4);
      txt(c, 'STONE-SLAB DATA · SAMPLE · TRUE PROPORTION', 480, 112, { font: F(700, 13, 'Syncopate'), fill: T.ink, align: 'center', track: 4 });
    };
    if (B.i === 0) desert(lvl === 2 ? 1 : eio(pin(B, 3.6, .3)));
    else if (B.i === 1) {
      desert(1); const ex = eio(pin(B, 1.8, .2)) * 1120 - 80;
      c.save(); c.beginPath(); c.moveTo(-10, 0); for (let y = 0; y <= H; y += 12) c.lineTo(ex + 18 * Math.sin(y * .07 + t * 3) + (hash3(y, 3, 1) % 14), y); c.lineTo(-10, H); c.closePath(); c.clip();
      c.fillStyle = T.bg; c.fillRect(0, 0, W, H); const g = c.createLinearGradient(0, 300, 0, H); g.addColorStop(0, 'rgba(201,167,122,0)'); g.addColorStop(1, 'rgba(201,167,122,.6)'); c.fillStyle = g; c.fillRect(0, 300, W, 240);
      txt(c, 'CHAPTER II', 480, 220, { font: F(400, 13, 'IBM Plex Mono'), fill: T.a1, align: 'center', track: 8 });
      txt(c, 'THE LONG HORIZON', 480, 282, { font: F(700, 42, 'Syncopate'), fill: T.ink, align: 'center', track: 8 });
      txt(c, 'Some forces only show at scale.', 480, 326, { font: F(500, 26, 'Cormorant Garamond'), fill: T.ink, align: 'center' });
      c.restore();
      for (let k = 0; k < 40; k++) { const y = (k * 13.5) % H, x = ex + 18 * Math.sin(y * .07 + t * 3) + (hash3(k, Math.floor(t * 20), 5) % 30) - 5; c.fillStyle = rgba(T.a2, .5); c.fillRect(x, y, 2, 2); }
    } else if (B.i === 2) DATA4['TX-10'](s, t, B, { sky, dunes, figure });
    else {
      slabs(1, lvl === 0); const f = lvl === 0 ? pin(B, .6) * (1 - pout(B, .7)) : 0;
      if (f > 0) { c.save(); c.globalAlpha = f; c.globalCompositeOperation = 'saturation'; c.fillStyle = '#808080'; c.fillRect(0, 0, W, H); c.globalCompositeOperation = 'screen'; c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(0, 0, W, H); c.restore(); }
      const a = pin(B, .5) * (1 - pout(B, .6)); c.fillStyle = rgba(lvl === 0 ? '#FFFFFF' : T.a1, .9 * a); c.fillRect(40, 150, 220, 34); txt(c, lvl === 0 ? 'INFRARED · THREAT VIEW' : 'THREAT VIEW', 52, 172, { font: F(400, 13, 'IBM Plex Mono'), fill: lvl === 0 ? '#0E0E0E' : '#FFF8EE', track: 2, alpha: a });
    }
    c.fillStyle = '#000'; c.fillRect(0, 0, W, lb); c.fillRect(0, H - lb, W, lb);
    txt(c, 'TX-10 · SANDSCALE', 40, 42, { font: F(700, 13, 'Syncopate'), fill: '#E9DCC8', track: 6 });
    txt(c, 'PLACEHOLDER FIGURES · 2.39:1', 920, H - 30, { font: F(400, 11, 'IBM Plex Mono'), fill: '#E9DCC8', align: 'right', alpha: .7, track: 2 });
  }
};
