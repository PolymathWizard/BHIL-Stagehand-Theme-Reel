/* ── TX-01 VECTOR GRID ───────────────────────────────────────────────── */
SCENES['TX-01'] = {
  beats: [['S1', 'Wire-in hero', 6], ['S2', 'Light-trail connectors', 4.5], ['S4', 'Light walls: build, insight, re-sort', 9.5], ['S5', 'Focus ring, then shard-out', 2.5]],
  init(s) {
    const mk = (seed, n) => { const R = rng(seed); const p = [[90, 470]]; let [x, y] = p[0];
      for (let i = 0; i < n; i++) { if (i % 2 === 0) x = 90 + R() * 780; else y = 300 + R() * 210; p.push([x, y]); }
      p.push([90, y]); p.push([90, 470]); return p; };
    s.st.p1 = mk(11, 12); s.st.L1 = polyLen(s.st.p1); s.st.p2 = mk(29, 10); s.st.L2 = polyLen(s.st.p2);
    const R = s.R; s.st.tow = []; let x = 20; while (x < 940) { const w = 14 + R() * 30, h = 12 + R() * 60 * (1 - Math.abs(x - 480) / 700); s.st.tow.push([x, w, h]); x += w + 4 + R() * 16; }
    s.st.route = [[0, 352], [200, 352], [200, 432], [480, 432], [480, 330], [760, 330], [760, 410], [960, 410]]; s.st.RL = polyLen(s.st.route);
    s.st.ph = 0;
  },
  draw(s, t, B, dt = 0) {
    const { c, W, H, lvl } = s, T = s.th.tok, hy = 250, bg = lvl === 2 ? '#06101E' : T.bg, core = '#E6FDFF'; s.st.heads = [];
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    const g = c.createLinearGradient(0, hy - 70, 0, hy + 30); g.addColorStop(0, rgba(T.a1, 0)); g.addColorStop(.75, rgba(T.a1, lvl === 2 ? .08 : .2)); g.addColorStop(1, rgba(T.a1, 0));
    c.fillStyle = g; c.fillRect(0, hy - 70, W, 100);
    s.st.tow.forEach(([x, w, h]) => { c.strokeStyle = rgba(T.a3, lvl === 2 ? .25 : .55); c.lineWidth = 1; c.strokeRect(x, hy - h, w, h); c.fillStyle = rgba(T.a3, .12); for (let y = hy - h + 6; y < hy; y += 7) c.fillRect(x + 2, y, w - 4, 1); c.fillStyle = rgba(T.a1, lvl === 2 ? .3 : .8); c.fillRect(x + w / 2 - 1, hy - h - 3, 2, 3); });
    const sp = [.9, .45, .25, .5][B.i] * [1, .6, .35][lvl]; s.st.ph = (s.st.ph + dt * sp) % 1;
    floorGrid(c, W, H, hy, s.st.ph, lvl === 2 ? T.a1 : T.a3, lvl === 2 ? .08 : .7, lvl === 0);
    c.strokeStyle = rgba(T.a1, lvl === 2 ? .25 : .7); c.lineWidth = 1; c.beginPath(); c.moveTo(0, hy); c.lineTo(W, hy); c.stroke();
    const glowLine = (P, col, wide) => {
      const passes = lvl === 2 ? [[2.5, .9, col]] : [[wide ? 12 : 10, .12, col], [5, .35, col], [2, 1, col === T.a1 ? core : '#FFE2CC']];
      passes.forEach(([lw, a, cc]) => { c.save(); c.globalAlpha *= a; c.strokeStyle = cc; c.lineWidth = lw; c.lineJoin = 'miter'; c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.restore(); });
    };
    const trail = (pts, L, head, len, col) => { const P = []; for (let d = head - len; d <= head; d += 4) P.push(polyAt(pts, L, d)); glowLine(P, col); const h = P[P.length - 1]; s.st.heads.push([h[0], h[1], col]); c.fillStyle = core; c.beginPath(); c.arc(h[0], h[1], 3.5, 0, TAU); c.fill(); };
    const rez = (str, x, y, font, tr, p0, al = 'center') => {
      const wire = clamp(p0 / .7), fill = clamp((p0 - .7) / .5);
      if (lvl === 2) { txt(c, str, x, y, { font, fill: T.ink, track: tr, align: al, alpha: clamp(p0 / .5) }); return; }
      txt(c, str, x, y, { font, stroke: T.a1, lw: 1.2, track: tr, align: al, alpha: wire * (1 - fill * .6) });
      if (fill > 0) txt(c, str, x, y, { font, fill: core, track: tr, align: al, alpha: fill, glow: p0 > 1.3 ? 20 : 0, gc: T.a1 });
    };
    const v = [260, 180, 110][lvl];
    if (B.i === 0) {
      trail(s.st.p1, s.st.L1, t * v, lvl === 2 ? 900 : 560, T.a1);
      if (lvl < 2) trail(s.st.p2, s.st.L2, t * v * .86 + 700, 420, T.a2);
      rez('VECTOR GRID', 480, 140, F(700, 60, 'Orbitron'), 14, B.t);
      txt(c, 'TX-01 · INSIDE THE MACHINE', 480, 182, { font: F(400, 15, 'Share Tech Mono'), fill: T.ink, alpha: .72 * pin(B, .6, 1), track: 4, align: 'center' });
      const op = pout(B, .8); if (op > 0) { if (lvl === 2) { c.globalAlpha = op; c.fillStyle = bg; c.fillRect(120, 80, 720, 115); c.globalAlpha = 1; } else cells(c, op, 120, 80, 720, 115, 10, bg, 7, T.a1); }
    } else if (B.i === 1) {
      rez('02 · THE ROUTE', 480, 92, F(700, 26, 'Orbitron'), 8, B.t);
      txt(c, 'LIGHT-TRAIL CONNECTORS', 480, 118, { font: F(400, 12, 'Share Tech Mono'), fill: T.ink, alpha: .65 * pin(B, .5, .6), track: 4, align: 'center' });
      const R = s.st.route, L = s.st.RL, tot = L[L.length - 1], drawn = eio(pin(B, 3.2, .3)) * tot, a = 1 - pout(B, .5);
      c.save(); c.globalAlpha = a;
      if (lvl < 2 && drawn > 200) { const P = []; for (let d = 0; d <= drawn - 200; d += 4) { const q = polyAt(R, L, Math.min(d, tot - .01)); P.push([q[0], q[1] + 14]); } if (P.length > 1) glowLine(P, T.a2); }
      if (drawn > 1) { const P = []; for (let d = 0; d <= drawn; d += 4) P.push(polyAt(R, L, Math.min(d, tot - .01))); glowLine(P, T.a1, true); const h = P[P.length - 1]; s.st.heads.push([h[0], h[1], T.a1]); c.fillStyle = core; c.beginPath(); c.arc(h[0], h[1], 4, 0, TAU); c.fill(); }
      [[2, 'INGEST'], [4, 'ROUTE'], [6, 'SERVE']].forEach(([vi, lab], k) => {
        const [nx, ny] = R[vi], q = clamp((drawn - L[vi]) / 160); if (q <= 0) return;
        c.save(); c.translate(nx, ny); c.rotate(Math.PI / 4); c.strokeStyle = T.a1; c.lineWidth = 2; c.strokeRect(-7, -7, 14, 14); c.fillStyle = rgba(T.a1, q); c.fillRect(-4, -4, 8, 8); c.restore();
        const bx = nx - 70, by = ny - (k === 1 ? 92 : 86); c.strokeStyle = rgba(T.a1, .9); c.lineWidth = 1.2; rectPerim(c, bx, by, 140, 50, q * 1.4);
        c.fillStyle = rgba(T.a1, .08 * clamp(q * 1.4 - .6)); c.fillRect(bx, by, 140, 50);
        txt(c, lab, nx, by + 24, { font: F(700, 16, 'Orbitron'), fill: core, align: 'center', track: 3, alpha: clamp(q * 2 - .6) });
        txt(c, 'STEP 0' + (k + 1), nx, by + 41, { font: F(400, 11, 'Share Tech Mono'), fill: T.a1, align: 'center', track: 2, alpha: clamp(q * 2 - .8) });
      });
      c.restore();
    } else if (B.i === 2) {
      DATA4['TX-01'](s, t, B, { glowLine, rez, core, hy });
    } else {
      txt(c, '04 · CALL TO ACTION', 480, 92, { font: F(700, 22, 'Orbitron'), fill: T.ink, align: 'center', track: 6, alpha: .85 });
      const bx = 320, by = 270, bw = 320, bh = 64, cp = pin(B, .8), press = B.t > 1.55 && B.t < 1.75;
      c.fillStyle = rgba(T.a1, press ? .3 : .1); c.fillRect(bx, by, bw, bh); c.strokeStyle = rgba(T.a1, .7); c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
      txt(c, 'REQUEST THE BRIEF', 480, by + 40, { font: F(700, 18, 'Orbitron'), fill: core, align: 'center', track: 4 });
      const fr = pin(B, .6, .8); c.save(); if (lvl < 2) { c.shadowBlur = 16; c.shadowColor = T.a1; } c.strokeStyle = T.a1; c.lineWidth = 2.5; rectPerim(c, bx - 9, by - 9, bw + 18, bh + 18, fr); c.restore();
      const tr = pin(B, .6, 1.1); if (tr > 0) [[bx - 9, by - 9, -1, -1], [bx + bw + 9, by - 9, 1, -1], [bx - 9, by + bh + 9, -1, 1], [bx + bw + 9, by + bh + 9, 1, 1]].forEach(([x, y, sx, sy]) => {
        c.strokeStyle = rgba(T.a1, .8); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + sx * 40 * tr, y); c.lineTo(x + sx * 40 * tr, y + sy * 26 * tr); c.stroke();
        if (tr >= 1) { c.fillStyle = core; c.beginPath(); c.arc(x + sx * 40, y + sy * 26, 3, 0, TAU); c.fill(); } });
      const [mx, my] = glide([720, 470], [560, 312], cp); cursor(c, mx, my, press);
      const op = pout(B, .8); if (op > 0) { if (lvl === 2) { c.globalAlpha = op; c.fillStyle = bg; c.fillRect(0, 0, W, H); c.globalAlpha = 1; } else cells(c, op, 0, 0, W, H, 16, bg, 3, T.a1); }
    }
    if (lvl === 0) scanlines(c, W, H, .05);
  }
};

/* ── TX-02 PHOSPHOR RAIN ─────────────────────────────────────────────── */
SCENES['TX-02'] = {
  beats: [['S1', 'Rain resolves the title', 6], ['S2', 'Decode reveal', 4.5], ['S1', 'Freeze-orbit moment', 5], ['S4', 'Glyph data: build, insight, re-sort', 9.5]],
  init(s) {
    const R = s.R; s.st.cols = [];
    for (let i = 0; i < 54; i++) s.st.cols.push({ sp: 70 + R() * 130, off: R() * 900, len: 10 + Math.floor(R() * 18), seed: Math.floor(R() * 1e6), z: R() });
    s.st.src = 'STAGEHANDTHEMECODEX0123456789ABCDEF<>/:=+BHILSIGNALNOISEDECODETRUTH'; s.st.rt = 0; s.st.tot = 0;
  },
  draw(s, t, B, dt = 0) {
    const { c, W, H, lvl } = s, T = s.th.tok, src = s.st.src;
    const grade = B.i === 3 ? pin(B, .6) * (1 - pout(B, .6)) : 0;
    c.fillStyle = mix(T.bg, '#06111B', grade); c.fillRect(0, 0, W, H);
    s.st.tot += dt;
    let sf = [1, .35, 0, 1][B.i]; if (lvl === 2 && s.st.tot % 21 > 3) sf = 0;
    s.st.rt += dt * sf;
    const rt = s.st.rt, A = ([1, .55, .15][lvl]) * [1, .38, .8, .4][B.i], step = 18;
    const phi = B.i === 2 && lvl < 2 ? Math.sin(eio(pin(B, 4.2, .2)) * Math.PI) * .9 : 0;
    const scramble = (str, at, per, seed) => [...str].map((ch, i) => (ch === ' ' || B.t > at + i * per) ? ch : src[hash3(i + seed, Math.floor(t * 18), 9) % src.length]).join('');
    if (lvl < 2) { c.font = F(400, 10, 'Share Tech Mono'); c.textAlign = 'center'; c.textBaseline = 'top';
      for (let i = 0; i < 80; i++) { const x = 6 + i * 12 + (hash3(i, 1, 1) % 6) - Math.sin(phi) * 60, sp = 30 + hash3(i, 2, 2) % 50, len = 8 + hash3(i, 3, 3) % 10, head = Math.floor((((hash3(i, 4, 4) % 900) + rt * sp) % (H + len * 11 + 100)) / 11);
        for (let k = 0; k < len; k++) { const r = head - k; if (r < 0 || r * 11 > H) continue; c.fillStyle = grade > .5 ? rgba(T.a3, A * .25 * (1 - k / len)) : `rgba(0,150,40,${A * .32 * (1 - k / len)})`; c.fillText(src[hash3(i, r, Math.floor(rt * 3)) % src.length], x, r * 11); } } }
    c.font = F(400, 16, 'Share Tech Mono'); c.textAlign = 'center'; c.textBaseline = 'top';
    s.st.cols.forEach((col, i) => {
      const shift = (col.z - .5) * 280 * Math.sin(phi), x = 9 + i * 18 + shift, span = H + col.len * step + 200, dz = phi ? .45 + .55 * col.z : 1;
      const head = Math.floor(((col.off + rt * col.sp) % span) / step);
      for (let k = 0; k < col.len; k++) {
        const r = head - k; if (r < 0 || r > H / step + 1) continue;
        const ch = src[hash3(col.seed, r, Math.floor(rt * 5 + k * .37)) % src.length], f = 1 - k / col.len, a = A * dz;
        if (grade > .5) c.fillStyle = k === 0 ? `rgba(220,235,250,${a})` : rgba(T.a3, a * f * .8);
        else c.fillStyle = k === 0 ? `rgba(213,255,217,${a})` : `rgba(0,${Math.round(110 + 145 * f)},${Math.round(20 + 45 * f)},${a * f})`;
        c.fillText(ch, x, r * step);
      }
    });
    c.textBaseline = 'alphabetic';
    const sc = c.createRadialGradient(480, 270, 40, 480, 270, 380); sc.addColorStop(0, rgba(mix(T.bg, '#06111B', grade), .82)); sc.addColorStop(1, 'rgba(0,5,0,0)'); c.fillStyle = sc; c.fillRect(0, 0, W, H);
    if (B.i === 0) {
      const word = lvl === 2 ? 'PHOSPHOR RAIN' : scramble('PHOSPHOR RAIN', .2, .09, 0), a = 1 - pout(B, .5);
      txt(c, word, 480, 252, { font: F(400, 54, 'Share Tech Mono'), fill: lvl === 2 ? T.ink : T.a1, track: 8, align: 'center', glow: lvl === 2 ? 0 : 16, gc: T.a1, alpha: a });
      txt(c, scramble('SIGNAL CONFIDENCE 97.4% · SAMPLE', 1.2, .03, 40), 480, 296, { font: F(400, 24, 'VT323'), fill: T.ink, alpha: .85 * a, track: 2, align: 'center' });
      txt(c, 'TX-02 · RAIN BUILT FROM THIS SUBJECT’S OWN WORDS', 480, 500, { font: F(400, 13, 'Share Tech Mono'), fill: T.a3, alpha: .8, track: 3, align: 'center' });
    } else if (B.i === 1) {
      const back = pout(B, .6), un = (str, at, seed) => back > 0 ? [...str].map((ch, i) => (ch === ' ' || (hash3(i, seed, 3) % 100) / 100 > back) ? ch : src[hash3(i, Math.floor(t * 18), seed) % src.length]).join('') : scramble(str, at, .03, seed);
      txt(c, un('02 · WHAT THE LOGS SAID', .1, 60), 150, 170, { font: F(400, 34, 'Share Tech Mono'), fill: T.a1, track: 4, glow: lvl === 2 ? 0 : 10, gc: T.a1 });
      ['1,204 sessions shared one origin.', 'The origin rotated every six hours.', 'Nobody owned the rotation.'].forEach((l, i) => txt(c, un(l, .9 + i * .6, 70 + i), 150, 240 + i * 46, { font: F(400, 30, 'VT323'), fill: T.ink, alpha: clamp((B.t - .8 - i * .6) * 4) }));
      txt(c, 'SAMPLE LOG EXCERPT · DECODE REVEAL', 150, 400, { font: F(400, 12, 'Share Tech Mono'), fill: T.a3, track: 3, alpha: .8 * pin(B, .4, 2.4) });
    } else if (B.i === 2) {
      const a = pin(B, .5) * (1 - pout(B, .5)), cx = 480, cy = 270;
      c.save(); c.globalAlpha = a;
      [30, 52, 78].forEach((r, k) => { c.save(); c.translate(cx, cy); c.rotate(t * (k % 2 ? -.4 : .3)); c.setLineDash([4, 6 + k * 4]); c.strokeStyle = rgba(T.a1, .6 - k * .15); c.lineWidth = 1.2; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke(); c.restore(); });
      c.shadowBlur = 24; c.shadowColor = T.a1; c.fillStyle = T.a1; c.beginPath(); c.arc(cx, cy, 9, 0, TAU); c.fill(); c.shadowBlur = 0;
      c.strokeStyle = rgba(T.a1, .8); c.lineWidth = 1; c.beginPath(); c.moveTo(cx + 12, cy - 8); c.lineTo(cx + 110, cy - 70); c.lineTo(cx + 300, cy - 70); c.stroke();
      txt(c, 'ORIGIN 0x1F', cx + 116, cy - 78, { font: F(400, 28, 'VT323'), fill: T.a1 });
      txt(c, 'ROTATES EVERY 6H · SAMPLE', cx + 116, cy - 52, { font: F(400, 18, 'VT323'), fill: T.ink, alpha: .8 });
      txt(c, 'FREEZE-ORBIT · ONE DATA MOMENT', 480, 70, { font: F(400, 14, 'Share Tech Mono'), fill: T.ink, align: 'center', track: 4, alpha: .8 });
      c.restore();
    } else {
      DATA4['TX-02'](s, t, B, { scramble, src, grade });
    }
    if (lvl < 2) { scanlines(c, W, H, .07); vignette(c, W, H, .7); }
  }
};

/* ── TX-03 GLASS HUD ─────────────────────────────────────────────────── */
SCENES['TX-03'] = {
  beats: [['S1', 'Panels boot up', 6], ['S2', 'Push into a panel', 4.5], ['S4', 'Gauges, limit, ranked ladder', 9.5], ['S5', 'Target lock', 3.5]],
  init(s) { s.st.bars = [.82, .64, .91, .47, .73]; },
  draw(s, t, B) {
    const { c, W, H, lvl } = s, T = s.th.tok, cx = 480, cy0 = 290;
    const bg = c.createRadialGradient(cx, cy0, 30, cx, cy0, 620); bg.addColorStop(0, '#0B1A2C'); bg.addColorStop(1, T.bg); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.fillStyle = rgba(T.a1, .07); for (let y = 12; y < H; y += 24) for (let x = 12; x < W; x += 24) c.fillRect(x, y, 1.2, 1.2);
    const bracket = (x, y, w, h, k, a, lw = 2) => { const bl = 12; c.strokeStyle = rgba(T.a1, .9 * a); c.lineWidth = lw;
      [[0, 0, 1, 1], [w, 0, -1, 1], [0, h, 1, -1], [w, h, -1, -1]].forEach(([bx, by, sx, sy]) => { const ox = (bx - w / 2) * (k - 1), oy = (by - h / 2) * (k - 1); c.beginPath(); c.moveTo(x + bx + ox, y + by + oy + sy * bl); c.lineTo(x + bx + ox, y + by + oy); c.lineTo(x + bx + ox + sx * bl, y + by + oy); c.stroke(); }); };
    const panelBox = (x, y, w, h, p) => { c.fillStyle = rgba(T.a1, .05 * p); rr(c, x, y, w, h, 6); c.fill(); c.strokeStyle = rgba(T.a1, .35 * p); c.lineWidth = 1; rr(c, x, y, w, h, 6); c.stroke(); bracket(x, y, w, h, lerp(1.35, 1, p), p); };
    const spark = (x, y, w, h, prog, axes) => {
      const L = SAMPLE.line, n = L.length, px = j => x + 12 + j / (n - 1) * (w - 24), py = v => y + h - 16 - v * (h - 50), m = Math.max(1, Math.floor(prog * (n - 1)));
      if (axes) { c.strokeStyle = rgba(T.a1, .15); c.lineWidth = 1; for (let k = 0; k <= 4; k++) { const yy = py(k / 4); c.beginPath(); c.moveTo(x + 12, yy); c.lineTo(x + w - 12, yy); c.stroke(); txt(c, (k / 4).toFixed(2), x + w - 10, yy - 3, { font: F(400, 10, 'B612 Mono'), fill: T.ink, alpha: .5, align: 'right' }); }
        for (let j = 0; j < n; j += 3) txt(c, 'W' + (j + 1), px(j), y + h - 2, { font: F(400, 10, 'B612 Mono'), fill: T.ink, alpha: .5, align: 'center' }); }
      const ag = c.createLinearGradient(0, y + 30, 0, y + h); ag.addColorStop(0, rgba(T.a1, .25)); ag.addColorStop(1, rgba(T.a1, 0));
      c.beginPath(); for (let j = 0; j <= m; j++) j ? c.lineTo(px(j), py(L[j])) : c.moveTo(px(j), py(L[j])); c.lineTo(px(m), y + h - 16); c.lineTo(px(0), y + h - 16); c.fillStyle = ag; c.fill();
      c.beginPath(); for (let j = 0; j <= m; j++) j ? c.lineTo(px(j), py(L[j])) : c.moveTo(px(j), py(L[j])); c.strokeStyle = T.a1; c.lineWidth = axes ? 2.2 : 1.5; c.stroke();
      c.setLineDash([3, 4]); c.strokeStyle = rgba(T.a2, .85); c.beginPath(); c.moveTo(x + 12, py(.75)); c.lineTo(x + w - 12, py(.75)); c.stroke(); c.setLineDash([]);
      return { px, py };
    };
    const title = () => { txt(c, 'GLASS HUD', 40, 62, { font: F(600, 30, 'Chakra Petch'), fill: T.ink, track: 4 }); txt(c, 'TX-03 · FORESIGHT OVERLAY', 41, 84, { font: F(400, 11, 'B612 Mono'), fill: T.a1, track: 2 }); };
    if (B.i === 0 || B.i === 1) {
      const z = B.i === 1 ? eio(pin(B, .9)) * (1 - eio(pout(B, .7))) : 0, rest = 1 - z, boot = B.i === 0 && lvl < 2 ? eo(pin(B, 1.4, .2)) : 1;
      c.save(); c.globalAlpha = rest;
      if (lvl < 2) [190, 245].forEach((r, i) => { c.save(); c.translate(cx, cy0); c.rotate(t * (i ? -.08 : .12)); c.strokeStyle = rgba(T.a1, .1); c.setLineDash([3, 9 + i * 6]); c.lineWidth = 1; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke(); c.restore(); });
      c.strokeStyle = rgba(T.a1, .14); c.lineWidth = 10; c.beginPath(); c.arc(cx, cy0, 96, 0, TAU); c.stroke();
      c.strokeStyle = T.a1; c.beginPath(); c.arc(cx, cy0, 96, -Math.PI / 2, -Math.PI / 2 + TAU * .874 * boot); c.stroke();
      if (lvl < 2) { const a = t * 1.4; const sg = c.createConicGradient ? c.createConicGradient(a, cx, cy0) : null; if (sg) { sg.addColorStop(0, rgba(T.a1, .22)); sg.addColorStop(.12, rgba(T.a1, 0)); sg.addColorStop(1, rgba(T.a1, 0)); c.fillStyle = sg; c.beginPath(); c.arc(cx, cy0, 86, 0, TAU); c.fill(); } }
      const th = -Math.PI / 2 + TAU * .8; c.strokeStyle = T.a2; c.lineWidth = 3; c.beginPath(); c.moveTo(cx + Math.cos(th) * 84, cy0 + Math.sin(th) * 84); c.lineTo(cx + Math.cos(th) * 110, cy0 + Math.sin(th) * 110); c.stroke();
      c.save(); c.translate(cx, cy0); c.rotate(lvl === 2 ? 0 : t * .05);
      for (let i = 0; i < 60; i++) { const a = i / 60 * TAU, r2 = i % 5 ? 121 : 127; c.strokeStyle = rgba(T.a1, i % 5 ? .3 : .6); c.lineWidth = 1; c.beginPath(); c.moveTo(Math.cos(a) * 116, Math.sin(a) * 116); c.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); c.stroke(); }
      c.restore();
      txt(c, (SAMPLE.kpi * boot).toFixed(1), cx, cy0 + 14, { font: F(400, 46, 'B612 Mono'), fill: T.ink, align: 'center' });
      txt(c, '% CONFIDENCE · SAMPLE', cx, cy0 + 40, { font: F(400, 11, 'B612 Mono'), fill: T.a1, align: 'center', track: 2, alpha: .85 });
      const panels = [[50, 110, 240, 132, 'SIGNAL TREND'], [680, 120, 230, 128, 'ASSET LADDER'], [60, 372, 270, 112, 'STATUS']];
      panels.forEach(([x, y, w, h, label], i) => {
        const p = B.i === 1 || lvl === 2 ? 1 : eo(pin(B, .8, .3 + i * .35)), dx = lvl === 2 ? 0 : Math.sin(t * .6 + i * 2) * 3, dy = lvl === 2 ? 0 : Math.cos(t * .5 + i) * 2;
        if (i === 0 && z > 0) return;
        const lp = B.i === 0 ? pin(B, .6, 1.6 + i * .2) : 1, ex = i === 1 ? x : x + w, ey = y + h / 2;
        if (lp > 0) { const ang = Math.atan2(ey - cy0, ex - cx), rx = cx + Math.cos(ang) * 130, ry = cy0 + Math.sin(ang) * 130; c.strokeStyle = rgba(T.a1, .35); c.lineWidth = 1; c.beginPath(); c.moveTo(ex + dx, ey + dy); c.lineTo(lerp(ex + dx, rx, lp), lerp(ey + dy, ry, lp)); c.stroke(); if (lp >= 1) { c.fillStyle = T.a1; c.beginPath(); c.arc(rx, ry, 2.5, 0, TAU); c.fill(); } }
        c.save(); c.translate(dx, dy); panelBox(x, y, w, h, p); c.globalAlpha *= p;
        txt(c, label, x + 12, y + 20, { font: F(600, 12, 'Chakra Petch'), fill: T.a1, track: 2 });
        if (i === 0) spark(x, y, w, h, 1, false);
        else if (i === 1) { s.st.bars.forEach((v, j) => { const by = y + 34 + j * 18; txt(c, 'N' + (j + 1), x + 12, by + 9, { font: F(400, 10, 'B612 Mono'), fill: T.ink, alpha: .7 }); c.fillStyle = rgba(T.a1, .15); c.fillRect(x + 38, by, w - 54, 9); c.fillStyle = v > .8 ? T.a2 : T.a1; c.fillRect(x + 38, by, (w - 54) * v * p, 9); }); c.fillStyle = T.a2; c.fillRect(x + 38 + (w - 54) * .8, y + 30, 1.5, 96); }
        else [['[OK]', 'Uplink parity', T.a1], ['[WATCH]', 'Rival price drift', T.a2], ['[OK]', 'Source freshness', T.a1]].forEach(([tag, l, col], j) => { txt(c, tag, x + 12, y + 46 + j * 22, { font: F(400, 12, 'B612 Mono'), fill: col }); txt(c, l, x + 84, y + 46 + j * 22, { font: F(400, 13, 'Inter'), fill: T.ink, alpha: .85 }); });
        c.restore();
      });
      c.restore();
      if (z > 0) {
        const r0 = [50, 110, 240, 132], r1 = [100, 96, 760, 380], q = z, x = lerp(r0[0], r1[0], q), y = lerp(r0[1], r1[1], q), w = lerp(r0[2], r1[2], q), h = lerp(r0[3], r1[3], q);
        panelBox(x, y, w, h, 1);
        txt(c, 'SIGNAL TREND · 12 WEEKS · SAMPLE', x + 14, y + 22, { font: F(600, 12 + 4 * q, 'Chakra Petch'), fill: T.a1, track: 2 });
        const { px, py } = spark(x, y + 10, w, h - 10, 1, q > .6);
        if (q > .9) { const cp = pin(B, 2.6, 1), j = cp * 11, j0 = Math.floor(j), f = j - j0, v = lerp(SAMPLE.line[j0], SAMPLE.line[Math.min(11, j0 + 1)], f), mx = lerp(px(j0), px(Math.min(11, j0 + 1)), f), my = py(v);
          c.strokeStyle = rgba(T.ink, .5); c.lineWidth = 1; c.beginPath(); c.moveTo(mx, y + 40); c.lineTo(mx, y + h - 16); c.stroke();
          const hot = v > .75; c.fillStyle = hot ? T.a2 : T.a1; c.beginPath(); c.arc(mx, my, hot ? 6 : 4, 0, TAU); c.fill();
          if (hot && lvl < 2) { c.strokeStyle = rgba(T.a2, .5); c.beginPath(); c.arc(mx, my, 10 + (t * 20 % 10), 0, TAU); c.stroke(); }
          const bx = Math.min(mx + 12, x + w - 130); c.fillStyle = 'rgba(5,11,20,.9)'; c.fillRect(bx, my - 46, 118, 32); c.strokeStyle = hot ? T.a2 : T.a1; c.strokeRect(bx, my - 46, 118, 32);
          txt(c, `W${j0 + 1} · ${v.toFixed(2)}`, bx + 10, my - 25, { font: F(400, 14, 'B612 Mono'), fill: hot ? T.a2 : T.ink }); }
      }
    } else if (B.i === 2) {
      DATA4['TX-03'](s, t, B, {});
    } else {
      const chip = [600, 330, 190, 46], lk = eio(pin(B, 1.2, .2)), x = lerp(330, chip[0] - 10, lk), y = lerp(150, chip[1] - 10, lk), w = lerp(300, chip[2] + 20, lk), h = lerp(260, chip[3] + 20, lk);
      const a = 1 - pout(B, .5);
      c.save(); c.globalAlpha = a;
      txt(c, 'TARGET LOCK', 40, 140, { font: F(600, 22, 'Chakra Petch'), fill: T.ink, track: 4 });
      txt(c, 'S5 · FOCUS STATE FOR THE PAGE’S ONE ACTION', 40, 162, { font: F(400, 11, 'B612 Mono'), fill: T.a1, track: 2 });
      c.fillStyle = rgba(T.a1, lk >= 1 ? .2 : .08); rr(c, chip[0], chip[1], chip[2], chip[3], 6); c.fill(); c.strokeStyle = rgba(T.a1, .6); c.lineWidth = 1; rr(c, chip[0], chip[1], chip[2], chip[3], 6); c.stroke();
      txt(c, 'OPEN BRIEF ▶', chip[0] + chip[2] / 2, chip[1] + 29, { font: F(600, 16, 'Chakra Petch'), fill: T.ink, align: 'center', track: 2 });
      const snap = lk >= 1 ? lerp(1.3, 1, eo(pin(B, .25, 1.4))) : 1; bracket(x, y, w, h, snap, 1, 2.5);
      if (lk < 1) { c.strokeStyle = rgba(T.a1, .3); c.beginPath(); c.moveTo(x + w / 2, y - 20); c.lineTo(x + w / 2, y + h + 20); c.moveTo(x - 20, y + h / 2); c.lineTo(x + w + 20, y + h / 2); c.stroke(); }
      if (B.t > 1.55) { const on = lvl === 2 || B.t > 2.1 || (B.t % .5) < .3; txt(c, 'LOCKED', chip[0] + chip[2] / 2, chip[1] + chip[3] + 34, { font: F(400, 13, 'B612 Mono'), fill: T.a2, align: 'center', track: 6, alpha: on ? 1 : .25 }); }
      c.restore();
    }
    title();
  }
};

/* ── TX-04 RAINLIGHT NOIR ────────────────────────────────────────────── */
SCENES['TX-04'] = {
  beats: [['S1', 'Neon sign in the rain', 6.5], ['S2', 'Slow push through haze', 5], ['S4', 'Billboards: gap, then ranked', 9.5]],
  init(s) {
    const R = s.R, T = s.th.tok;
    s.st.bokeh = Array.from({ length: 24 }, () => ({ x: R() * 960, y: 40 + R() * 340, r: 18 + R() * 60, col: [T.a1, T.a2, T.a3][Math.floor(R() * 3)], ph: R() * TAU }));
    s.st.bld = []; let x = 0; while (x < 960) { const w = 40 + R() * 80, h = 120 + R() * 220; const win = []; for (let i = 0; i < 30; i++) if (R() < .35) win.push([R() * (w - 10) + 4, R() * (h - 20) + 10, R()]); s.st.bld.push([x, w, h, win]); x += w + 2; }
    s.st.rain = Array.from({ length: 190 }, () => [R(), R(), .7 + R() * .6]);
    s.st.drops = Array.from({ length: 34 }, () => [R() * 960, R() * 540, 2 + R() * 4, 4 + R() * 12]);
    s.st.tot = 0;
  },
  draw(s, t, B, dt = 0) {
    const { c, W, H, lvl } = s, T = s.th.tok, street = 452;
    s.st.tot += dt;
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);
    const z = B.i === 1 ? 1 + .22 * eio(pin(B, 4.6)) : 1;
    c.save(); c.translate(480, 300); c.scale(z, z); c.translate(-480, -300);
    s.st.bokeh.forEach(b => { const x = b.x + (lvl === 2 ? 0 : Math.sin(t * .1 + b.ph) * 12), g = c.createRadialGradient(x, b.y, 0, x, b.y, b.r); g.addColorStop(0, rgba(b.col, .24)); g.addColorStop(1, rgba(b.col, 0)); c.fillStyle = g; c.beginPath(); c.arc(x, b.y, b.r, 0, TAU); c.fill(); });
    s.st.bld.forEach(([x, w, h, win]) => { c.fillStyle = '#07090E'; c.fillRect(x, street - h, w, h); win.forEach(([wx, wy, k]) => { c.fillStyle = rgba(k > .8 ? T.a3 : T.a1, .3); c.fillRect(x + wx, street - h + wy, 3, 4); }); });
    const sign = (str, x, y, col, on, size = 22) => { [...str].forEach((ch, i) => txt(c, ch, x, y + i * (size + 4), { font: F(600, size, 'Saira Condensed'), fill: on ? '#FFE9F2' : rgba(col, .2), align: 'center', glow: on && lvl < 2 ? 14 : 0, gc: col })); };
    sign('HOTEL', 132, 150, T.a1, lvl === 2 || Math.sin(t * .9) > -.85);
    sign('24H', 610, 200, T.a3, lvl === 2 || Math.sin(t * .7 + 2) > -.9, 20);
    c.fillStyle = '#05060A'; c.fillRect(0, street, W, H - street);
    const ref = c.createLinearGradient(0, street, 0, H); ref.addColorStop(0, 'rgba(255,46,136,.12)'); ref.addColorStop(1, 'rgba(255,46,136,0)'); c.fillStyle = ref; c.fillRect(0, street, W, H - street);
    for (let i = 0; i < 26; i++) { const x = (i * 37 + 13) % 960; c.fillStyle = rgba([T.a1, T.a2, T.a3][i % 3], .1); c.fillRect(x, street + 4, 2 + (i % 3), 40 + (i % 5) * 12); }
    if (lvl === 0) { const cy = t % 7; if (cy < 1.4) { const x = cy / 1.4 * 1400 - 240, g = c.createLinearGradient(x - 220, 0, x, 0); g.addColorStop(0, 'rgba(255,240,220,0)'); g.addColorStop(1, 'rgba(255,240,220,.55)'); c.fillStyle = g; c.fillRect(x - 220, street + 22, 220, 3); } }
    c.restore();
    const fogT = lvl === 2 ? 0 : t, fogA = .07 + (B.i === 1 ? .1 * Math.sin(Math.PI * B.p) : 0);
    [[360, 10], [430, 16], [300, 7]].forEach(([y, v], i) => { const fx = ((fogT * v + i * 300) % 1400) - 220, g = c.createRadialGradient(fx, y, 0, fx, y, 440); g.addColorStop(0, `rgba(201,211,218,${fogA})`); g.addColorStop(1, 'rgba(201,211,218,0)'); c.fillStyle = g; c.fillRect(0, y - 160, W, 320); });
    if (B.i === 0) {
      const bt = B.t, on = lvl > 0 || bt < .1 || (bt > .4 && bt < .5) || bt > .8, font = F(600, 76, 'Saira Condensed'), a = 1 - pout(B, .6);
      c.save(); c.globalAlpha = a;
      if (lvl === 2) { txt(c, 'RAINLIGHT NOIR', 60, 292, { font, fill: T.ink, track: 6 }); c.fillStyle = T.a2; c.fillRect(62, 306, tw(c, 'RAINLIGHT NOIR', font, 6), 3); }
      else {
        txt(c, 'RAINLIGHT NOIR', 60, 292, { font, fill: on ? '#FFD3E6' : rgba(T.a2, .16), track: 6, glow: on ? 26 : 0, gc: T.a2 });
        c.save(); c.translate(0, street * 2 - 292 + 30); c.scale(1, -.55); txt(c, 'RAINLIGHT NOIR', 60, 292, { font, fill: rgba(T.a2, on ? .22 : .04), track: 6 }); c.restore();
      }
      txt(c, 'TX-04 · THE CITY WATCHES BACK', 62, 334, { font: F(400, 15, 'Share Tech Mono'), fill: T.a3, track: 3 });
      c.restore();
    } else if (B.i === 1) {
      const a = pin(B, .8, .6) * (1 - pout(B, .6));
      c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(5,7,11,.55)'; c.fillRect(40, 300, 560, 130);
      txt(c, '02 · WHO IS WATCHING', 60, 336, { font: F(400, 13, 'Share Tech Mono'), fill: T.a3, track: 4 });
      const f2 = F(600, 40, 'Saira Condensed'); txt(c, 'Every street keeps a ledger.', 60, 386, { font: f2, fill: T.ink, track: 1 });
      c.fillStyle = T.a2; c.fillRect(62, 400, tw(c, 'Every street keeps a ledger.', f2, 1) * eio(pin(B, 1, 1.4)), 3);
      txt(c, 'S2 · SLOW PUSH-IN THROUGH HAZE', 60, 422, { font: F(400, 11, 'Share Tech Mono'), fill: T.ink, alpha: .6, track: 3 });
      c.restore();
    } else {
      DATA4['TX-04'](s, t, B, {});
    }
    const rt = lvl === 2 ? Math.min(s.st.tot % 17.5, 5) : t;
    c.strokeStyle = 'rgba(201,211,218,.22)'; c.lineWidth = 1; c.beginPath();
    s.st.rain.forEach(([a, b, k]) => { const x = (a * W + rt * 20) % W, y = ((b * (H + 60) + rt * 640 * k) % (H + 60)) - 40; c.moveTo(x, y); c.lineTo(x - 3, y + 20); });
    c.stroke();
    if (lvl === 0) s.st.drops.forEach(([x, y0, r, v]) => { const y = (y0 + t * v) % H; c.fillStyle = 'rgba(255,255,255,.05)'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 1; c.beginPath(); c.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.6); c.stroke(); });
    vignette(c, W, H, .65);
  }
};

/* ── TX-05 STUTTER BROADCAST ─────────────────────────────────────────── */
SCENES['TX-05'] = {
  beats: [['S1', 'On air', 5], ['S2', 'Stutter headline', 4], ['S4', 'Three channels, three insights', 9.5], ['S5', 'Chyron and ticker', 4]],
  init(s) {
    const pts = [], n = 240, g = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = g * i; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    s.st.sphere = pts;
  },
  draw(s, t, B) {
    const { c, W, H, lvl } = s, T = s.th.tok;
    const host = (cx, cy, rad) => { const rot = t * .6; s.st.sphere.map(([x, y, z]) => [x * Math.cos(rot) - z * Math.sin(rot), y, x * Math.sin(rot) + z * Math.cos(rot)]).sort((a, b) => a[2] - b[2]).forEach(([x, y, z]) => { const k = (z + 1.6) / 2.6; c.fillStyle = z > 0 ? rgba(T.a2, .35 + .6 * k) : rgba(T.a1, .25 + .4 * k); c.beginPath(); c.arc(cx + x * rad, cy + y * rad, (1.2 + 2.2 * k) * rad / 78, 0, TAU); c.fill(); }); };
    const meter = (x, y, sc) => { const talk = lvl === 2 ? .4 : .5 + .5 * Math.abs(Math.sin(t * 7.3) * Math.sin(t * 2.1)); for (let i = 0; i < 9; i++) { const hh = (6 + 22 * talk * Math.abs(Math.sin(i * 1.7 + t * (lvl === 2 ? 0 : 9)))) * sc; c.fillStyle = i % 2 ? T.a1 : T.a2; c.fillRect(x + i * 10 * sc, y - hh, 6 * sc, hh); } };
    const ticker = () => { c.fillStyle = '#000'; c.fillRect(0, 444, W, 34); const tick = 'TX-05 STUTTER BROADCAST · CHANNEL 20 · AN ORIGINAL SYNTHETIC HOST · NEWS-DESK FORMAT FOR THE BOARDROOM · ', tf = F(400, 24, 'VT323'); const twd = tw(c, tick, tf), off = (t * 70) % twd; for (let x = -off; x < W; x += twd) txt(c, tick, x, 469, { font: tf, fill: T.ink, alpha: .9 }); };
    const box = () => {
      if (lvl === 2) return;
      const ay = t * .5, ax = .45 + Math.sin(t * .3) * .2, cols = [T.a1, T.a2, T.a3, '#2B2BFF', T.a1, T.a2];
      const pr = (x, y, z) => { let X = x * Math.cos(ay) - z * Math.sin(ay), Z = x * Math.sin(ay) + z * Math.cos(ay); const Y = y * Math.cos(ax) - Z * Math.sin(ax); Z = y * Math.sin(ax) + Z * Math.cos(ax); const k = 330 / (Z + 3.2); return [480 + X * k, 250 + Y * k]; };
      c.lineWidth = 1;
      [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1]].forEach(([a_, sg], fi) => { c.strokeStyle = rgba(cols[fi], lvl === 1 ? .3 : .55); c.beginPath();
        for (let k = -3; k <= 3; k++) { const u = k / 3, P = (a, b) => { const v = [0, 0, 0]; v[a_] = sg; v[(a_ + 1) % 3] = a; v[(a_ + 2) % 3] = b; return pr(v[0] * 1.4, v[1] * 1.4, v[2] * 1.4); }; let a = P(u, -1), b = P(u, 1); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); a = P(-1, u); b = P(1, u); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
        c.stroke(); });
    };
    const stutter = (frames, bt, x, y, font, al = 'center', fill = T.ink) => {
      let i = 0, acc = 0; while (i < frames.length - 1 && bt > acc + frames[i][1]) { acc += frames[i][1]; i++; }
      const word = lvl === 2 ? frames[frames.length - 1][0] : frames[i][0], jit = lvl < 2 && i < frames.length - 1 ? ((hash3(Math.floor(t * 8.3), 2, 3) % 7) - 3) : 0;
      if (lvl === 0) { c.save(); c.globalCompositeOperation = 'lighter'; txt(c, word, x + jit - 3, y, { font, fill: rgba(T.a1, .9), align: al, track: 2 }); txt(c, word, x + jit + 3, y, { font, fill: rgba(T.a2, .9), align: al, track: 2 }); c.restore(); }
      txt(c, word, x + jit, y, { font, fill, align: al, track: 2 });
    };
    if (lvl === 2) { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0A1430'); g.addColorStop(1, '#000'); c.fillStyle = g; } else c.fillStyle = T.bg;
    c.fillRect(0, 0, W, H);
    if (B.i === 0) {
      box();
      c.fillStyle = '#000'; rr(c, 330, 104, 300, 236, 14); c.fill(); c.strokeStyle = T.ink; c.lineWidth = 3; rr(c, 330, 104, 300, 236, 14); c.stroke();
      c.save(); rr(c, 332, 106, 296, 232, 12); c.clip(); host(480, 214, 78); meter(436, 322, 1); c.restore();
      c.fillStyle = (lvl === 2 || (t % 1) < .5) ? '#FF2B2B' : 'rgba(255,43,43,.25)'; c.beginPath(); c.arc(352, 124, 5, 0, TAU); c.fill(); txt(c, 'ON AIR', 362, 130, { font: F(400, 18, 'VT323'), fill: T.ink });
      c.strokeStyle = rgba(T.ink, .6); c.lineWidth = 1; c.strokeRect(22, 22, 96, 26); txt(c, 'CH 20 LIVE', 70, 41, { font: F(400, 13, 'Bungee'), fill: T.ink, align: 'center', alpha: .85 });
      stutter([['STU', .36], ['STU-STU', .36], ['STU-STU-STU', .36], ['STUTTER BROADCAST', 9]], B.t, 480, 76, F(400, 40, 'Bungee'));
      c.fillStyle = T.a3; c.fillRect(0, 396, W, 48); c.fillStyle = '#000'; c.fillRect(0, 396, 150, 48);
      txt(c, 'BREAKING', 75, 428, { font: F(400, 18, 'Bungee'), fill: T.a3, align: 'center' }); txt(c, 'AN ORIGINAL SYNTHETIC HOST GOES LIVE', 168, 428, { font: F(400, 18, 'Bungee'), fill: '#000' });
      ticker();
    } else if (B.i === 1) {
      if (lvl < 2) { c.fillStyle = '#2B2BFF'; c.beginPath(); c.moveTo(0, 0); c.lineTo(620, 0); c.lineTo(340, H); c.lineTo(0, H); c.closePath(); c.fill(); c.fillStyle = T.a1; c.beginPath(); c.moveTo(620, 0); c.lineTo(W, 0); c.lineTo(W, H); c.lineTo(340, H); c.closePath(); c.fill(); }
      stutter([['RE-', .3], ['RE-RE-', .3], ['RE-RE-RE-', .3], ['RE-RE-REVENUE', 9]], B.t, 480, 250, F(400, 74, 'Bungee'));
      if (B.t > 1.3) stutter([['IS', .2], ['IS MO-', .25], ['IS MO-MO-', .25], ['IS MOVING.', 9]], B.t - 1.3, 480, 340, F(400, 74, 'Bungee'), 'center', T.a3);
      const fr = Math.floor(t * 25) % 25, sec = Math.floor(t) % 60; txt(c, `TC 00:20:${String(sec).padStart(2, '0')}:${String(fr).padStart(2, '0')}`, 30, 512, { font: F(400, 26, 'VT323'), fill: T.ink, alpha: .9 });
      txt(c, 'S2 · STUTTER-REPEAT HEADLINE', 930, 512, { font: F(400, 13, 'Space Grotesk'), fill: T.ink, align: 'right', track: 2 });
    } else if (B.i === 2) {
      DATA4['TX-05'](s, t, B, { box });
    } else {
      const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0B1028'); g.addColorStop(1, '#000'); c.fillStyle = g; c.fillRect(0, 0, W, H);
      c.strokeStyle = 'rgba(0,240,255,.12)'; c.lineWidth = 1; for (let x = 0; x < W; x += 48) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 380); c.stroke(); }
      c.fillStyle = '#000'; rr(c, 610, 60, 300, 200, 10); c.fill(); c.strokeStyle = T.ink; c.lineWidth = 2; rr(c, 610, 60, 300, 200, 10); c.stroke();
      c.save(); rr(c, 612, 62, 296, 196, 9); c.clip(); host(760, 150, 62); meter(718, 248, .8); c.restore();
      txt(c, 'THE HOST WILL TAKE', 50, 150, { font: F(400, 44, 'Bungee'), fill: T.ink }); txt(c, 'YOUR QUESTIONS NOW.', 50, 204, { font: F(400, 44, 'Bungee'), fill: T.ink });
      const l1 = eo(pin(B, .5, .3)), l2 = eo(pin(B, .5, 1.1));
      c.fillStyle = '#fff'; c.fillRect(-420 + 470 * l1, 300, 420, 44); c.fillStyle = T.a3; c.fillRect(-420 + 470 * l1, 344, 420, 8);
      txt(c, 'HOST-20 · SYNTHETIC CORRESPONDENT', -404 + 470 * l1, 330, { font: F(400, 16, 'Bungee'), fill: '#000' });
      c.fillStyle = T.a1; c.fillRect(W - 360 * l2, 364, 360, 40); txt(c, '4,812 QUESTIONS · SAMPLE', W - 344 * l2, 391, { font: F(400, 17, 'Bungee'), fill: '#fff' });
      ticker();
      txt(c, 'S5 · LOWER THIRDS + TICKER', 480, 512, { font: F(400, 13, 'Space Grotesk'), fill: T.ink, align: 'center', alpha: .6, track: 2 });
    }
    if (lvl === 0) { const cyc = t % 6; if (cyc < .4) noiseBand(c, cyc / .4 * H, 30, t, .2); scanlines(c, W, H, .08); }
  }
};
