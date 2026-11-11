/* ── jagged cut-paper helpers ────────────────────────────────────────── */
function jagPath(c, pts, seed, amp = 1.6, stepLen = 13) {
  c.beginPath(); let first = true;
  pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length], n = Math.max(2, Math.floor(Math.hypot(q[0] - p[0], q[1] - p[1]) / stepLen));
    for (let k = 0; k < n; k++) { const u = k / n, nx = -(q[1] - p[1]), ny = q[0] - p[0], ln = Math.hypot(nx, ny) || 1, j = ((hash3(i, k, seed) % 100) / 100 - .5) * 2 * amp;
      const x = lerp(p[0], q[0], u) + nx / ln * j, y = lerp(p[1], q[1], u) + ny / ln * j; first ? c.moveTo(x, y) : c.lineTo(x, y); first = false; } });
  c.closePath();
}
const jagRect = (c, x, y, w, h, seed) => jagPath(c, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], seed);
const jagCircle = (c, cx, cy, r, seed) => jagPath(c, Array.from({ length: 28 }, (_, k) => [cx + Math.cos(k / 28 * TAU) * r, cy + Math.sin(k / 28 * TAU) * r]), seed, 1.4, 9);

/* ── TX-16 PAPER CUT TITLES ──────────────────────────────────────────── */
SCENES['TX-16'] = {
  beats: [['S1', 'Shapes assemble to the beat', 6], ['S2', 'Shapes become the diagram', 4.5], ['S4', 'Cut strips re-cut on the beat', 9.5], ['S5', 'Nudge and tag', 2.5]],
  init(s) {
    const T = s.th.tok;
    s.st.shapes = [
      { k: 'r', w: 430, h: 44, col: T.a1, P: [[1200, 330, .4], [700, 420, .2], [380, 336, -.05], [330, 336, 0]] },
      { k: 'c', r: 70, col: T.ink, P: [[880, -120, 0], [820, 120, 0], [790, 168, 0], [780, 170, 0]] },
      { k: 'r', w: 46, h: 300, col: T.a3, P: [[690, 700, .6], [720, 420, .2], [700, 330, .05], [698, 322, 0]] },
      { k: 'a', col: T.a2, P: [[1100, 520, 0], [930, 460, -2], [880, 400, -2.6], [868, 392, -2.45]] },
      { k: 'r', w: 300, h: 10, col: T.ink, P: [[-320, 160, 0], [100, 120, .3], [220, 168, .04], [214, 166, 0]] },
      { k: 'r', w: 60, h: 60, col: T.a1, P: [[-80, 600, .8], [60, 470, .4], [96, 428, .1], [96, 430, 0]] }
    ];
  },
  draw(s, t, B) {
    const { c, W, H, lvl } = s, T = s.th.tok, beat = lvl === 2 ? .75 : .469;
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);
    const nb = Math.floor(B.t / beat), qb = (() => { let q = clamp((B.t % beat) / (lvl === 2 ? .45 : .14)); return lvl === 0 ? stepq(p4(q), 4) : (lvl === 2 ? eio(q) : p4(q)); })();
    const shape = (sh, x, y, r, sc = 1, seed = 1) => { c.save(); c.translate(x, y); c.rotate(r); c.scale(sc, sc); c.fillStyle = sh.col; c.shadowColor = 'rgba(28,28,28,.3)'; c.shadowBlur = 12; c.shadowOffsetX = 5 * (s.k || 1); c.shadowOffsetY = 8 * (s.k || 1);
      if (sh.k === 'r') jagRect(c, -sh.w / 2, -sh.h / 2, sh.w, sh.h, seed); else if (sh.k === 'c') jagCircle(c, 0, 0, sh.r, seed); else jagPath(c, [[-70, -30], [40, -30], [40, -60], [90, 0], [40, 60], [40, 30], [-70, 30]], seed);
      c.fill(); c.restore(); };
    const snapIn = k => (nb > k ? 1 : nb === k ? qb : 0);
    if (B.i === 0) {
      const cur = Math.min(3, nb), prev = Math.max(0, cur - 1), q = nb > 3 ? 1 : qb;
      txt(c, 'PAPER CUT TITLES', 60, 300, { font: F(400, 112, 'League Gothic'), fill: T.ink, track: 2 });
      s.st.shapes.forEach((sh, i) => { const a = sh.P[prev], b = sh.P[cur]; shape(sh, lerp(a[0], b[0], q), lerp(a[1], b[1], q), lerp(a[2], b[2], q), 1, i + 3); });
      txt(c, 'A FRAMEWORK IN FOUR MOVES', 62, 392, { font: F(400, 16, 'Libre Franklin'), fill: T.ink, track: 6, alpha: snapIn(5) });
      txt(c, 'TX-16 · CUT TO THE BEAT', 60, 470, { font: F(400, 13, 'Courier Prime'), fill: T.ink, alpha: .75 });
    } else if (B.i === 1) {
      txt(c, 'THE FRAMEWORK', 60, 110, { font: F(400, 60, 'League Gothic'), fill: T.ink, track: 2 });
      txt(c, 'S2 · EVERY SHAPE BECOMES THE NEXT SECTION’S DIAGRAM', 62, 136, { font: F(400, 13, 'Courier Prime'), fill: T.ink, alpha: .75 });
      const xs = [180, 380, 580, 780], cols = [T.ink, T.a1, T.a2, T.a3], labs = ['SIGNAL', 'STORY', 'SHAPE', 'SHIP'];
      xs.forEach((x, k) => { const q = snapIn(k * 2 + 1), qb2 = snapIn(k * 2);
        if (k > 0 && qb2 > 0) { c.fillStyle = T.ink; jagRect(c, xs[k - 1] + 60, 293, (x - xs[k - 1] - 120) * qb2, 14, 40 + k); c.fill(); }
        if (q <= 0) return; c.save(); c.translate(x, 300); c.scale(lerp(.2, 1, q), lerp(.2, 1, q)); c.rotate((1 - q) * -.6); c.shadowColor = 'rgba(28,28,28,.3)'; c.shadowBlur = 12; c.shadowOffsetX = 5 * (s.k || 1); c.shadowOffsetY = 8 * (s.k || 1); c.fillStyle = cols[k]; jagCircle(c, 0, 0, 58, 20 + k); c.fill(); c.restore();
        txt(c, String(k + 1), x, 326, { font: F(400, 72, 'League Gothic'), fill: k === 3 ? T.ink : T.bg, align: 'center', alpha: q });
        txt(c, labs[k], x, 400, { font: F(400, 18, 'Libre Franklin'), fill: T.ink, align: 'center', track: 5, alpha: q }); });
    } else if (B.i === 2) {
      DATA4['TX-16'](s, t, B, {});
    } else {
      const cp = pin(B, .9), [mx, my] = glide([820, 470], [520, 300], cp);
      s.st.shapes.forEach((sh, i) => { const [x, y, r] = sh.P[3]; const dx = x - mx, dy = y - my, d = Math.hypot(dx, dy) || 1, push = 18 * Math.exp(-d / 160); shape(sh, x + dx / d * push, y + dy / d * push, r + push * .004, 1, i + 3); });
      txt(c, 'PAPER CUT TITLES', 60, 300, { font: F(400, 112, 'League Gothic'), fill: T.ink, track: 2 });
      const hov = B.t > .9, tilt = hov ? -.06 * eo(clamp((B.t - .9) / .3)) : 0;
      c.save(); c.translate(560, 300); c.rotate(tilt); c.fillStyle = T.a1; jagPath(c, [[-20, -30], [190, -30], [190, 30], [-20, 30], [-44, 0]], 99); c.fill();
      c.fillStyle = T.bg; c.beginPath(); c.arc(-22, 0, 6, 0, TAU); c.fill(); txt(c, 'SEE THE FRAMEWORK', 84, 8, { font: F(400, 24, 'League Gothic'), fill: T.bg, align: 'center', track: 2 }); c.restore();
      cursor(c, mx, my, B.t > 1.6 && B.t < 1.8);
    }
    grain(c, W, H, .09, t, false);
  }
};

/* ── TX-17 SILHOUETTE & SMOKE ────────────────────────────────────────── */
SCENES['TX-17'] = {
  beats: [['S1', 'Smoke reveals the title', 6], ['S2', 'Liquid morph to chapter', 4], ['S4', 'Gold line: extremes, growth, ledger', 9.5], ['S5', 'Underline sweep', 3]],
  init(s) { const R = s.R; s.st.p = Array.from({ length: 66 }, () => [R(), 150 + R() * 320, R() * TAU, R() * TAU, .05 + R() * .07, R() < .5 ? -1 : 1]); },
  draw(s, t, B) {
    const { c, W, H } = s, T = s.th.tok, lvl = Math.min(s.lvl, 1), spr = sprite();
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);
    const smoke = (amt, mirror) => { s.st.p.forEach(([l0, x0, ph, ph2, sp, dir]) => { const l = (l0 + t * sp * (lvl === 0 ? 1 : .6)) % 1, y = 600 - l * 640; let x = x0 + 70 * Math.sin(l * 3 + ph) + 40 * Math.sin(t * .3 + ph2) + l * 110 * dir; if (mirror) x = W - x; const r = 26 + l * 104; c.globalAlpha = Math.sin(Math.PI * l) * (lvl === 0 ? .09 : .07) * amt; c.drawImage(spr, x - r, y - r, r * 2, r * 2); }); c.globalAlpha = 1; };
    const fog = amt => { c.save(); c.globalCompositeOperation = 'lighter'; smoke(amt, false); if (lvl === 0) smoke(amt, true); c.restore(); c.save(); c.globalCompositeOperation = 'screen'; const gg2 = c.createRadialGradient(480, 260, 0, 480, 260, 300); gg2.addColorStop(0, `rgba(201,162,39,${.16 * amt})`); gg2.addColorStop(1, 'rgba(201,162,39,0)'); c.fillStyle = gg2; c.fillRect(0, 0, W, H); c.restore(); };
    const goldText = (str, x, y, size, al = 'center', w = 500) => { const g = c.createLinearGradient(0, y - size, 0, y); g.addColorStop(0, T.a3); g.addColorStop(.6, T.a1); g.addColorStop(1, '#8C6A1A'); txt(c, str, x, y, { font: F(w, size, 'Bodoni Moda'), fill: g, align: al, track: 4 }); };
    const caps = (str, x, y, a = .9, size = 12, al = 'center') => txt(c, str, x, y, { font: F(600, size, 'Josefin Sans'), fill: T.a3, align: al, track: 6, alpha: a });
    const arch = (a) => { c.save(); c.globalAlpha = a; const sweep = (t * .18) % 1, gg = c.createLinearGradient(0, 40, 0, 480); gg.addColorStop(0, rgba(T.a1, .45)); gg.addColorStop(clamp(sweep - .08), rgba(T.a1, .45)); gg.addColorStop(sweep, '#FFF1C2'); gg.addColorStop(clamp(sweep + .08), rgba(T.a1, .45)); gg.addColorStop(1, rgba(T.a1, .45));
      c.shadowBlur = 14; c.shadowColor = T.a1; c.strokeStyle = gg; c.lineWidth = 2; c.beginPath(); c.moveTo(330, 470); c.lineTo(330, 210); c.arc(480, 210, 150, Math.PI, TAU); c.lineTo(630, 470); c.stroke(); c.restore(); };
    const columns = () => { for (let i = 0; i < 10; i++) { const x = 70 + i * 92, h = 150 + (i % 3) * 22; if (x > 300 && x < 640) continue; c.fillStyle = '#000'; c.fillRect(x, H - h, 28, h); c.fillRect(x - 6, H - h - 10, 40, 12); if (lvl === 0) { c.fillStyle = rgba(T.a1, .35); c.fillRect(x + 27, H - h, 1.2, h); } } };
    if (B.i === 0) {
      fog(1); arch(1); columns();
      { const sa = eio(pin(B, 1.6, .4)); c.save(); c.translate(480, 268); c.scale(1, .26); const sg = c.createRadialGradient(0, 0, 0, 0, 0, 330); sg.addColorStop(0, `rgba(5,5,5,${.78 * sa})`); sg.addColorStop(.6, `rgba(5,5,5,${.5 * sa})`); sg.addColorStop(1, 'rgba(5,5,5,0)'); c.fillStyle = sg; c.beginPath(); c.arc(0, 0, 330, 0, TAU); c.fill(); c.restore(); }
      c.save(); c.globalAlpha = eio(pin(B, 2, .6)); goldText('SILHOUETTE & SMOKE', 480, 278, 44); c.restore();
      c.strokeStyle = T.a1; c.lineWidth = 1.2; c.beginPath(); c.moveTo(360, 298); c.lineTo(360 + 240 * eio(pin(B, 1.4, 2.4)), 298); c.stroke();
      caps('TX-17 · AN INTELLIGENCE BRIEFING', 480, 326, .9 * pin(B, .8, 3));
    } else if (B.i === 1) {
      fog(.6);
      const m = eio(pin(B, 1, 1.6)), sw = 1 - m, grow = eo(pin(B, 1.2)), r0 = 110 * grow;
      const cx = 480, cy = lerp(250, 300, m), rx = lerp(r0, 170, m), ry = lerp(r0, 1.6, m);
      const g = c.createRadialGradient(cx - 30, cy - 30, 5, cx, cy, Math.max(rx, 10)); g.addColorStop(0, '#FFF1C2'); g.addColorStop(.5, T.a1); g.addColorStop(1, '#6E5212');
      c.fillStyle = g; c.beginPath(); for (let k = 0; k <= 64; k++) { const a = k / 64 * TAU, wob = 1 + sw * (.16 * Math.sin(3 * a + t * 2.4) + .1 * Math.sin(5 * a - t * 3.1)); const x = cx + Math.cos(a) * rx * wob, y = cy + Math.sin(a) * ry * wob; k ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); c.fill();
      c.save(); c.globalAlpha = pin(B, .8, 2.2); caps('CHAPTER II', 480, 222, 1, 13); goldText('THE ASSET', 480, 284, 58); txt(c, 'Where the money actually moves.', 480, 340, { font: F(500, 22, 'Cormorant Garamond'), fill: T.ink, align: 'center', alpha: .9 }); c.restore();
      caps('S2 · LIQUID MORPH', 480, 470, .55, 11);
    } else if (B.i === 2) {
      DATA4['TX-17'](s, t, B, { fog, goldText, caps });
    } else {
      fog(.8 * (.4 + .6 * pin(B, 2.6))); columns();
      const cp = pin(B, .9), hov = B.t > .9, ul = hov ? eio(clamp((B.t - .9) / .6)) : 0, [mx, my] = glide([760, 470], [560, 284], cp);
      txt(c, 'REQUEST THE BRIEFING', 480, 280, { font: F(600, 22, 'Josefin Sans'), fill: hov ? T.a3 : T.ink, align: 'center', track: 8 });
      c.strokeStyle = T.a1; c.lineWidth = 1.4; c.beginPath(); c.moveTo(330, 296); c.lineTo(330 + 300 * ul, 296); c.stroke();
      caps('S5 · GOLD UNDERLINE SWEEP ON HOVER', 480, 340, .55, 11);
      cursor(c, mx, my, B.t > 1.7 && B.t < 1.9);
    }
    vignette(c, W, H, .6);
  }
};

/* ── TX-18 HALFTONE MULTIVERSE ───────────────────────────────────────── */
SCENES['TX-18'] = {
  beats: [['S1', 'Panels burst in', 5], ['S2', 'Panel-to-panel camera', 4.5], ['S4', 'Three worlds agree, then re-sort', 9.5], ['S5', 'Sticker pops', 3]],
  init(s) { const R = s.R; s.st.jit = Array.from({ length: 8 }, () => Array.from({ length: 14 }, () => (R() - .5) * 10)); },
  draw(s, t0, B) {
    const { c, W, H } = s, T = s.th.tok, lvl = Math.min(s.lvl, 1), q12 = v => lvl === 0 ? Math.floor(v * 12) / 12 : v, t = q12(t0), bt = q12(B.t);
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);
    const off = (t * 4) % 14; c.fillStyle = rgba(T.a1, .07); for (let y = -14; y < H; y += 14) for (let x = -14; x < W; x += 14) { c.beginPath(); c.arc(x + off + ((y / 14) % 2) * 7, y + off, 2, 0, TAU); c.fill(); }
    const panels = [[40, 96, 280, 400, -.02], [344, 96, 576, 188, .012], [344, 304, 576, 192, -.01]];
    const grow = k => B.i === 2 ? eo(clamp((bt - .3 - k * .5) / 1.2)) : 1;
    const QB = { ...B, t: bt }, sl = i => B.i === 2 ? DV.slot(QB, i) : i;
    const content = (k, w, h) => {
      const g = grow(k);
      if (k === 0) { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
        for (let yy = 6; yy < h; yy += 10) for (let xx = 6; xx < w; xx += 10) { const r = 4.2 * (1 - yy / h) + .4; c.fillStyle = T.a1; c.beginPath(); c.arc(xx + (yy / 10 % 2) * 5, yy, r, 0, TAU); c.fill(); }
        SAMPLE.bars.forEach((v, i) => { const bx = 26 + sl(i) * 40, bh = v / 100 * 250 * g, by = h - 34 - bh; if (lvl === 0) { c.fillStyle = T.a2; c.fillRect(bx + 3, by - 3, 28, bh); } c.fillStyle = T.ink; c.fillRect(bx, by, 28, bh); c.fillStyle = '#fff'; c.fillRect(bx + 5, by + 5, 6, Math.max(0, bh - 10)); txt(c, SAMPLE.cats[i], bx + 14, h - 16, { font: F(700, 11, 'Inter'), fill: T.ink, align: 'center' }); }); }
      else if (k === 1) { c.fillStyle = T.a2; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2; for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; c.beginPath(); c.moveTo(80 + Math.cos(a) * 50, 94 + Math.sin(a) * 50); c.lineTo(80 + Math.cos(a) * 700, 94 + Math.sin(a) * 700); c.stroke(); }
        const xs = i => 140 + sl(i) / 5 * (w - 190), ys = v => h - 26 - v / 100 * (h - 64), m = g * 5, ord = [0, 1, 2, 3, 4, 5].sort((a, b) => sl(a) - sl(b)); c.strokeStyle = T.ink; c.lineWidth = 7; c.lineJoin = 'round'; c.beginPath(); for (let j = 0; j <= Math.floor(m); j++) { const i = ord[j]; j ? c.lineTo(xs(i), ys(SAMPLE.bars[i])) : c.moveTo(xs(i), ys(SAMPLE.bars[i])); } c.stroke(); c.strokeStyle = '#fff'; c.lineWidth = 3; c.stroke();
        for (let j = 0; j <= Math.floor(m); j++) { const i = ord[j]; c.fillStyle = B.i === 2 && i === DV.maxI && dvIns(QB) > 0 ? '#FFF35A' : T.a3; c.beginPath(); c.arc(xs(i), ys(SAMPLE.bars[i]), 8, 0, TAU); c.fill(); c.strokeStyle = T.ink; c.lineWidth = 3; c.stroke(); } }
      else { c.fillStyle = T.a3; c.fillRect(0, 0, w, h); const jit = s.st.jit[Math.floor(t * (lvl === 0 ? 2 : .5)) % 8];
        c.strokeStyle = T.ink; c.lineWidth = 4.5; c.lineCap = 'round'; c.lineJoin = 'round';
        SAMPLE.bars.forEach((v, i) => { const x = 60 + sl(i) * 84, bh = v / 100 * (h - 60) * g, base = h - 20; c.beginPath(); c.moveTo(x + jit[i] * .3, base); c.lineTo(x + jit[i + 1] * .4, base - bh); c.lineTo(x + 46 + jit[i + 2] * .4, base - bh + jit[i] * .3); c.lineTo(x + 46, base); c.stroke();
          for (let k2 = 0; k2 < bh - 10; k2 += 9) { c.lineWidth = 2; c.beginPath(); c.moveTo(x + 4, base - k2); c.lineTo(x + 42, base - k2 - 8); c.stroke(); } c.lineWidth = 4.5; }); c.lineCap = 'butt'; }
      if (B.i === 2) dvBubbles(c, k, w, h, QB, T, g);
    };
    const draw3 = (pop) => panels.forEach(([x, y, w, h, rot], k) => {
      const p = pop ? clamp((bt - k * .45) / .5) : 1, sc = p < 1 ? (p <= 0 ? 0 : 1 + Math.sin(p * Math.PI) * .07) : 1; if (sc <= 0) return;
      c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(rot); c.scale(sc, sc); c.translate(-w / 2, -h / 2);
      c.fillStyle = '#111'; c.fillRect(9, 11, w, h); c.save(); c.beginPath(); c.rect(0, 0, w, h); c.clip(); content(k, w, h); c.restore();
      c.strokeStyle = T.ink; c.lineWidth = 6; c.strokeRect(0, 0, w, h);
      const cap = ['WORLD 1 · THE ANALYST', 'WORLD 2 · THE OPERATOR', 'WORLD 3 · THE SKEPTIC'][k], cw = tw(c, cap, F(700, 12, 'Inter'), 1) + 16;
      c.fillStyle = '#fff'; c.fillRect(10, 10, cw, 24); c.strokeStyle = T.ink; c.lineWidth = 2; c.strokeRect(10, 10, cw, 24); txt(c, cap, 18, 27, { font: F(700, 12, 'Inter'), fill: T.ink, track: 1 });
      c.restore(); });
    const sfx = (str, x, y, rot, q, size = 48, fill = '#FFF35A') => { if (q <= 0) return; c.save(); c.translate(x, y); c.rotate(rot); const k = q < 1 ? 1.4 - .4 * q + Math.sin(q * Math.PI) * .15 : 1; c.scale(k, k); txt(c, str, 0, 16, { font: F(400, size, 'Permanent Marker'), stroke: T.ink, lw: 8, align: 'center' }); txt(c, str, 0, 16, { font: F(400, size, 'Permanent Marker'), fill, align: 'center' }); c.restore(); };
    const title = (str) => { const font = F(400, 54, 'Bangers'); if (lvl === 0) { c.save(); c.globalCompositeOperation = 'multiply'; txt(c, str, 37, 72, { font, fill: T.a2, track: 2 }); txt(c, str, 43, 68, { font, fill: T.a1, track: 2 }); c.restore(); } txt(c, str, 40, 70, { font, fill: T.ink, track: 2 }); };
    if (B.i === 0) { draw3(true); sfx('KA-CHART!', 760, 300, -.14, clamp((bt - 1.6) / .35) * (bt < 4.6 ? 1 : 0)); title('HALFTONE MULTIVERSE'); }
    else if (B.i === 1) {
      const K = [[0, 480, 270, 1], [1.2, 180, 296, 1.75], [2.2, 180, 296, 1.75], [3.0, 632, 190, 1.6], [3.7, 632, 190, 1.6], [4.5, 480, 270, 1]];
      let k = 0; while (k < K.length - 2 && B.t > K[k + 1][0]) k++; const [ta, xa, ya, za] = K[k], [tb, xb, yb, zb] = K[k + 1], p = eio(clamp((B.t - ta) / (tb - ta)));
      const cx = lerp(xa, xb, p), cy = lerp(ya, yb, p), z = lerp(za, zb, p);
      c.save(); c.translate(480, 270); c.scale(z, z); c.translate(-cx, -cy); draw3(false); title('HALFTONE MULTIVERSE'); c.restore();
      if (B.t > 2.2 && B.t < 3.0) { c.strokeStyle = 'rgba(17,17,17,.5)'; c.lineWidth = 3; for (let i = 0; i < 24; i++) { const y = (hash3(i, Math.floor(t * 12), 1) % 540); c.beginPath(); c.moveTo(0, y); c.lineTo(300 + hash3(i, 2, 2) % 400, y); c.stroke(); } sfx('WHOOSH', 480, 270, -.08, clamp((B.t - 2.2) / .3), 64, '#FFFFFF'); }
    } else if (B.i === 2) { draw3(false); title(dvRk(QB) > .5 ? 'THREE WORLDS, ONE RANKING' : 'ONE DATASET, THREE WORLDS'); txt(c, 'SAME SAMPLE DATA IN EVERY PANEL', 920, 526, { font: F(700, 12, 'Inter'), fill: T.ink, align: 'right', track: 2 }); }
    else {
      draw3(false); title('HALFTONE MULTIVERSE');
      const burst = (x, y, r, col, str, q, rot) => { if (q <= 0) return; c.save(); c.translate(x, y); c.rotate(rot + (lvl === 0 ? ((hash3(Math.floor(t * 12), 1, 1) % 5) - 2) * .02 : 0)); const k = q < 1 ? 1.3 - .3 * q : 1; c.scale(k, k);
        c.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, rr_ = i % 2 ? r * .72 : r; i ? c.lineTo(Math.cos(a) * rr_, Math.sin(a) * rr_) : c.moveTo(Math.cos(a) * rr_, Math.sin(a) * rr_); } c.closePath(); c.fillStyle = col; c.fill(); c.strokeStyle = T.ink; c.lineWidth = 4; c.stroke();
        txt(c, str, 0, 8, { font: F(400, r * .42, 'Bangers'), fill: T.ink, align: 'center', track: 1 }); c.restore(); };
      burst(250, 170, 70, '#FFF35A', 'NEW!', clamp((bt - .2) / .3), -.2); burst(820, 120, 62, T.a2, '3 WORLDS', clamp((bt - .7) / .3), .15); burst(640, 420, 74, '#FF7AC6', 'SAMPLE!', clamp((bt - 1.2) / .3), -.1);
    }
  }
};

/* ── TX-19 SYMMETRY DIORAMA ──────────────────────────────────────────── */
SCENES['TX-19'] = {
  beats: [['S1', 'Room-by-room tracking', 9], ['S2', 'Centered chapter card', 3], ['S4', 'Specimens re-hung by headcount', 9.5]],
  init(s) { s.st.rooms = [['ONE', 'INTAKE', 3], ['TWO', 'RESEARCH', 5], ['THREE', 'SYNTHESIS', 2], ['FOUR', 'DESIGN', 4], ['FIVE', 'DELIVERY', 6]]; },
  draw(s, t, B) {
    const { c, W, H, lvl } = s, T = s.th.tok, RW = 420;
    let fills = ['#F4C2C2', '#F7E1A1', '#A8D5BA', '#A9C6E0', '#F4C2C2']; if (lvl === 2) fills = fills.map(f => mix(f, '#CFC8C2', .15));
    const person = (px, py, sc = 1, bob = 0) => { c.fillStyle = T.ink; c.beginPath(); c.arc(px, py - bob, 5 * sc, 0, TAU); c.fill(); rr(c, px - 5 * sc, py + 8 * sc - bob, 10 * sc, 18 * sc, 3 * sc); c.fill(); };
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H); c.fillStyle = mix(T.bg, '#D9C2B2', .5); c.fillRect(0, 452, W, 88);
    if (B.i === 0) {
      const hold = lvl === 2 ? 1.4 : 1.5, whip = lvl === 2 ? .5 : .32, per = hold + whip, n = Math.min(4, Math.floor(B.t / per)), cyc = B.t - n * per;
      const posOf = k => 480 - (RW / 2 + k * RW), a = n, b = Math.min(4, n + 1), p = n >= 4 || cyc < hold ? 0 : eioX((cyc - hold) / whip), off = lerp(posOf(a), posOf(b), p), moving = p > 0 && p < 1, vel = moving ? (posOf(b) - posOf(a)) / whip / 60 : 0;
      const building = (ox, alpha) => { c.save(); c.globalAlpha = alpha; c.translate(ox, 0);
        c.fillStyle = mix(fills[0], '#E89A9A', .35); c.fillRect(-20, 96, RW * 5 + 40, 40);
        s.st.rooms.forEach(([num, name, ppl], k) => { const x = k * RW, cx = x + RW / 2;
          c.fillStyle = fills[k]; c.fillRect(x + 10, 136, RW - 20, 300); { const sh = c.createLinearGradient(0, 136, 0, 210); sh.addColorStop(0, 'rgba(61,44,46,.16)'); sh.addColorStop(1, 'rgba(61,44,46,0)'); c.fillStyle = sh; c.fillRect(x + 10, 136, RW - 20, 74); const sl = c.createLinearGradient(x + 10, 0, x + 50, 0); sl.addColorStop(0, 'rgba(61,44,46,.10)'); sl.addColorStop(1, 'rgba(61,44,46,0)'); c.fillStyle = sl; c.fillRect(x + 10, 136, 40, 300); const sr = c.createLinearGradient(x + RW - 10, 0, x + RW - 50, 0); sr.addColorStop(0, 'rgba(61,44,46,.10)'); sr.addColorStop(1, 'rgba(61,44,46,0)'); c.fillStyle = sr; c.fillRect(x + RW - 50, 136, 40, 300); const fl2 = c.createLinearGradient(0, 380, 0, 436); fl2.addColorStop(0, 'rgba(61,44,46,0)'); fl2.addColorStop(1, 'rgba(61,44,46,.12)'); c.fillStyle = fl2; c.fillRect(x + 10, 380, RW - 20, 56); }
          c.strokeStyle = T.ink; c.lineWidth = 2; c.strokeRect(x + 10, 136, RW - 20, 300);
          c.fillStyle = rgba(T.a2, .28); c.fillRect(cx - 60, 170, 120, 90); c.strokeStyle = rgba(T.ink, .7); c.lineWidth = 2; c.strokeRect(cx - 60, 170, 120, 90); c.beginPath(); c.moveTo(cx, 170); c.lineTo(cx, 260); c.moveTo(cx - 60, 215); c.lineTo(cx + 60, 215); c.stroke();
          if (k === 2) { c.fillStyle = '#fff'; c.beginPath(); c.arc(cx - 120, 200, 18, 0, TAU); c.fill(); c.strokeStyle = T.ink; c.lineWidth = 2; c.stroke(); const a2 = Math.floor(t) / 60 * TAU; c.beginPath(); c.moveTo(cx - 120, 200); c.lineTo(cx - 120 + Math.sin(a2) * 13, 200 - Math.cos(a2) * 13); c.stroke(); }
          c.fillStyle = T.a1; c.fillRect(cx - 70, 318, 140, 14); c.fillStyle = mix(T.a1, '#000000', .25); c.fillRect(cx - 62, 332, 8, 36); c.fillRect(cx + 54, 332, 8, 36);
          c.fillStyle = T.a3; c.fillRect(cx - 4, 288, 8, 30); c.fillStyle = '#F7E1A1'; c.beginPath(); c.moveTo(cx - 16, 290); c.lineTo(cx + 16, 290); c.lineTo(cx + 10, 276); c.lineTo(cx - 10, 276); c.closePath(); c.fill(); { const lg = c.createRadialGradient(cx, 300, 0, cx, 300, 120); lg.addColorStop(0, 'rgba(255,222,150,.42)'); lg.addColorStop(1, 'rgba(255,222,150,0)'); c.save(); c.globalCompositeOperation = 'screen'; c.fillStyle = lg; c.beginPath(); c.moveTo(cx - 16, 290); c.lineTo(cx + 16, 290); c.lineTo(cx + 110, 436); c.lineTo(cx - 110, 436); c.closePath(); c.fill(); c.restore(); }
          for (let i = 0; i < ppl; i++) person(cx + (i - (ppl - 1) / 2) * 22, 384, 1, lvl === 2 ? 0 : Math.max(0, Math.sin(t * 4 + i * 1.3 + k)) * 2);
          txt(c, `${ppl} AGENTS · SAMPLE`, cx, 428, { font: F(400, 12, 'Courier Prime'), fill: T.ink, align: 'center' });
          txt(c, `CHAPTER ${num} · ${name}`, cx, 122, { font: F(600, 13, 'Jost'), fill: T.ink, align: 'center', track: 3 }); });
        c.restore(); };
      if (moving && lvl < 2) [3, 2, 1].forEach(k => building(off - vel * k * 7, .12)); building(off, 1);
      s.st.over = () => { c.fillStyle = T.ink; for (let i = 0; i < 5; i++) { c.globalAlpha = (moving ? b : a) === i ? 1 : .25; c.beginPath(); c.arc(440 + i * 20, 496, 4, 0, TAU); c.fill(); } c.globalAlpha = 1;
      txt(c, 'SYMMETRY DIORAMA', 480, 52, { font: F(600, 30, 'Jost'), fill: T.ink, align: 'center', track: 10 });
      txt(c, 'TX-19 · THE ORGANIZATION, ROOM BY ROOM', 480, 78, { font: F(400, 13, 'Courier Prime'), fill: T.ink, align: 'center', alpha: .8 }); };
    } else if (B.i === 1) {
      const z = lerp(1.15, 1, eioX(pin(B, .3))); c.save(); c.translate(480, 270); c.scale(z, z); c.translate(-480, -270);
      c.fillStyle = fills[2]; c.fillRect(180, 90, 600, 360); c.strokeStyle = T.ink; c.lineWidth = 2; c.strokeRect(180, 90, 600, 360); c.strokeRect(192, 102, 576, 336);
      txt(c, 'CHAPTER THREE', 480, 190, { font: F(600, 16, 'Jost'), fill: T.ink, align: 'center', track: 8 });
      txt(c, 'THE SYNTHESIS ROOM', 480, 262, { font: F(600, 42, 'Jost'), fill: T.ink, align: 'center', track: 6 });
      c.fillStyle = T.a1; c.fillRect(420, 290, 120, 2);
      txt(c, 'In which the findings are sorted and named.', 480, 334, { font: F(400, 18, 'Libre Baskerville'), fill: T.ink, align: 'center', alpha: .9 });
      c.restore();
      s.st.over = () => txt(c, 'S2 · SNAP ZOOM TO A CENTERED CARD', 480, 500, { font: F(400, 12, 'Courier Prime'), fill: T.ink, align: 'center', alpha: .7 });
    } else DATA4['TX-19'](s, t, B, { fills, person });
  }
};

/* ── TX-20 LIMINAL OFFICE ────────────────────────────────────────────── */
SCENES['TX-20'] = {
  beats: [['S1', 'Corridor walk', 6], ['S2', 'A door opens', 4], ['S4', 'Sort, then predicted vs actual', 9.5], ['S5', 'Polite toast', 3]],
  init(s) { const R = s.R; s.st.dig = Array.from({ length: 72 }, () => Math.floor(R() * 10)); s.st.zc = 0; s.st.pick = [13, 14, 26, 27, 40, 41, 52, 53, 54, 33, 45, 21]; },
  draw(s, t, B, dt = 0) {
    const { c, W, H, lvl } = s, T = s.th.tok, vx = 480, vy = 236, Fc = 300, tb = '#0E1A19', ti = '#3EB8A3';
    if ((B.i === 0 && B.t < 4.5) || (B.i === 3)) s.st.zc += dt * .5;
    const pj = (x, y, z) => [vx + x * Fc / z, vy - y * Fc / z], zc = s.st.zc;
    const quad = (P, col) => { c.fillStyle = col; c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); };
    const corridor = () => {
      const zn = .32, zf = 40; c.fillStyle = '#DDE3E1'; c.fillRect(0, 0, W, H);
      quad([pj(-1, .55, zn), pj(1, .55, zn), pj(1, .55, zf), pj(-1, .55, zf)], '#D6DCDA');
      quad([pj(-1, -.75, zn), pj(-1, .55, zn), pj(-1, .55, zf), pj(-1, -.75, zf)], '#E6EBE9');
      quad([pj(1, -.75, zn), pj(1, .55, zn), pj(1, .55, zf), pj(1, -.75, zf)], '#EEF2F0');
      const fl = c.createLinearGradient(0, vy, 0, H); fl.addColorStop(0, '#5E9A8A'); fl.addColorStop(1, T.a1); quad([pj(-1, -.75, zn), pj(1, -.75, zn), pj(1, -.75, zf), pj(-1, -.75, zf)], fl);
      const bk = pj(-1, .55, zf), bk2 = pj(1, -.75, zf); c.fillStyle = '#CDD5D2'; c.fillRect(bk[0], bk[1], bk2[0] - bk[0], bk2[1] - bk[1]);
      for (let k = 30; k >= 0; k--) { const z = k * 1.2 - (zc % 1.2) + .5; if (z < zn) continue; const fa = lvl === 0 && k === 3 ? .03 * Math.sin(t * TAU * 1.5) : 0; quad([pj(-.28, .549, z), pj(.28, .549, z), pj(.28, .549, z + .6), pj(-.28, .549, z + .6)], `rgba(255,255,255,${.95 - fa})`); }
      [[-1, 0], [1, 1.5]].forEach(([side, o]) => { for (let k = 14; k >= 0; k--) { const z = k * 3 + o - (zc % 3) + .6; if (z < zn + .05) continue; const P = [pj(side, -.75, z), pj(side, .18, z), pj(side, .18, z + .5), pj(side, -.75, z + .5)]; quad(P, T.a2); c.strokeStyle = rgba(T.ink, .35); c.lineWidth = Math.max(.5, 2 / z); c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.stroke(); } });
    };
    const head = () => { txt(c, 'LIMINAL OFFICE', 40, 64, { font: F(500, 34, 'Instrument Sans'), fill: T.ink, track: 1 }); txt(c, 'TX-20 · Thank you for walking at a steady pace.', 42, 90, { font: F(400, 15, 'Hanken Grotesk'), fill: T.ink, alpha: .8 }); };
    if (B.i === 0 || B.i === 3) {
      corridor(); head();
      if (B.i === 3) { const sl = eio(pin(B, .5, .2)) * (1 - eio(pout(B, .5))), x = lerp(980, 600, sl);
        c.fillStyle = 'rgba(29,43,42,.14)'; rr(c, x + 4, 116, 330, 84, 12); c.fill(); c.fillStyle = '#FFFFFF'; rr(c, x, 112, 330, 84, 12); c.fill(); c.fillStyle = T.a1; c.fillRect(x, 124, 5, 60);
        txt(c, 'Thank you for sorting.', x + 24, 146, { font: F(500, 18, 'Instrument Sans'), fill: T.ink }); txt(c, 'Your contribution has been noted.', x + 24, 172, { font: F(400, 15, 'Hanken Grotesk'), fill: T.ink, alpha: .8 });
        txt(c, 'S5 · CORPORATE-POLITE TOAST', 480, 520, { font: F(400, 11, 'IBM Plex Mono'), fill: '#FFFFFF', align: 'center', track: 2, alpha: .85 }); }
    } else if (B.i === 1) {
      corridor(); c.fillStyle = 'rgba(29,43,42,.35)'; c.fillRect(0, 0, W, H);
      const op = eio(pin(B, 1.6, .6)), dx = 380, dy = 110, dw = 200, dh = 340;
      const room = c.createLinearGradient(0, dy, 0, dy + dh); room.addColorStop(0, '#FFFFFF'); room.addColorStop(1, '#E3ECE9'); c.fillStyle = room; c.fillRect(dx, dy, dw, dh);
      c.fillStyle = '#C9D4D0'; c.fillRect(dx, dy + dh - 70, dw, 70); c.fillStyle = T.a3; c.fillRect(dx + 50, dy + dh - 120, 100, 10); c.fillRect(dx + 58, dy + dh - 110, 6, 40); c.fillRect(dx + 136, dy + dh - 110, 6, 40);
      c.fillStyle = tb; c.fillRect(dx + 76, dy + dh - 160, 48, 36); c.fillStyle = ti; c.fillRect(dx + 82, dy + dh - 154, 36, 2);
      const pw = dw * (1 - op); c.fillStyle = T.a2; c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + pw, dy + 14 * op); c.lineTo(dx + pw, dy + dh - 14 * op); c.lineTo(dx, dy + dh); c.closePath(); c.fill();
      if (op < .9) { c.fillStyle = '#D9E6E2'; c.beginPath(); c.arc(dx + pw - 16, dy + dh / 2, 5, 0, TAU); c.fill(); }
      c.strokeStyle = T.ink; c.lineWidth = 4; c.strokeRect(dx - 4, dy - 4, dw + 8, dh + 4);
      c.fillStyle = '#FFFFFF'; c.fillRect(dx + 30, dy - 46, 140, 28); txt(c, 'ROOM 04 · ALLOCATION', dx + 100, dy - 27, { font: F(400, 11, 'IBM Plex Mono'), fill: T.ink, align: 'center', track: 1 });
      head(); txt(c, 'S2 · A DOOR OPENS ONTO THE NEXT CHAPTER', 480, 520, { font: F(400, 11, 'IBM Plex Mono'), fill: '#FFFFFF', align: 'center', track: 2 });
    } else DATA4['TX-20'](s, t, B, { tb, ti });
    if (lvl === 0) { c.fillStyle = `rgba(0,0,0,${.02 * (.5 + .5 * Math.sin(t * TAU * 1.5))})`; c.fillRect(0, 0, W, H); }
  }
};
