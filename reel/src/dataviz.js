/* ── v5 data-story layer: build → insight → re-sort → rank, per theme ── */
const backOutS = p => (p <= 0 ? 0 : p >= 1 ? 1 : Math.max(0, 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2)));
function dvRank(vals) { const order = vals.map((_, i) => i).sort((a, b) => vals[b] - vals[a]), rank = []; order.forEach((i, r) => { rank[i] = r; }); return { order, rank }; }
const dvSort = (B, rank, i, at = 5.6, dur = 1.3, st = .09) => eio(clamp((B.t - at - rank[i] * st) / dur));
const dvCallout = B => smooth(2.8, 3.4, B.t) * (1 - smooth(5.1, 5.5, B.t));
const dvIns = B => smooth(2.8, 3.4, B.t);
const dvRk = B => smooth(7.0, 7.5, B.t);
const dvOut = B => 1 - eio(pout(B, .5));
const DV = (() => {
  const v = SAMPLE.bars, n = v.length, avg = v.reduce((a, b) => a + b, 0) / n, R = dvRank(v);
  const api = { v, n, avg, order: R.order, rank: R.rank, maxI: R.order[0], minI: R.order[n - 1] };
  api.slot = (B, i) => lerp(i, api.rank[i], dvSort(B, api.rank, i));
  api.dim = (B, i) => (i === api.maxI ? 1 : 1 - .5 * smooth(2.8, 3.4, B.t) * (1 - smooth(5.3, 5.8, B.t)));
  api.grow = (B, i, d = 1.1, st = .12, at = .3) => { const p = clamp((B.t - at - i * st) / d); return p <= 0 ? 0 : p >= 1 ? 1 : backOutS(p); };
  return api;
})();
function pearson(a, b) { const n = a.length, ma = a.reduce((x, y) => x + y, 0) / n, mb = b.reduce((x, y) => x + y, 0) / n; let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { const dx = a[i] - ma, dy = b[i] - mb; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; } return sxy / Math.sqrt(sxx * syy); }
function refLine(c, x0, x1, y, p, col, label, font, o = {}) {
  if (p <= 0) return; const xe = lerp(x0, x1, eio(clamp(p)));
  c.save(); c.setLineDash(o.dash || [6, 5]); c.strokeStyle = col; c.lineWidth = o.lw || 1.4; c.globalAlpha *= o.a || 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(xe, y); c.stroke(); c.setLineDash([]);
  if (p > .6 && label) txt(c, label, o.lx != null ? o.lx : x1 + 8, y + (o.ly || 4), { font, fill: o.lc || col, alpha: clamp((p - .6) / .4), align: o.al || 'left', track: o.tr || 0 });
  c.restore();
}
function callout(c, ax, ay, bx, by, l1, l2, p, o) {
  if (p <= 0) return; const q1 = clamp(p / .45), q2 = clamp((p - .35) / .45);
  c.save(); c.globalAlpha *= Math.min(1, p * 3);
  const L1 = Math.abs(by - ay), L2 = Math.abs(bx - ax), d = (L1 + L2) * eio(q1);
  c.strokeStyle = o.col; c.lineWidth = o.lw || 1.4; c.beginPath(); c.moveTo(ax, ay);
  if (d <= L1) c.lineTo(ax, ay + Math.sign(by - ay) * d); else { c.lineTo(ax, by); c.lineTo(ax + Math.sign(bx - ax) * Math.min(L2, d - L1), by); } c.stroke();
  c.fillStyle = o.col; c.beginPath(); c.arc(ax, ay, 3.5, 0, TAU); c.fill();
  if (q2 > 0) {
    const s1 = parseFloat(o.f1.split(' ')[1]), s2 = l2 ? parseFloat(o.f2.split(' ')[1]) : 0, w1 = tw(c, l1, o.f1, o.tr1 || 0), w2 = l2 ? tw(c, l2, o.f2, o.tr2 || 0) : 0;
    const bw = Math.max(w1, w2) + 24, bh = s1 + (l2 ? s2 + 8 : 0) + 18, right = bx >= ax, x = right ? bx : bx - bw, y = by - bh / 2;
    c.globalAlpha *= q2; if (o.bg) { c.fillStyle = o.bg; rr(c, x, y, bw, bh, o.r != null ? o.r : 4); c.fill(); }
    c.strokeStyle = o.col; c.lineWidth = 1; rr(c, x, y, bw, bh, o.r != null ? o.r : 4); c.stroke();
    txt(c, l1, x + 12, y + 9 + s1 * .85, { font: o.f1, fill: o.ink || o.col, track: o.tr1 || 0 });
    if (l2) txt(c, l2, x + 12, y + 9 + s1 + 6 + s2 * .85, { font: o.f2, fill: o.ink2 || o.ink || o.col, track: o.tr2 || 0, alpha: .88 });
  }
  c.restore();
}
function pulse(c, x, y, col, t, r0 = 6, a = .7) { c.save(); c.lineWidth = 1.5; for (let k = 0; k < 3; k++) { const ph = (t * .9 + k / 3) % 1; c.strokeStyle = rgba(col, (1 - ph) * a); c.beginPath(); c.arc(x, y, r0 + ph * 24, 0, TAU); c.stroke(); } c.restore(); }
function flowDots(c, pts, t, col, n = 8, speed = .22, r = 2.6) {
  if (pts.length < 2) return; const L = polyLen(pts), tot = L[L.length - 1]; if (tot <= 0) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let k = 0; k < n; k++) { const q = polyAt(pts, L, ((t * speed + k / n) % 1) * tot), g = c.createRadialGradient(q[0], q[1], 0, q[0], q[1], r * 3); g.addColorStop(0, rgba(col, .95)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.arc(q[0], q[1], r * 3, 0, TAU); c.fill(); }
  c.restore();
}
function vBracket(c, x, y0, y1, label, col, p, font, side = 1) {
  if (p <= 0) return; const q = eio(clamp(p)), ym = (y0 + y1) / 2, h = Math.abs(y1 - y0) / 2 * q;
  c.save(); c.strokeStyle = col; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 6 * side, ym - h); c.lineTo(x, ym - h); c.lineTo(x, ym + h); c.lineTo(x - 6 * side, ym + h); c.moveTo(x, ym); c.lineTo(x + 8 * side, ym); c.stroke();
  if (q > .7) txt(c, label, x + 14 * side, ym + 6, { font, fill: col, align: side > 0 ? 'left' : 'right', alpha: clamp((q - .7) / .3) }); c.restore();
}
function hBracket(c, x0, x1, y, label, col, p, font, up = true) {
  if (p <= 0) return; const q = eio(clamp(p)), xm = (x0 + x1) / 2, w = (x1 - x0) / 2 * q, d = up ? -7 : 7;
  c.save(); c.strokeStyle = col; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xm - w, y - d); c.lineTo(xm - w, y); c.lineTo(xm + w, y); c.lineTo(xm + w, y - d); c.moveTo(xm, y); c.lineTo(xm, y + d); c.stroke();
  if (q > .7) txt(c, label, xm, y + (up ? -12 : 26), { font, fill: col, align: 'center', alpha: clamp((q - .7) / .3) }); c.restore();
}
const D4 = SAMPLE.bars, ARGS = {};
const DATA4 = {};

/* TX-01 · light walls */
DATA4['TX-01'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { glowLine, rez, core, hy } = X, base = 476, step = 104, x0 = 186, w = 60, H = v => v / 100 * 230, out = dvOut(B), I = dvIns(B), CO = dvCallout(B), RK = dvRk(B);
  rez('03 · THROUGHPUT', 480, 92, F(700, 26, 'Orbitron'), 8, B.t);
  txt(c, RK > 0 ? 'RANKED · DESCENDING' : 'SAMPLE DATA · RIVAL IN ORANGE', 480, 118, { font: F(400, 12, 'Share Tech Mono'), fill: T.ink, alpha: .65 * pin(B, .5, .6), track: 4, align: 'center' });
  const ga = pin(B, .8, .1) * out;
  [25, 50, 75, 100].forEach(k => { const y = base - H(k); c.strokeStyle = rgba(T.a1, .12 * ga); c.lineWidth = 1; c.beginPath(); c.moveTo(150, y); c.lineTo(810, y); c.stroke(); txt(c, String(k), 140, y + 4, { font: F(400, 10, 'Share Tech Mono'), fill: T.ink, alpha: .45 * ga, align: 'right' }); });
  D4.forEach((val, i) => {
    const x = x0 + DV.slot(B, i) * step, gp = DV.grow(B, i, 1.0, .12, .25), h = H(val) * Math.max(0, gp) * out, top = base - h, da = DV.dim(B, i);
    const vx = (480 - (x + w / 2)) * .07, vy = (hy - base) * .07, col = (lvl < 2 && i === 3) ? T.a2 : T.a1, hot = i === DV.maxI && I > 0;
    c.save(); c.globalAlpha *= da;
    const rg = c.createLinearGradient(0, base, 0, base + 50); rg.addColorStop(0, rgba(col, .22)); rg.addColorStop(1, rgba(col, 0)); c.fillStyle = rg; c.fillRect(x, base, w, 50 * clamp(gp));
    c.fillStyle = rgba(col, .07); c.beginPath(); c.moveTo(x, top); c.lineTo(x + w, top); c.lineTo(x + w + vx, top + vy); c.lineTo(x + vx, top + vy); c.closePath(); c.fill();
    c.fillStyle = rgba(col, hot ? .24 : .16); c.fillRect(x, top, w, h); c.strokeStyle = rgba(col, .85); c.lineWidth = 1; c.strokeRect(x, top, w, h);
    c.strokeStyle = col === T.a1 ? core : '#FFE2CC'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, top); c.lineTo(x + w, top); c.stroke();
    if (hot && lvl < 2) { c.save(); c.shadowBlur = 20 * I; c.shadowColor = col; c.strokeStyle = col; c.lineWidth = 2; c.strokeRect(x - 3, top - 3, w + 6, h + 6); c.restore(); }
    if (gp > .3) txt(c, String(Math.round(val * clamp(gp))), x + w / 2, top - 10, { font: F(400, 16, 'Share Tech Mono'), fill: col === T.a1 ? core : T.a2, align: 'center' });
    txt(c, SAMPLE.cats[i], x + w / 2, base + 18, { font: F(400, 11, 'Share Tech Mono'), fill: T.ink, alpha: .6, align: 'center' });
    if (RK > 0) txt(c, '#' + (DV.rank[i] + 1), x + w / 2, base + 38, { font: F(700, 13, 'Orbitron'), fill: col, align: 'center', alpha: RK });
    c.restore();
  });
  refLine(c, 150, 810, base - H(DV.avg) * out, pin(B, .9, 3.0) * out, core, 'AVG ' + DV.avg.toFixed(1), F(400, 12, 'Share Tech Mono'));
  const mx = x0 + DV.slot(B, DV.maxI) * step + w / 2, my = base - H(91) * out;
  if (I > 0 && lvl < 2) pulse(c, mx, my, T.a2, t);
  callout(c, mx, my - 6, mx + 130, 170, 'RIVAL N4 LEADS · 91', '+7 vs N2 · +22.5 vs AVG', CO, { col: T.a2, bg: 'rgba(2,4,10,.88)', f1: F(700, 14, 'Orbitron'), f2: F(400, 12, 'Share Tech Mono'), ink: '#FFE2CC', ink2: T.ink, tr1: 2 });
};

/* TX-02 · glyph columns */
DATA4['TX-02'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { scramble, src, grade } = X, a = pin(B, .5) * (1 - pout(B, .6)), base = 452, col = grade > .5 ? T.a3 : T.a1, I = dvIns(B), CO = dvCallout(B), RK = dvRk(B);
  c.save(); c.globalAlpha = a;
  txt(c, scramble('SIGNAL BY SOURCE · SAMPLE DATA', .3, .03, 90), 480, 92, { font: F(400, 26, 'Share Tech Mono'), fill: grade > .5 ? '#DCE8F5' : T.a1, align: 'center', track: 4 });
  txt(c, RK > 0 ? 'RANKED BY SIGNAL STRENGTH' : 'OUTSIDE · STEEL GRADE', 480, 118, { font: F(400, 12, 'Share Tech Mono'), fill: T.a3, align: 'center', track: 4 });
  c.font = F(400, 18, 'Share Tech Mono'); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  let mx = 0, my = 0;
  D4.forEach((v, i) => {
    const x = 255 + DV.slot(B, i) * 90, rows = Math.round(v / 100 * 14 * clamp(DV.grow(B, i, 1.2, .1, .4))), da = DV.dim(B, i), hot = i === DV.maxI && I > 0;
    c.globalAlpha = a * da; c.font = F(400, 18, 'Share Tech Mono'); c.textAlign = 'center';
    for (let r = 0; r < rows; r++) { c.fillStyle = r === rows - 1 ? '#E8F4FF' : hot ? rgba('#DCFFE4', .6 + .4 * (r / 14)) : rgba(col, .6 + .4 * (r / 14)); c.fillText(src[hash3(i, r, Math.floor(t * 4)) % src.length], x, base - r * 18); }
    txt(c, rows ? scramble(String(v), .9 + i * .1, .1, i * 7) : '', x, base - rows * 18 - 8, { font: F(400, 24, 'VT323'), fill: hot ? '#DCFFE4' : '#E8F4FF', align: 'center' });
    txt(c, SAMPLE.cats[i], x, base + 26, { font: F(400, 12, 'Share Tech Mono'), fill: T.ink, alpha: .6, align: 'center' });
    if (RK > 0) txt(c, '#' + (DV.rank[i] + 1), x, base + 50, { font: F(400, 24, 'VT323'), fill: T.a1, align: 'center', alpha: RK });
    if (i === DV.maxI) { mx = x; my = base - rows * 18 - 30; }
  });
  c.globalAlpha = a;
  const ay = base - DV.avg / 100 * 14 * 18 - 4; refLine(c, 210, 760, ay, pin(B, .9, 3.0), grade > .5 ? '#DCE8F5' : '#B8FFC6', scramble('AVG ' + DV.avg.toFixed(1), 3.6, .05, 77), F(400, 20, 'VT323'));
  if (I > 0 && lvl < 2) pulse(c, mx, my + 14, T.a1, t);
  callout(c, mx, my + 6, mx + 120, 196, 'N4 · 91 · STRONGEST SIGNAL', '+7 OVER N2 · +22.5 OVER AVG', CO, { col: T.a1, bg: 'rgba(0,5,0,.88)', f1: F(400, 24, 'VT323'), f2: F(400, 18, 'VT323'), ink: '#DCFFE4' });
  c.restore();
};

/* TX-03 · gauges + ranked ladder */
DATA4['TX-03'] = (s, t, B) => {
  const { c, lvl } = s, T = s.th.tok, a = pin(B, .4) * (1 - pout(B, .5)), I = dvIns(B), CO = dvCallout(B), RK = dvRk(B);
  c.save(); c.globalAlpha = a;
  txt(c, 'GAUGES · SAMPLE DATA', 480, 110, { font: F(600, 18, 'Chakra Petch'), fill: T.ink, align: 'center', track: 6 });
  [[220, 248, 64, 0], [480, 234, 86, 1], [740, 248, 64, 2]].forEach(([x, y, r, i]) => {
    const v = D4[i], p = eo(pin(B, 1.3, .2 + i * .25)), hot = v > 80, col = hot ? T.a2 : T.a1;
    c.strokeStyle = rgba(T.a1, .14); c.lineWidth = r > 80 ? 12 : 9; c.beginPath(); c.arc(x, y, r, Math.PI * .75, Math.PI * 2.25); c.stroke();
    c.strokeStyle = col; c.beginPath(); c.arc(x, y, r, Math.PI * .75, Math.PI * .75 + Math.PI * 1.5 * v / 100 * p); c.stroke();
    for (let k = 0; k <= 20; k++) { const an = Math.PI * .75 + Math.PI * 1.5 * k / 20, r1 = r + 12, r2 = r + (k % 5 ? 16 : 22); c.strokeStyle = rgba(T.a1, k % 5 ? .3 : .7); c.lineWidth = 1; c.beginPath(); c.moveTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1); c.lineTo(x + Math.cos(an) * r2, y + Math.sin(an) * r2); c.stroke(); }
    const ta = Math.PI * .75 + Math.PI * 1.5 * .8; c.strokeStyle = T.a2; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + Math.cos(ta) * (r - 10), y + Math.sin(ta) * (r - 10)); c.lineTo(x + Math.cos(ta) * (r + 24), y + Math.sin(ta) * (r + 24)); c.stroke();
    txt(c, countTo(v, p), x, y + 12, { font: F(400, r > 80 ? 40 : 30, 'B612 Mono'), fill: hot && p > .9 ? T.a2 : T.ink, align: 'center' });
    txt(c, SAMPLE.cats[i], x, y + r - 4, { font: F(400, 11, 'B612 Mono'), fill: col, align: 'center', track: 2 });
    if (hot && I > 0 && lvl < 2) pulse(c, x, y, T.a2, t, r + 4, .45);
  });
  callout(c, 480 + 70, 234 - 60, 640, 128, 'TWO SOURCES OVER LIMIT', 'N2 84 · N4 91 · LIMIT 80', CO, { col: T.a2, bg: 'rgba(5,11,20,.9)', f1: F(600, 14, 'Chakra Petch'), f2: F(400, 12, 'B612 Mono'), ink: T.a2, ink2: T.ink, tr1: 2 });
  const lx = 175, lw_ = 560, y0 = 398, rp = pin(B, .6, 1.4);
  txt(c, RK > 0 ? 'ALL SOURCES · RANKED' : 'ALL SOURCES', 140, 388, { font: F(400, 11, 'B612 Mono'), fill: T.a1, track: 2, alpha: rp });
  c.strokeStyle = rgba(T.a2, .7 * rp); c.setLineDash([3, 4]); c.beginPath(); c.moveTo(lx + lw_ * .8, y0 - 6); c.lineTo(lx + lw_ * .8, y0 + 6 * 17 + 4); c.stroke(); c.setLineDash([]);
  txt(c, 'LIMIT 80', lx + lw_ * .8 + 6, y0 - 8, { font: F(400, 10, 'B612 Mono'), fill: T.a2, alpha: rp });
  D4.forEach((v, i) => { const y = y0 + DV.slot(B, i) * 17, g = clamp(DV.grow(B, i, .9, .08, 1.4)), hot = v > 80, da = hot ? 1 : 1 - .5 * I * (1 - smooth(5.3, 5.8, B.t));
    c.save(); c.globalAlpha *= da;
    txt(c, SAMPLE.cats[i], 140, y + 10, { font: F(400, 10, 'B612 Mono'), fill: T.ink, alpha: .7 });
    c.fillStyle = rgba(T.a1, .12); c.fillRect(lx, y, lw_, 11); c.fillStyle = hot ? T.a2 : T.a1; c.fillRect(lx, y, lw_ * v / 100 * g, 11);
    txt(c, String(Math.round(v * g)), lx + lw_ * v / 100 * g + 8, y + 10, { font: F(400, 11, 'B612 Mono'), fill: hot ? T.a2 : T.ink });
    if (RK > 0) txt(c, '#' + (DV.rank[i] + 1), 128, y + 10, { font: F(400, 10, 'B612 Mono'), fill: T.a1, align: 'right', alpha: RK });
    c.restore(); });
  c.restore();
};

/* TX-04 · billboards */
DATA4['TX-04'] = (s, t, B) => {
  const { c, lvl } = s, T = s.th.tok, a = pin(B, .6) * (1 - pout(B, .6)), I = dvIns(B), CO = dvCallout(B), RK = dvRk(B);
  const pairs = [0, 1, 2].map(i => [D4[i], D4[i + 3]]), { rank } = dvRank(pairs.map(p => p[0])), gapI = 0, hiI = I * (1 - smooth(5.2, 5.6, B.t));
  c.save(); c.globalAlpha = a;
  txt(c, 'BILLBOARD DATA · SAMPLE', 60, 64, { font: F(600, 26, 'Saira Condensed'), fill: T.ink, track: 4 });
  txt(c, RK > 0 ? 'RANKED BY THE ORANGE SERIES' : 'ORANGE vs TEAL · TWO SERIES', 60, 86, { font: F(400, 12, 'Share Tech Mono'), fill: T.a3, track: 3 });
  let gx = 0, gy0 = 0, gy1 = 0;
  pairs.forEach(([va, vb], i) => {
    const x = 150 + lerp(i, rank[i], dvSort(B, rank, i)) * 260, y = 110, w = 170, h = 320, p = clamp(DV.grow(B, i, 1.2, .25, .3)), base = y + h - 30, colH = v => v / 100 * 220 * p, da = i === gapI ? 1 : 1 - .45 * hiI;
    c.save(); c.globalAlpha *= da;
    c.fillStyle = 'rgba(63,208,224,.06)'; c.fillRect(x, y, w, h); c.strokeStyle = rgba(T.a3, i === gapI && hiI > 0 ? .4 + .5 * hiI : .38); c.lineWidth = 1; c.strokeRect(x, y, w, h);
    [[va, T.a1, x + 40], [vb, T.a3, x + 100]].forEach(([v, col, bx]) => { const hh = colH(v), g = c.createLinearGradient(0, base - hh, 0, base); g.addColorStop(0, rgba(col, .95)); g.addColorStop(1, rgba(col, .15)); c.fillStyle = g; c.fillRect(bx, base - hh, 30, hh);
      if (lvl < 2) { c.save(); c.shadowBlur = 16; c.shadowColor = col; c.fillStyle = col; c.fillRect(bx, base - hh, 30, 2); c.restore();
        c.save(); c.globalCompositeOperation = 'lighter'; for (let k = 0; k < 7; k++) { const yy = base - ((t * 70 + k * 41 + bx) % Math.max(1, hh)); c.fillStyle = rgba('#FFFFFF', .25); c.fillRect(bx + 6 + (k * 7) % 18, yy, 2, 6); } c.restore(); } });
    txt(c, countTo(va, p), x + 55, base - colH(va) - 12, { font: F(600, 34, 'Saira Condensed'), fill: T.a1, align: 'center' });
    txt(c, countTo(vb, p), x + 115, base - colH(vb) - 12, { font: F(600, 34, 'Saira Condensed'), fill: T.a3, align: 'center' });
    txt(c, SAMPLE.cats[i] + ' / ' + SAMPLE.cats[i + 3], x + w / 2, y + h - 8, { font: F(400, 11, 'Share Tech Mono'), fill: T.ink, alpha: .7, align: 'center', track: 2 });
    if (RK > 0) txt(c, '#' + (rank[i] + 1), x + w - 12, y + 26, { font: F(600, 22, 'Saira Condensed'), fill: T.a1, align: 'right', alpha: RK });
    if (i === gapI) { gx = x + 158; gy0 = base - colH(vb); gy1 = base - colH(va); }
    c.restore();
  });
  vBracket(c, gx, gy0, gy1, 'GAP 29', T.ink, hiI, F(600, 24, 'Saira Condensed'));
  callout(c, gx, gy0, gx + 56, 150, 'BIGGEST GAP · N1 vs N4', 'TEAL LEADS BY 29 POINTS', CO, { col: T.a2, bg: 'rgba(5,7,11,.9)', f1: F(600, 18, 'Saira Condensed'), f2: F(400, 12, 'Share Tech Mono'), ink: '#FFD3E6', ink2: T.ink, tr1: 2 });
  c.restore();
};

/* TX-05 · channel-change charts, each with its own insight */
DATA4['TX-05'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { box } = X;
  box(); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(0, 0, 960, 540);
  const sx = 190, sy = 64, sw = 580, sh = 360; c.fillStyle = '#060608'; rr(c, sx, sy, sw, sh, 22); c.fill(); c.strokeStyle = rgba(T.ink, .8); c.lineWidth = 4; rr(c, sx, sy, sw, sh, 22); c.stroke();
  const per = B.d / 3, ch = Math.min(2, Math.floor(B.t / per)), ct = B.t - ch * per, p = eo(clamp((ct - .15) / 1.0)), ins = smooth(1.2, 1.5, ct);
  c.save(); rr(c, sx + 4, sy + 4, sw - 8, sh - 8, 18); c.clip();
  const ox = sx + 60, oy = sy + sh - 50;
  if (ch === 0) {
    const cols = [T.a1, T.a2, T.a3, '#2B2BFF', T.a1, T.a2], sp = i => eio(clamp((ct - 2.0 - DV.rank[i] * .06) / .7));
    c.strokeStyle = rgba(T.ink, .5); c.setLineDash([6, 6]); const ay = oy - DV.avg / 100 * 230; c.beginPath(); c.moveTo(ox - 10, ay); c.lineTo(ox - 10 + 470 * ins, ay); c.stroke(); c.setLineDash([]);
    if (ins > .5) txt(c, 'AVG 68.5', ox + 466, ay - 8, { font: F(400, 20, 'VT323'), fill: T.ink, align: 'right', alpha: ins });
    D4.forEach((v, i) => { const x = ox + lerp(i, DV.rank[i], sp(i)) * 76, h = v / 100 * 230 * p, hot = i === DV.maxI; c.globalAlpha = hot ? 1 : 1 - .45 * ins * (1 - smooth(2.0, 2.3, ct)); c.fillStyle = cols[i]; c.fillRect(x, oy - h, 54, h);
      txt(c, String(v), x + 27, oy - h - 10, { font: F(400, 22, 'VT323'), fill: T.ink, align: 'center' }); txt(c, SAMPLE.cats[i], x + 27, oy + 22, { font: F(400, 18, 'VT323'), fill: T.ink, align: 'center', alpha: .7 }); c.globalAlpha = 1; });
    if (ins > 0 && ct < 2.2) txt(c, '▼ N4 TOPS THE CHANNEL', ox + 3 * 76 + 27, sy + 70, { font: F(400, 22, 'VT323'), fill: T.a3, align: 'center', alpha: ins * (1 - smooth(1.9, 2.1, ct)) });
    if (ct > 2.6) txt(c, 'SORTED · HIGH TO LOW', sx + sw - 30, sy + 74, { font: F(400, 20, 'VT323'), fill: T.a3, align: 'right', alpha: smooth(2.6, 2.9, ct) });
  } else if (ch === 1) {
    const L = SAMPLE.line, m = p * (L.length - 1), px = j => ox + j / 11 * 440, py = v => oy - v * 250, P = [];
    for (let j = 0; j <= Math.floor(m); j++) P.push([px(j), py(L[j])]);
    if (P.length > 1) { const ag = c.createLinearGradient(0, oy - 250, 0, oy); ag.addColorStop(0, rgba(T.a3, .35)); ag.addColorStop(1, rgba(T.a3, 0)); c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.lineTo(P[P.length - 1][0], oy); c.lineTo(P[0][0], oy); c.closePath(); c.fillStyle = ag; c.fill(); }
    c.strokeStyle = T.a3; c.lineWidth = 5; c.lineJoin = 'round'; c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.lineJoin = 'miter';
    c.fillStyle = T.a1; P.forEach(q => { c.beginPath(); c.arc(q[0], q[1], 5, 0, TAU); c.fill(); });
    if (ins > 0 && P.length > 1) { flowDots(c, P, t, '#FFFFFF', 5, .35, 2.4); const e = P[P.length - 1]; pulse(c, e[0], e[1], T.a3, t, 7);
      txt(c, 'PEAK 0.86 · W12', e[0] - 10, e[1] - 22, { font: F(400, 22, 'VT323'), fill: T.a3, align: 'right', alpha: ins });
      txt(c, '+' + Math.round(169 * smooth(1.5, 2.4, ct)) + '% SINCE W1', sx + sw - 30, sy + 74, { font: F(400, 30, 'VT323'), fill: T.ink, align: 'right', alpha: ins }); }
  } else {
    let a0 = -Math.PI / 2; const cols = [T.a1, T.a2, T.a3, '#2B2BFF'], ex = smooth(1.2, 1.6, ct);
    SAMPLE.share.forEach((v, i) => { const a1 = a0 + v / 100 * TAU * p, mid = (a0 + a1) / 2, off = i === 0 ? 18 * ex : 0; c.globalAlpha = i === 0 ? 1 : 1 - .4 * ex; c.fillStyle = cols[i];
      c.beginPath(); c.moveTo(480 + Math.cos(mid) * off, 244 + Math.sin(mid) * off); c.arc(480 + Math.cos(mid) * off, 244 + Math.sin(mid) * off, 120, a0, a1); c.closePath(); c.fill(); c.globalAlpha = 1;
      txt(c, v + '%', 480 + Math.cos(mid) * (150 + off), 252 + Math.sin(mid) * (150 + off), { font: F(400, 24, 'VT323'), fill: T.ink, align: 'center' }); a0 = a1; });
    c.fillStyle = '#060608'; c.beginPath(); c.arc(480, 244, 54, 0, TAU); c.fill();
    txt(c, '100%', 480, 252, { font: F(400, 28, 'VT323'), fill: T.ink, align: 'center', alpha: p });
    if (ex > 0) txt(c, 'N1 HOLDS THE LARGEST SLICE · 34%', sx + 30, sy + sh - 22, { font: F(400, 22, 'VT323'), fill: T.a1, alpha: ex });
  }
  if (ct < .18 && lvl < 2) { for (let y = sy; y < sy + sh; y += 6) for (let x = sx; x < sx + sw; x += 12) { const v = hash3(x, y, Math.floor(t * 40)) % 255; c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(x, y, 12, 6); } }
  if (ct < .18 && lvl === 2) { c.fillStyle = `rgba(6,6,8,${1 - ct / .18})`; c.fillRect(sx, sy, sw, sh); }
  txt(c, 'CH ' + (21 + ch), sx + sw - 30, sy + 44, { font: F(400, 34, 'VT323'), fill: '#33FF66', align: 'right' });
  txt(c, ['BARS', 'TREND', 'SHARE'][ch] + ' · SAMPLE', sx + 30, sy + 40, { font: F(400, 22, 'VT323'), fill: T.ink, alpha: .8 });
  if (lvl < 2) scanlines(c, 960, 540, .1);
  c.restore();
  txt(c, 'S4 · EACH CHANNEL BUILDS, THEN MAKES ITS POINT', 480, 470, { font: F(400, 13, 'Space Grotesk'), fill: T.ink, align: 'center', track: 2, alpha: .85 });
};

/* TX-06 · two worlds, with a scrubber and the gap between them */
DATA4['TX-06'] = (s, t, B, X) => {
  const { c } = s, T = s.th.tok, { f, cardS } = X, hid = s.st.hid, L = SAMPLE.line, r = pearson(L, hid);
  txt(c, 'TWO WORLDS · SAMPLE DATA', 480, 92, { font: F(400, 28, 'VT323'), fill: T.ink, align: 'center', track: 4 });
  const gx = 190, gy = 120, gw = 580, gh = 330, px = i => gx + 24 + i / 11 * (gw - 48), py = v => gy + gh - 24 - v * (gh - 60), flipped = f > .5;
  c.save(); c.translate(0, gy + gh / 2); c.scale(1, Math.max(.02, cardS)); c.translate(0, -(gy + gh / 2));
  c.fillStyle = flipped ? 'rgba(141,163,181,.10)' : rgba(T.ink, .07); c.fillRect(gx, gy, gw, gh); c.strokeStyle = rgba(T.ink, .3); c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
  c.strokeStyle = rgba(T.ink, .07); for (let i = 1; i < 29; i++) { c.beginPath(); c.moveTo(gx + i * 20, gy); c.lineTo(gx + i * 20, gy + gh); c.stroke(); } for (let j = 1; j < 17; j++) { c.beginPath(); c.moveTo(gx, gy + j * 20); c.lineTo(gx + gw, gy + j * 20); c.stroke(); }
  for (let i = 0; i < 12; i += 2) txt(c, 'W' + (i + 1), px(i), gy + gh - 6, { font: F(400, 16, 'VT323'), fill: T.ink, alpha: .5, align: 'center' });
  const sp = pin(B, 1.6, .2), m = sp * 11;
  if (flipped) { c.beginPath(); for (let i = 0; i < 12; i++) i ? c.lineTo(px(i), py(L[i])) : c.moveTo(px(i), py(L[i])); for (let i = 11; i >= 0; i--) c.lineTo(px(i), py(hid[i])); c.closePath(); c.fillStyle = rgba(T.a3, .16); c.fill(); }
  c.strokeStyle = rgba(T.ink, .88); c.lineWidth = 2.4; c.beginPath(); for (let i = 0; i <= Math.floor(m); i++) i ? c.lineTo(px(i), py(L[i])) : c.moveTo(px(i), py(L[i])); c.stroke();
  for (let i = 0; i <= Math.floor(m); i++) { const q = clamp((B.t - .2 - i * .13) / .25); c.fillStyle = T.ink; c.beginPath(); c.arc(px(i), py(L[i]), 3.6 * backOutS(q), 0, TAU); c.fill(); }
  txt(c, flipped ? 'THE OTHER SIDE' : 'THE SURFACE', gx + 16, gy + 28, { font: F(400, 22, 'VT323'), fill: flipped ? T.a3 : T.ink });
  if (flipped) { c.save(); c.setLineDash([7, 5]); c.strokeStyle = T.a3; c.lineWidth = 2.6; c.beginPath(); hid.forEach((v, i) => i ? c.lineTo(px(i), py(v)) : c.moveTo(px(i), py(v))); c.stroke(); c.restore();
    const hx = px(8), hy = py(hid[8]); c.strokeStyle = T.a3; c.lineWidth = 2.5; c.beginPath(); c.ellipse(hx, hy, 46, 30, -.2, 0, TAU); c.stroke();
    txt(c, 'HIDDEN VARIABLE TURNS AT W9', hx + 52, hy + 46, { font: F(400, 22, 'VT323'), fill: T.a3 });
    txt(c, 'r = ' + r.toFixed(2) + ' · SAMPLE', gx + gw - 14, gy + 28, { font: F(400, 22, 'VT323'), fill: T.a3, align: 'right' }); }
  const scrub = flipped && B.t > 3.4 && B.t < 6.6 ? eio((B.t - 3.4) / 3.2) : -1;
  if (scrub >= 0) { const j = scrub * 11, j0 = Math.min(10, Math.floor(j)), fr = j - j0, x = lerp(px(j0), px(j0 + 1), fr), sv = lerp(L[j0], L[j0 + 1], fr), hv = lerp(hid[j0], hid[j0 + 1], fr);
    c.strokeStyle = rgba(T.ink, .55); c.lineWidth = 1; c.beginPath(); c.moveTo(x, gy + 36); c.lineTo(x, gy + gh - 20); c.stroke(); c.fillStyle = T.ink; c.beginPath(); c.arc(x, py(sv), 5, 0, TAU); c.fill();
    if (flipped) { c.fillStyle = T.a3; c.beginPath(); c.arc(x, py(hv), 5, 0, TAU); c.fill(); }
    const bx = Math.min(x + 12, gx + gw - 150); c.fillStyle = 'rgba(7,6,8,.85)'; c.fillRect(bx, gy + 44, 138, flipped ? 52 : 30);
    txt(c, `W${Math.round(j) + 1}  SURFACE ${sv.toFixed(2)}`, bx + 8, gy + 64, { font: F(400, 18, 'VT323'), fill: T.ink }); if (flipped) txt(c, `      HIDDEN  ${hv.toFixed(2)}`, bx + 8, gy + 86, { font: F(400, 18, 'VT323'), fill: T.a3 }); }
  c.restore();
  const late = smooth(8.0, 8.4, B.t);
  if (late > 0) callout(c, px(8), py(L[8]), px(8) - 160, gy + 70, 'THE SURFACE ALONE MISSES THE TURN', 'SAMPLE NOTE', late, { col: T.a1, bg: 'rgba(7,6,8,.9)', f1: F(400, 22, 'VT323'), f2: F(400, 16, 'VT323'), ink: '#FFD6D0', ink2: T.ink });
};

/* TX-07 · equalizer */
DATA4['TX-07'] = (s, t, B) => {
  const { c, lvl } = s, T = s.th.tok, I = dvIns(B), CO = dvCallout(B), RK = dvRk(B), base = 330;
  c.fillStyle = 'rgba(11,4,32,.62)'; c.fillRect(0, 0, 960, 540);
  const cg = c.createLinearGradient(0, 100, 0, 250); cg.addColorStop(0, '#FFFFFF'); cg.addColorStop(.48, '#D9D2F0'); cg.addColorStop(.52, '#6B4FA0'); cg.addColorStop(1, T.a2);
  const gp0 = eo(pin(B, 1.2, .2)), peak = lerp(84, 91, smooth(2.8, 3.4, B.t));
  txt(c, String(Math.round(peak * gp0)), 210, 250, { font: F(400, 150, 'Monoton'), fill: cg, align: 'center', glow: 14, gc: T.a1 });
  txt(c, I > .5 ? 'N4 · PEAK READING · SAMPLE' : 'N2 · LIVE READING · SAMPLE', 210, 290, { font: F(400, 13, 'Share Tech Mono'), fill: T.ink, align: 'center', track: 3 });
  let mx = 0, my = 0;
  D4.forEach((v, k) => { const x = 450 + DV.slot(B, k) * 74, gp = Math.max(0, DV.grow(B, k, 1.1, .1, .2)), h = v / 100 * 230 * gp * (.97 + .03 * Math.sin(t * 3.1 + k)), da = DV.dim(B, k), hot = k === DV.maxI;
    c.save(); c.globalAlpha *= da;
    const g = c.createLinearGradient(0, base - 230, 0, base); g.addColorStop(0, T.a2); g.addColorStop(1, T.a1); c.fillStyle = g;
    for (let yy = base; yy > base - h; yy -= 10) c.fillRect(x, yy - 8, 50, 8);
    const cap = base - h - 10 - 8 * Math.abs(Math.sin(t * 1.4 + k)); c.fillStyle = '#FFFFFF'; if (hot && I > 0 && lvl < 2) { c.shadowBlur = 16; c.shadowColor = T.a2; } c.fillRect(x, cap, 50, 3); c.shadowBlur = 0;
    c.save(); c.globalAlpha *= .22; c.translate(0, base * 2 + 4); c.scale(1, -.5); c.fillStyle = g; c.fillRect(x, base - h, 50, h); c.restore();
    if (gp > .4) txt(c, String(v), x + 25, cap - 10, { font: F(400, 15, 'Share Tech Mono'), fill: hot ? '#FFFFFF' : T.ink, align: 'center', alpha: .9 });
    txt(c, SAMPLE.cats[k], x + 25, base + 50, { font: F(400, 12, 'Share Tech Mono'), fill: T.ink, align: 'center', alpha: .75 });
    if (RK > 0) txt(c, '#' + (DV.rank[k] + 1), x + 25, base + 70, { font: F(400, 14, 'Share Tech Mono'), fill: T.a2, align: 'center', alpha: RK });
    if (hot) { mx = x + 25; my = cap - 26; }
    c.restore(); });
  refLine(c, 440, 890, base - DV.avg / 100 * 230, pin(B, .9, 3.0), T.a2, 'AVG 68.5', F(400, 12, 'Share Tech Mono'), { lx: 892, ly: -6, al: 'right' });
  callout(c, mx, my, mx - 120, 96, 'N4 PEAKS AT 91', 'THE LOUDEST CHANNEL IN THE MIX', CO, { col: T.a2, bg: 'rgba(11,4,32,.9)', f1: F(400, 16, 'Share Tech Mono'), f2: F(400, 12, 'Share Tech Mono'), ink: '#FFFFFF', ink2: T.ink, tr1: 2 });
};

/* TX-08 · system meters with a limit line and trend panes */
DATA4['TX-08'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { header } = X, vals = [62, 84, 48, 91], labs = ['O2', 'PWR', 'HULL', 'NAV'], { rank } = dvRank(vals), I = dvIns(B), CO = dvCallout(B), RK = dvRk(B), blink = lvl === 2 || (t % 1) < .5;
  header('SYSTEM METERS'); txt(c, RK > 0 ? 'SORTED BY LOAD · SAMPLE DATA' : 'SAMPLE DATA · AMBER ABOVE 80', 66, 124, { font: F(400, 20, 'VT323'), fill: T.ink, alpha: .6 });
  const base = 450, segY = q => base - q * 13;
  vals.forEach((v, k) => { const x = 120 + lerp(k, rank[k], dvSort(B, rank, k)) * 200, p = eo(pin(B, 1.6, .2 + k * .3)), lit = Math.round(v / 5 * p), over = v > 80;
    for (let q = 0; q < 20; q++) { c.fillStyle = q < lit ? (q >= 16 ? (over && I > 0 && !blink ? rgba(T.a1, .35) : T.a1) : T.a2) : rgba(T.a2, .07); c.fillRect(x, segY(q), 70, 10); }
    [...String(Math.round(v * p)).padStart(2, '0')].forEach((d, i) => sevenSeg(c, d, x + 6 + i * 32, 150, 24, 40, over ? T.a1 : T.a2, rgba(T.a2, .07)));
    txt(c, labs[k], x + 35, base + 34, { font: F(400, 22, 'VT323'), fill: T.ink, align: 'center', alpha: .8 });
    if (RK > 0) txt(c, '#' + (rank[k] + 1), x + 72, 182, { font: F(400, 22, 'VT323'), fill: T.a2, alpha: RK });
    const tp = pin(B, 1.2, 1.8 + k * .2), sx = x + 84, sy0 = 300; c.strokeStyle = rgba(T.a2, .25); c.lineWidth = 1; c.strokeRect(sx, sy0, 86, 60);
    c.strokeStyle = over ? T.a1 : T.a2; c.lineWidth = 1.5; c.beginPath(); const m = Math.floor(tp * 11); for (let j = 0; j <= m; j++) { const yv = sy0 + 54 - SAMPLE.line[j] * v / 100 * 50; j ? c.lineTo(sx + 4 + j * 7, yv) : c.moveTo(sx + 4, yv); } c.stroke();
    if (tp > .1) txt(c, 'TREND', sx + 4, sy0 - 4, { font: F(400, 14, 'VT323'), fill: T.ink, alpha: .5 });
  });
  const ly = segY(16) - 2, lp = pin(B, .8, 2.9); c.save(); c.setLineDash([8, 5]); c.strokeStyle = rgba(T.a1, .9); c.lineWidth = 1.5; c.beginPath(); c.moveTo(100, ly); c.lineTo(100 + 760 * eio(lp), ly); c.stroke(); c.restore();
  if (lp > .6) txt(c, 'LIMIT 80', 860, ly - 6, { font: F(400, 20, 'VT323'), fill: T.a1, alpha: lp, align: 'right' });
  const nx = 120 + lerp(3, rank[3], dvSort(B, rank, 3)) * 200 + 35;
  callout(c, nx, 144, nx - 40, 100, 'TWO SYSTEMS OVER LIMIT', 'PWR 84 · NAV 91', CO, { col: T.a1, bg: 'rgba(2,7,2,.92)', f1: F(400, 24, 'VT323'), f2: F(400, 20, 'VT323'), ink: T.a1, ink2: T.ink });
};

/* TX-09 · star map that folds into a ranked share bar */
DATA4['TX-09'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { stars } = X, sh = SAMPLE.share, { rank, order } = dvRank(sh), I = dvIns(B), CO = dvCallout(B);
  c.fillStyle = T.bg; c.fillRect(0, 0, 960, 540); stars(.6, 0);
  const N = [[230, 190, 'I', T.a1], [700, 150, 'II', T.a2], [560, 330, 'III', '#E6E9F0'], [300, 360, 'IV', T.a3]], lanes = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]];
  lanes.forEach(([u, v]) => { const w = (sh[u] + sh[v]) / 18, lp = pin(B, .8, .2); c.strokeStyle = rgba(T.a1, .3); c.lineWidth = w; c.setLineDash([6, 8]); c.lineDashOffset = -t * 20; c.beginPath(); c.moveTo(N[u][0], N[u][1]); c.lineTo(lerp(N[u][0], N[v][0], lp), lerp(N[u][1], N[v][1], lp)); c.stroke(); c.setLineDash([]);
    if (lp >= 1 && lvl < 2) flowDots(c, [[N[u][0], N[u][1]], [N[v][0], N[v][1]]], t + u, N[u][3], 3, .18, 2); });
  const fold = smooth(5.6, 7.0, B.t);
  N.forEach(([x, y, num, col], k) => { const p = eo(pin(B, .8, .3 + k * .25)), r = Math.sqrt(sh[k]) * 5 * p, a = 1 - fold * .6;
    c.save(); c.globalAlpha *= a;
    const g = c.createRadialGradient(x, y, 0, x, y, r * 2.4); g.addColorStop(0, rgba(col, .5)); g.addColorStop(1, rgba(col, 0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 2.4, 0, TAU); c.fill();
    c.fillStyle = col; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    const rp = eo(pin(B, 1.2, 1.0 + k * .2)); c.strokeStyle = rgba(col, .25); c.lineWidth = 3; c.beginPath(); c.arc(x, y, r + 14, 0, TAU); c.stroke(); c.strokeStyle = col; c.beginPath(); c.arc(x, y, r + 14, -Math.PI / 2, -Math.PI / 2 + TAU * sh[k] / 100 * rp); c.stroke();
    txt(c, `FACTION ${num}`, x + r + 22, y - 4, { font: F(700, 18, 'Oswald'), fill: T.ink, track: 3, alpha: p }); txt(c, `${Math.round(sh[k] * rp)}% OF CHANNEL`, x + r + 22, y + 16, { font: F(400, 11, 'Space Mono'), fill: col, alpha: p });
    if (k === order[0] && I > 0 && lvl < 2 && fold < .5) pulse(c, x, y, col, t, r + 18, .5);
    c.restore(); });
  callout(c, N[0][0], N[0][1] + Math.sqrt(sh[0]) * 5 + 18, N[0][0] + 60, 268, 'FACTION I · 34%', 'THE LARGEST SHARE, THREE POINTS CLEAR', CO, { col: T.a1, bg: 'rgba(0,0,0,.85)', f1: F(700, 16, 'Oswald'), f2: F(400, 11, 'Space Mono'), ink: T.a1, ink2: T.ink, tr1: 3 });
  if (fold > 0) { const bx = 120, bw = 720, by = 452, bh = 26; let acc = 0;
    order.forEach(k => { const w = sh[k] / 100 * bw, q = eio(clamp((B.t - 5.6 - rank[k] * .15) / 1.2)), [x, y, num, col] = N[k], tx = bx + acc, cx = lerp(x - 10, tx, q), cy = lerp(y - 10, by, q), cw = lerp(20, w - 2, q), chh = lerp(20, bh, q);
      c.fillStyle = col; c.fillRect(cx, cy, cw, chh); if (q > .9) { txt(c, `${num} · ${sh[k]}%`, tx + w / 2, by + bh + 20, { font: F(400, 12, 'Space Mono'), fill: T.ink, align: 'center', alpha: clamp((q - .9) * 10) }); }
      acc += w; });
    txt(c, 'THE CHANNEL, RANKED · 100%', bx, by - 12, { font: F(400, 11, 'Space Mono'), fill: T.a1, track: 3, alpha: fold }); }
  txt(c, 'THE FACTIONS', 60, 80, { font: F(700, 34, 'Oswald'), fill: T.ink, track: 5 }); txt(c, 'S4 · SHARE ON THE MAP, THEN FOLDED INTO ONE BAR', 60, 102, { font: F(400, 11, 'Space Mono'), fill: T.a1, track: 3 });
};

/* TX-10 · stone slabs */
DATA4['TX-10'] = (s, t, B, X) => {
  const { c } = s, T = s.th.tok, { sky, dunes, figure } = X, I = dvIns(B), CO = dvCallout(B), RK = dvRk(B), ground = 430, ROM = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  sky(); dunes(2);
  c.strokeStyle = rgba(T.a2, .25); c.lineWidth = 1; for (let k = 0; k < 6; k++) { c.beginPath(); for (let x = 0; x <= 960; x += 10) { const y = 300 + k * 16 - 30 * Math.exp(-((x - 520) ** 2) / (2 * 160 * 160)) * (1 - k / 7) + Math.sin(x * .02 + k) * 3; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
  c.fillStyle = '#C9A77A'; c.fillRect(0, ground, 960, 110);
  let fx = 0, mx = 0, my = 0;
  D4.forEach((v, i) => { const x = 150 + DV.slot(B, i) * 116, w = 70, p = eo(clamp((B.t - .3 - i * .08) / .9)), h = v / 100 * 250 * p, top = ground - h, da = DV.dim(B, i), hot = i === DV.maxI;
    c.save(); c.globalAlpha *= da;
    c.fillStyle = 'rgba(43,38,32,.18)'; c.beginPath(); c.moveTo(x + w, ground); c.lineTo(x + w + h * .35, ground); c.lineTo(x + w + 8, top + 10); c.lineTo(x + w, top); c.closePath(); c.fill();
    const g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, '#6E5536'); g.addColorStop(.4, '#8C6A43'); g.addColorStop(1, '#5A452B'); c.fillStyle = g; c.fillRect(x, top, w, h);
    c.fillStyle = 'rgba(255,240,215,.35)'; c.fillRect(x, top, w, 3); c.fillStyle = 'rgba(43,38,32,.18)'; for (let k = 0; k < h; k += 22) c.fillRect(x + 6, top + k + 10, w - 12, 1);
    if (hot && I > 0) { const sg = c.createLinearGradient(x + w - 14, 0, x + w, 0); sg.addColorStop(0, 'rgba(255,214,150,0)'); sg.addColorStop(1, `rgba(255,224,170,${.8 * I})`); c.fillStyle = sg; c.fillRect(x + w - 14, top, 14, h); }
    if (RK > 0 && h > 40) txt(c, ROM[DV.rank[i]], x + w / 2, top + 34, { font: F(700, 18, 'Syncopate'), fill: 'rgba(255,240,215,.75)', align: 'center', alpha: RK });
    if (p > .5) txt(c, String(Math.round(v * p)), x + w / 2, top - 12, { font: F(400, 18, 'IBM Plex Mono'), fill: T.ink, align: 'center' });
    txt(c, SAMPLE.cats[i], x + w / 2, ground + 22, { font: F(400, 11, 'IBM Plex Mono'), fill: T.ink, align: 'center', alpha: .8 });
    if (hot) { fx = x + w + 14; mx = x + w / 2; my = top - 30; }
    c.restore(); });
  figure(fx, ground, 1.4);
  const ay = ground - DV.avg / 100 * 250, ap = pin(B, .9, 3.0); c.save(); c.strokeStyle = rgba(T.ink, .75); c.lineWidth = 1.2; c.beginPath(); c.moveTo(110, ay); c.lineTo(110 + 740 * eio(ap), ay); c.stroke();
  for (let x = 110; x < 110 + 740 * eio(ap); x += 24) { c.beginPath(); c.moveTo(x, ay - 3); c.lineTo(x, ay + 3); c.stroke(); } c.restore();
  if (ap > .6) txt(c, 'AVG 68.5', 856, ay + 4, { font: F(400, 12, 'IBM Plex Mono'), fill: T.ink, alpha: ap });
  callout(c, mx, my, mx + (mx > 600 ? -150 : 150), 150, 'N4 · 91 · TALLEST', 'A THIRD ABOVE THE AVERAGE', CO, { col: T.a1, bg: 'rgba(243,233,218,.94)', f1: F(700, 13, 'Syncopate'), f2: F(400, 11, 'IBM Plex Mono'), ink: T.ink, ink2: T.ink, tr1: 3 });
  txt(c, RK > 0 ? 'STONE-SLAB DATA · RANKED · TRUE PROPORTION' : 'STONE-SLAB DATA · SAMPLE · TRUE PROPORTION', 480, 112, { font: F(700, 13, 'Syncopate'), fill: T.ink, align: 'center', track: 4 });
};

/* TX-11 · dashboard, gap bracket, lap chart */
DATA4['TX-11'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { gauge } = X, I = dvIns(B), CO = dvCallout(B);
  c.fillStyle = 'rgba(10,10,10,.66)'; rr(c, 60, 70, 840, 410, 14); c.fill(); c.strokeStyle = 'rgba(242,230,208,.25)'; c.lineWidth = 2; rr(c, 60, 70, 840, 410, 14); c.stroke();
  txt(c, 'DASHBOARD · SAMPLE DATA', 90, 108, { font: F(700, 20, 'Stardos Stencil'), fill: T.ink, track: 3 });
  [[220, 212, 31, 'FUEL'], [480, 212, 84, 'HEAT'], [740, 212, 62, 'RIVAL']].forEach(([x, y, v, l], k) => gauge(x, y, 62, v, l, pin(B, 1.4, .2 + k * .25)));
  const rp = eio(pin(B, 2.0, 1.4)), bx = 170, bw = 600;
  [[84, T.a1, 'US'], [70, T.a2, 'RIVAL']].forEach(([v, col, l], k) => { const y = 296 + k * 38; c.fillStyle = 'rgba(242,230,208,.1)'; c.fillRect(bx, y, bw, 24); c.fillStyle = col; c.fillRect(bx, y, bw * v / 100 * rp, 24);
    if (lvl === 0) { c.save(); c.globalCompositeOperation = 'lighter'; for (let q = 0; q < 6; q++) { const xx = bx + ((t * 260 + q * 97 + k * 50) % (bw * v / 100 * rp + 1)); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(xx, y + 6 + (q % 3) * 5, 24, 2); } c.restore(); }
    txt(c, l, bx - 10, y + 18, { font: F(700, 16, 'Stardos Stencil'), fill: T.ink, align: 'right' }); txt(c, String(Math.round(v * rp)), bx + bw * v / 100 * rp + 10, y + 19, { font: F(500, 20, 'Barlow Condensed'), fill: T.ink }); });
  const x70 = bx + bw * .7, x84 = bx + bw * .84, hb = I * (1 - smooth(8.9, 9.3, B.t));
  hBracket(c, x70, x84, 288, 'GAP +14', T.a1, hb, F(700, 20, 'Stardos Stencil'));
  callout(c, x84, 308, x84 + 30, 420, 'WE LEAD BY 14', 'A LEAD BUILT OVER 12 LAPS', CO, { col: T.a1, bg: 'rgba(10,10,10,.9)', f1: F(700, 18, 'Stardos Stencil'), f2: F(500, 14, 'Barlow Condensed'), ink: T.ink, ink2: T.ink, tr1: 2 });
  const lp = pin(B, 1.6, 5.6), gaps = SAMPLE.line.map(v => v / .86 * 14), lx = bx, lwid = bw, ly0 = 398, lh = 62, pxl = j => lx + j / 11 * lwid, pyl = g => ly0 + lh - g / 16 * lh;
  if (lp > 0) { txt(c, 'GAP OVER 12 LAPS', lx, ly0 - 6, { font: F(700, 13, 'Stardos Stencil'), fill: T.ink, track: 2, alpha: clamp(lp * 3) });
    c.strokeStyle = 'rgba(242,230,208,.15)'; c.lineWidth = 1; c.beginPath(); c.moveTo(lx, ly0 + lh); c.lineTo(lx + lwid, ly0 + lh); c.stroke();
    const m = lp * 11, P = []; for (let j = 0; j <= Math.floor(m); j++) P.push([pxl(j), pyl(gaps[j])]); if (Math.floor(m) < 11) { const j = Math.floor(m), f = m - j; P.push([lerp(pxl(j), pxl(j + 1), f), lerp(pyl(gaps[j]), pyl(gaps[j + 1]), f)]); }
    c.strokeStyle = T.a1; c.lineWidth = 3; c.lineJoin = 'round'; c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.lineJoin = 'miter';
    const e = P[P.length - 1]; c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(e[0], e[1], 4, 0, TAU); c.fill();
    if (lp >= 1) txt(c, '+14', e[0] + 10, e[1] + 6, { font: F(400, 24, 'Anton'), fill: T.a1 }); }
};

/* TX-12 · log timeline that morphs to a linear scale */
DATA4['TX-12'] = (s, t, B) => {
  const { c } = s, T = s.th.tok, I = dvIns(B), CO = dvCallout(B), m = eio(clamp((B.t - 5.6) / 1.6)), late = smooth(7.3, 7.8, B.t);
  s.st.stars.forEach(([x, y, k]) => { c.fillStyle = `rgba(232,225,213,${.08 + k * .2})`; c.fillRect(x, y, 1, 1); });
  const x0 = 150, x1 = 860, yy = 320, a = pin(B, .6), pxLog = lg => x0 + lg / 7 * (x1 - x0), pxLin = yrs => x0 + yrs / 1e7 * (x1 - x0), px = yrs => lerp(pxLog(Math.log10(Math.max(1, yrs))), pxLin(yrs), m);
  c.save(); c.globalAlpha = a;
  txt(c, 'Time at scale', x0, 128, { font: F(200, 34, 'Inter Tight'), fill: T.ink, track: 4 });
  txt(c, m > .5 ? 'THE SAME EVENTS · LINEAR SCALE' : 'YEARS AGO, LOG SCALE · APPROXIMATE', x0, 150, { font: F(400, 12, 'Space Mono'), fill: T.a1, track: 3 });
  c.strokeStyle = rgba(T.ink, .5); c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yy); c.lineTo(x0 + (x1 - x0) * eio(pin(B, 1)), yy); c.stroke();
  ['NOW', '10', '100', '1K', '10K', '100K', '1M', '10M'].forEach((l, i) => { const x = pxLog(i); c.globalAlpha = a * (1 - m); c.beginPath(); c.moveTo(x, yy - 6); c.lineTo(x, yy + 6); c.stroke(); txt(c, l, x, yy + 26, { font: F(400, 11, 'Space Mono'), fill: T.ink, alpha: .6, align: 'center' }); });
  ['NOW', '2M', '4M', '6M', '8M', '10M'].forEach((l, i) => { const x = pxLin(i * 2e6); c.globalAlpha = a * m; c.beginPath(); c.moveTo(x, yy - 6); c.lineTo(x, yy + 6); c.stroke(); txt(c, l, x, yy + 26, { font: F(400, 11, 'Space Mono'), fill: T.ink, alpha: .6, align: 'center' }); });
  c.globalAlpha = a;
  [30, 52, 74].forEach((r, k) => { c.save(); c.translate(x0, yy); c.rotate(t * (k % 2 ? -.2 : .15)); c.setLineDash([2, 6]); c.strokeStyle = rgba(T.a1, .45 - k * .1); c.beginPath(); c.ellipse(0, 0, r, r * .4, 0, 0, TAU); c.stroke(); c.restore(); });
  const ev = [['Stone tools', 3.3e6, -1], ['Writing', 5e3, 1], ['Printing press', 575, -1], ['The internet', 40, 1], ['AI agents', 2, -1]];
  ev.forEach(([l, yrs, up], k) => { const p = eo(pin(B, .6, 1 + k * .45)); if (p <= 0) return; const x = px(yrs), crowd = m * (k > 0 ? 1 : 0), ty = yy + up * (70 + crowd * k * 16) * p;
    c.strokeStyle = rgba(T.a2, .7); c.beginPath(); c.moveTo(x, yy); c.lineTo(x, ty); c.stroke(); c.fillStyle = k === 4 ? T.a1 : T.a2; c.beginPath(); c.arc(x, yy, 4.5, 0, TAU); c.fill();
    txt(c, l, x + crowd * 14, ty + (up < 0 ? -8 : 18), { font: F(400, 13, 'Inter'), fill: T.ink, align: crowd > .5 ? 'left' : 'center', alpha: p }); });
  hBracket(c, pxLog(0), pxLog(4), yy - 104, '4 OF 5 EVENTS · THE LAST 10,000 YEARS', T.a1, I * (1 - smooth(5.4, 5.8, B.t)), F(400, 12, 'Space Mono'));
  if (late > 0) callout(c, x0, yy + 8, x0 + 230, 470, 'ON A LINEAR SCALE, FOUR EVENTS', 'COLLAPSE INTO THE LAST FEW PIXELS', late, { col: T.a1, bg: 'rgba(0,0,0,.85)', f1: F(400, 13, 'Space Mono'), f2: F(400, 12, 'Space Mono'), ink: T.ink, ink2: T.a1, tr1: 1 });
  c.restore();
};

/* TX-13 · tiles flip, ledger re-sorts */
DATA4['TX-13'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { realm, head, players } = X, sh = players.map(p => p[2]), { rank } = dvRank(sh), I = dvIns(B), CO = dvCallout(B), RK = dvRk(B);
  realm(380, 196, () => 1, (i, j) => clamp((B.t - .3 - (i + j) * .12) / .5));
  txt(c, RK > 0 ? 'SHARE LEDGER · RANKED' : 'SHARE LEDGER · SAMPLE', 700, 160, { font: F(500, 16, 'Cormorant SC'), fill: T.a1, track: 3 });
  c.strokeStyle = rgba(T.a1, .6); c.lineWidth = 1; c.beginPath(); c.moveTo(700, 172); c.lineTo(920, 172); c.stroke();
  players.forEach(([, , v, col, lab], k) => { const y = 210 + lerp(k, rank[k], dvSort(B, rank, k)) * 46, p = eo(pin(B, 1, 1.2 + k * .3)), hot = rank[k] === 0 && I > 0;
    if (hot) { c.save(); c.fillStyle = rgba(T.a1, .12 * I); c.fillRect(694, y - 24, 232, 44); if (lvl < 2) { c.shadowBlur = 12; c.shadowColor = T.a1; } c.strokeStyle = rgba(T.a1, .7 * I); c.strokeRect(694, y - 24, 232, 44); c.restore(); }
    c.fillStyle = col; c.fillRect(700, y - 14, 14, 14); txt(c, lab, 726, y, { font: F(500, 20, 'Cormorant SC'), fill: T.ink });
    txt(c, countTo(v, p) + '%', 920, y, { font: F(400, 24, 'EB Garamond'), fill: T.ink, align: 'right' });
    if (RK > 0) txt(c, ['I', 'II', 'III', 'IV'][rank[k]], 688, y, { font: F(600, 14, 'Cinzel'), fill: T.a1, align: 'right', alpha: RK });
    c.strokeStyle = rgba(T.a1, .25); c.beginPath(); c.moveTo(700, y + 14); c.lineTo(920, y + 14); c.stroke(); c.fillStyle = rgba(col, .65); c.fillRect(700, y + 18, 220 * v / 40 * p, 3); });
  if (RK > 0) { c.strokeStyle = rgba(T.a1, .6 * RK); c.beginPath(); c.moveTo(700, 400); c.lineTo(920, 400); c.stroke(); txt(c, 'TOTAL', 726, 424, { font: F(500, 18, 'Cormorant SC'), fill: T.ink, alpha: RK }); txt(c, '100%', 920, 424, { font: F(400, 24, 'EB Garamond'), fill: T.ink, align: 'right', alpha: RK }); }
  callout(c, 426, 140, 250, 112, 'N°1 HOLDS 34%', 'THREE POINTS AHEAD OF N°3', CO, { col: T.a1, bg: 'rgba(26,23,18,.92)', f1: F(600, 15, 'Cinzel'), f2: F(400, 15, 'EB Garamond'), ink: T.ink, ink2: T.ink, tr1: 2 });
  head('THE TRADE ROUTES', 'S4 · TILES FLIP, THEN THE LEDGER RE-SORTS');
};

/* TX-14 · route timeline, cumulative distance, ledger sorted by evidence */
DATA4['TX-14'] = (s, t, B, X) => {
  const { c } = s, T = s.th.tok, { map } = X, I = dvIns(B), RK = dvRk(B), hiI = I * (1 - smooth(5.3, 5.7, B.t));
  map(1); c.fillStyle = 'rgba(233,220,192,.94)'; c.fillRect(0, 0, 960, 540);
  txt(c, 'ROUTE TIMELINE \u00b7 SAMPLE DATA', 60, 96, { font: F(400, 26, 'Alfa Slab One'), fill: T.ink });
  const x0 = 90, x1 = 870, yy = 150, p = eio(pin(B, 2.2, .3)), rows = [['1', 'Basecamp', 0, 2], ['4', 'The Archive', 212, 5], ['7', 'Field Site', 418, 9], ['10', 'The Vault', 690, 6], ['13', 'Findings', 921, 11]];
  c.save(); c.setLineDash([11, 7]); c.strokeStyle = T.a1; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, yy); c.lineTo(lerp(x0, x1, p), yy); c.stroke(); c.restore();
  if (hiI > 0) { c.save(); c.strokeStyle = rgba(T.a1, .9 * hiI); c.lineWidth = 6; c.beginPath(); c.moveTo(lerp(x0, x1, .5) + 22, yy); c.lineTo(lerp(x0, x1, .75) - 22, yy); c.stroke(); c.restore(); }
  rows.forEach(([d, n], k) => { const x = lerp(x0, x1, k / 4), q = clamp((p - k / 4) / .08); if (q <= 0) return;
    c.save(); c.translate(x, yy); c.scale(lerp(1.5, 1, eo(q)), lerp(1.5, 1, eo(q))); c.fillStyle = 'rgba(244,236,216,.9)'; c.beginPath(); c.arc(0, 0, 20, 0, TAU); c.fill(); c.strokeStyle = T.a1; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 20, 0, TAU); c.stroke(); txt(c, 'D' + d, 0, 5, { font: F(400, 13, 'Special Elite'), fill: T.a1, align: 'center' }); c.restore();
    txt(c, n, x, yy - 30, { font: F(400, 16, 'IM Fell English'), fill: T.ink, align: 'center' }); });
  const cy0 = 290, ch = 56, cx = k => lerp(x0, x1, k / 4), cyv = km => cy0 - km / 921 * ch, cp = pin(B, 1.6, 1.4);
  hBracket(c, cx(2) + 22, cx(3) - 22, yy + 30, '272 KM \u00b7 THE LONGEST LEG', T.a1, hiI, F(400, 13, 'Special Elite'), false);
  if (cp > 0) { const m = cp * 4, e = Math.floor(m);
    c.beginPath(); c.moveTo(cx(0), cy0); c.lineTo(cx(0), cyv(0)); for (let k = 1; k <= e; k++) { c.lineTo(cx(k), cyv(rows[k - 1][2])); c.lineTo(cx(k), cyv(rows[k][2])); } c.lineTo(cx(e), cy0); c.closePath(); c.fillStyle = 'rgba(168,52,28,.14)'; c.fill();
    c.strokeStyle = T.a1; c.lineWidth = 2; c.beginPath(); c.moveTo(cx(0), cyv(0)); for (let k = 1; k <= e; k++) { c.lineTo(cx(k), cyv(rows[k - 1][2])); c.lineTo(cx(k), cyv(rows[k][2])); } c.stroke();
    if (hiI > 0) { c.fillStyle = rgba(T.a1, .25 * hiI); c.fillRect(cx(2), cyv(690), cx(3) - cx(2), cy0 - cyv(690)); }
    txt(c, 'CUMULATIVE KM', x0, cy0 + 18, { font: F(400, 12, 'Special Elite'), fill: T.ink, alpha: .8 }); txt(c, countTo(921, cp) + ' KM', x1, cyv(921) - 8, { font: F(400, 18, 'Libre Caslon Text'), fill: T.a1, align: 'right' }); }
  const ev = rows.map(r => r[3]), { rank } = dvRank(ev), tx = 170, ty = 338;
  ['DAY', 'LEG', 'KM', 'EVIDENCE'].forEach((h, i) => txt(c, h, tx + [0, 90, 330, 470][i], ty, { font: F(400, 13, 'Special Elite'), fill: T.a1, track: 2 }));
  if (RK > 0) txt(c, 'SORTED BY EVIDENCE FOUND', tx + 600, ty - 22, { font: F(400, 12, 'Special Elite'), fill: T.a1, align: 'right', alpha: RK });
  c.strokeStyle = rgba(T.ink, .5); c.lineWidth = 1; c.beginPath(); c.moveTo(tx, ty + 8); c.lineTo(tx + 600, ty + 8); c.stroke();
  rows.forEach(([d, n, km, e], k) => { const y = ty + 30 + lerp(k, rank[k], dvSort(B, rank, k)) * 28, q = eo(pin(B, .7, 1.4 + k * .3)); if (q <= 0) return;
    if ((k === 3 && hiI > 0) || (rank[k] === 0 && RK > 0)) { c.fillStyle = rgba(T.a1, .12 * Math.max(k === 3 ? hiI : 0, rank[k] === 0 ? RK : 0)); c.fillRect(tx - 8, y - 18, 616, 26); }
    [d, n, countTo(km, q), countTo(e, q)].forEach((v, i) => txt(c, String(v), tx + [0, 90, 330, 470][i], y, { font: F(400, 17, 'Libre Caslon Text'), fill: T.ink, alpha: q }));
    c.fillStyle = rgba(T.a1, .55); c.fillRect(tx + 500, y - 9, e * 9 * q, 6);
    if (RK > 0) txt(c, '#' + (rank[k] + 1), tx - 14, y, { font: F(400, 13, 'Special Elite'), fill: T.a1, align: 'right', alpha: RK });
    c.strokeStyle = rgba(T.ink, .12); c.beginPath(); c.moveTo(tx, y + 9); c.lineTo(tx + 600, y + 9); c.stroke(); });
};

/* TX-15 · watercolor plants */
DATA4['TX-15'] = (s, t, B, X) => {
  const { c } = s, T = s.th.tok, { paper } = X, I = dvIns(B), CO = dvCallout(B), RK = dvRk(B), ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
  paper(); txt(c, 'Watercolor chart', 80, 96, { font: F(600, 34, 'Shippori Mincho'), fill: T.ink, track: 2 }); txt(c, RK > 0 ? 'sample data, sorted tallest first' : 'sample data, grown not drawn', 82, 126, { font: F(500, 17, 'Zen Maru Gothic'), fill: T.ink, alpha: .75 });
  const base = 450, cols = ['#6FA65A', '#3E64A0', '#B5762A', '#4F8F48', '#8FC7E8', '#2F6B3F'];
  let mx = 0, my = 0;
  D4.forEach((v, i) => { const x = 170 + DV.slot(B, i) * 115, w = 62, p = eo(pin(B, 1.6, .3 + i * .2)), h = v / 100 * 260 * p, top = base - h, da = DV.dim(B, i), hot = i === DV.maxI;
    c.save(); c.globalAlpha *= da;
    s.st.blob[i].forEach(([dx, dy, r]) => { const g = c.createRadialGradient(x + w / 2 + dx, top + h / 2 + dy, 0, x + w / 2 + dx, top + h / 2 + dy, r * (.5 + p)); g.addColorStop(0, rgba(cols[i], .22)); g.addColorStop(1, rgba(cols[i], 0)); c.fillStyle = g; c.fillRect(x - 60, top - 60, w + 120, h + 120); });
    c.save(); c.beginPath(); c.rect(x, top, w, h); c.clip(); c.strokeStyle = rgba(cols[i], .75); c.lineWidth = 1.6; for (let k = -h; k < w + h; k += 7) { c.beginPath(); c.moveTo(x + k, base + 2); c.lineTo(x + k + h, top - 2); c.stroke(); } c.restore();
    c.strokeStyle = rgba(T.ink, .7); c.lineWidth = 1.4; c.beginPath(); c.moveTo(x + (hash3(i, 1, 1) % 3), base); c.lineTo(x - 1, top + 1); c.lineTo(x + w + 1, top - 1); c.lineTo(x + w - 1, base); c.stroke();
    if (p > .3) { c.fillStyle = T.a1; c.beginPath(); c.ellipse(x + w / 2 - 7, top - 7, 8, 4, -.5, 0, TAU); c.fill(); c.beginPath(); c.ellipse(x + w / 2 + 7, top - 9, 8, 4, .5, 0, TAU); c.fill(); }
    if (hot && I > 0) { const fx = x + w / 2, fy = top - 22; for (let k = 0; k < 6; k++) { const a = k / 6 * TAU + t * .3; c.fillStyle = `rgba(247,168,190,${.9 * I})`; c.beginPath(); c.ellipse(fx + Math.cos(a) * 9 * I, fy + Math.sin(a) * 9 * I, 7 * I, 4 * I, a, 0, TAU); c.fill(); } c.fillStyle = `rgba(242,196,109,${I})`; c.beginPath(); c.arc(fx, fy, 4 * I, 0, TAU); c.fill(); mx = fx + 18; my = fy; }
    if (p > .6) txt(c, String(Math.round(v * p)), x + w / 2, top - (hot && I > 0 ? 44 : 22), { font: F(500, 18, 'Zen Maru Gothic'), fill: T.ink, align: 'center' });
    txt(c, SAMPLE.cats[i], x + w / 2, base + 24, { font: F(500, 14, 'Zen Maru Gothic'), fill: T.ink, align: 'center', alpha: .75 });
    if (RK > 0) txt(c, ORD[DV.rank[i]], x + w / 2, base + 46, { font: F(500, 14, 'Zen Maru Gothic'), fill: T.a1, align: 'center', alpha: RK });
    c.restore(); });
  c.strokeStyle = rgba(T.ink, .5); c.lineWidth = 1; c.beginPath(); c.moveTo(130, base + 1); c.lineTo(860, base + 1); c.stroke();
  const ay = base - DV.avg / 100 * 260, ap = pin(B, 1.1, 3.0); if (ap > 0) { c.strokeStyle = 'rgba(35,54,31,.55)'; c.lineWidth = 1.3; c.beginPath(); for (let x = 130; x <= 130 + 730 * eio(ap); x += 8) { const yv = ay + Math.sin(x * .3) * .8 + ((hash3(x, 2, 2) % 10) - 5) * .12; x === 130 ? c.moveTo(x, yv) : c.lineTo(x, yv); } c.stroke();
    if (ap > .6) txt(c, 'average 68.5', 864, ay + 5, { font: F(500, 14, 'Zen Maru Gothic'), fill: T.ink, alpha: ap }); }
  callout(c, mx, my, mx + 100, my - 44, 'N4 grew tallest', '91, about a third above average', CO, { col: T.a1, bg: 'rgba(247,243,232,.96)', f1: F(600, 17, 'Shippori Mincho'), f2: F(500, 13, 'Zen Maru Gothic'), ink: T.ink, ink2: T.ink, r: 12 });
};

/* TX-16 · cut strips: every move lands on the beat, including the re-sort */
DATA4['TX-16'] = (s, t, B) => {
  const { c, lvl } = s, T = s.th.tok, bt = .469, nb = Math.floor(B.t / bt), qr = clamp((B.t % bt) / (lvl === 2 ? .4 : .14)), qb = lvl === 0 ? stepq(p4(qr), 4) : lvl === 2 ? eio(qr) : p4(qr);
  const snap = k => (nb > k ? 1 : nb === k ? qb : 0), base = 470, cols = [T.a1, T.ink, T.a2, T.a3, T.a1, T.ink], sp = i => snap(12 + DV.rank[i]), tq = snap(10) * (1 - snap(12)), RK = snap(18), sk = s.k || 1;
  txt(c, 'FOUR MOVES, MEASURED', 60, 96, { font: F(400, 54, 'League Gothic'), fill: T.ink, track: 2 });
  txt(c, RK > 0 ? 'RE-CUT ON THE BEAT \u00b7 HIGH TO LOW' : 'SAMPLE DATA \u00b7 STRIPS SNAP IN ON THE BEAT', 62, 122, { font: F(400, 13, 'Courier Prime'), fill: T.ink, alpha: .75 });
  let mx = 0, my = 0;
  D4.forEach((v, i) => { const q = snap(i), h = v / 100 * 280 * q, x = 80 + lerp(i, DV.rank[i], sp(i)) * 74, hot = i === DV.maxI, lift = sp(i) > 0 && sp(i) < 1 ? Math.sin(sp(i) * Math.PI) * 14 : 0; if (h <= 1) return;
    c.save(); c.globalAlpha *= hot ? 1 : 1 - .45 * tq; c.shadowColor = 'rgba(28,28,28,.28)'; c.shadowBlur = 10 + lift; c.shadowOffsetX = (4 + lift * .4) * sk; c.shadowOffsetY = (6 + lift * .6) * sk;
    c.fillStyle = cols[i]; jagRect(c, x, base - h - lift, 54, h, 60 + i); c.fill(); c.restore();
    txt(c, String(v), x + 27, base - h - 10 - lift, { font: F(400, 28, 'League Gothic'), fill: T.ink, align: 'center', alpha: q }); txt(c, SAMPLE.cats[i], x + 27, base + 20, { font: F(400, 12, 'Courier Prime'), fill: T.ink, align: 'center' });
    if (RK > 0) txt(c, '#' + (DV.rank[i] + 1), x + 27, base + 38, { font: F(400, 13, 'Courier Prime'), fill: T.a1, align: 'center', alpha: RK });
    if (hot) { mx = x + 27; my = base - h - 54; } });
  const aq = snap(6); if (aq > 0) { const ay = base - DV.avg / 100 * 280; c.save(); c.shadowColor = 'rgba(28,28,28,.25)'; c.shadowBlur = 6; c.shadowOffsetY = 3 * sk; c.fillStyle = T.ink; jagRect(c, 64, ay - 2, 470 * aq, 4, 91); c.fill(); c.restore(); txt(c, 'AVG 68.5', 540, ay + 5, { font: F(400, 13, 'Courier Prime'), fill: T.ink, alpha: aq }); }
  if (tq > 0) { c.save(); c.translate(mx, my); c.rotate(-.08); c.scale(tq, tq); c.shadowColor = 'rgba(28,28,28,.3)'; c.shadowBlur = 10; c.shadowOffsetX = 4 * sk; c.shadowOffsetY = 6 * sk; c.fillStyle = T.a1; jagPath(c, [[-74, -20], [74, -20], [74, 18], [8, 18], [0, 32], [-8, 18], [-74, 18]], 93); c.fill(); c.restore();
    c.save(); c.translate(mx, my); c.rotate(-.08); c.scale(tq, tq); txt(c, 'TOP MOVE \u00b7 91', 0, 7, { font: F(400, 22, 'League Gothic'), fill: T.bg, align: 'center', track: 2 }); c.restore(); }
  let a0 = -Math.PI / 2; const pc = [T.a1, T.a2, T.ink, T.a3], ex = snap(10);
  SAMPLE.share.forEach((v, i) => { const q = snap(6 + i), a1 = a0 + v / 100 * TAU; if (q > 0) { const mid = (a0 + a1) / 2, eo_ = i === 0 ? 20 * ex : 0, off = 10 * (1 - q) + 6 + eo_, pts = [[0, 0]]; for (let k = 0; k <= 10; k++) { const a = lerp(a0, a1, k / 10); pts.push([Math.cos(a) * 130, Math.sin(a) * 130]); }
      c.save(); c.translate(745 + Math.cos(mid) * off, 300 + Math.sin(mid) * off); c.scale(q, q); c.shadowColor = 'rgba(28,28,28,.3)'; c.shadowBlur = 12 + eo_ * .4; c.shadowOffsetX = (5 + eo_ * .3) * sk; c.shadowOffsetY = (8 + eo_ * .4) * sk; c.fillStyle = pc[i]; jagPath(c, pts, 80 + i, 1.4, 11); c.fill(); c.restore();
      txt(c, v + '%', 745 + Math.cos(mid) * (168 + eo_), 308 + Math.sin(mid) * (168 + eo_), { font: F(400, 26, 'League Gothic'), fill: T.ink, align: 'center', alpha: q }); } a0 = a1; });
  if (ex > 0) txt(c, 'N1 TAKES THE BIGGEST SLICE', 745, 500, { font: F(400, 13, 'Courier Prime'), fill: T.ink, align: 'center', alpha: ex * (1 - RK) });
};

/* TX-17 · gold line: flow, extremes, growth bracket, ledger sort */
DATA4['TX-17'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { fog, goldText, caps } = X, I = dvIns(B), RK = dvRk(B), sh = SAMPLE.share, { rank } = dvRank(sh);
  fog(.35); caps(RK > 0 ? 'THE ASSET · RANKED' : 'THE ASSET · SAMPLE DATA', 90, 92, 1, 13, 'left');
  const x0 = 100, x1 = 620, y0 = 150, y1 = 440, L = SAMPLE.line, n = L.length, px = j => x0 + j / (n - 1) * (x1 - x0), py = v => y1 - v * (y1 - y0), m = eio(pin(B, 2.6, .3)) * (n - 1);
  c.strokeStyle = rgba(T.a1, .25); c.lineWidth = .8; for (let k = 0; k <= 4; k++) { c.beginPath(); c.moveTo(x0, py(k / 4)); c.lineTo(x1, py(k / 4)); c.stroke(); }
  const fj = Math.floor(m), fr = m - fj, P = []; for (let j = 0; j <= fj; j++) P.push([px(j), py(L[j])]); if (fj < n - 1) P.push([lerp(px(fj), px(fj + 1), fr), lerp(py(L[fj]), py(L[fj + 1]), fr)]);
  const ag = c.createLinearGradient(0, y0, 0, y1); ag.addColorStop(0, rgba(T.a1, .25)); ag.addColorStop(1, rgba(T.a1, 0));
  c.beginPath(); c.moveTo(P[0][0], y1); P.forEach(q => c.lineTo(q[0], q[1])); c.lineTo(P[P.length - 1][0], y1); c.closePath(); c.fillStyle = ag; c.fill();
  c.strokeStyle = T.a3; c.lineWidth = 1.4; c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
  for (let j = 0; j <= fj; j++) { c.save(); c.translate(px(j), py(L[j])); c.rotate(Math.PI / 4); c.fillStyle = T.a3; const z = (j === 0 || j === n - 1) && I > 0 ? 5 : 3; c.fillRect(-z, -z, z * 2, z * 2); c.restore(); }
  if (fj === n - 1 && lvl < 2) flowDots(c, P, t, T.a3, 6, .16, 2.2);
  if (I > 0) { txt(c, 'LOW 0.32 · W1', px(0) + 10, py(L[0]) + 26, { font: F(600, 11, 'Josefin Sans'), fill: T.a3, track: 3, alpha: I }); txt(c, 'HIGH 0.86 · W12', px(n - 1) - 6, py(L[n - 1]) - 18, { font: F(600, 11, 'Josefin Sans'), fill: T.a3, track: 3, align: 'right', alpha: I }); }
  vBracket(c, x1 + 22, py(L[0]), py(L[n - 1]), '', T.a1, I, F(500, 28, 'Bodoni Moda'));
  if (I > .7) goldText('+' + Math.round(169 * clamp((I - .7) / .3)) + '%', x1 + 36, (py(L[0]) + py(L[n - 1])) / 2 + 10, 28, 'left');
  if (fj === n - 1) goldText(L[n - 1].toFixed(2), x1, py(L[n - 1]) - 40, 26, 'right');
  sh.forEach((v, k) => { const y = 200 + lerp(k, rank[k], dvSort(B, rank, k)) * 58, q = eo(pin(B, .8, 1 + k * .3)), hot = rank[k] === 0 && I > 0;
    txt(c, `N\u00b0 ${k + 1}`, 770, y, { font: F(500, 22, 'Bodoni Moda'), fill: T.ink, alpha: q }); goldText(countTo(v, q) + '%', 930, y, 28, 'right');
    c.save(); if (hot && lvl < 2) { c.shadowBlur = 12; c.shadowColor = T.a1; } c.fillStyle = rgba(T.a1, hot ? 1 : .8); c.fillRect(770, y + 12, 160 * v / 40 * q, hot ? 2 : 1.2); c.restore();
    if (RK > 0) txt(c, ['I', 'II', 'III', 'IV'][rank[k]], 756, y, { font: F(600, 11, 'Josefin Sans'), fill: T.a3, align: 'right', alpha: RK, track: 2 }); });
};

/* TX-18 · speech bubbles inside each world (called from the panel renderer) */
function dvBubbles(c, k, w, h, B, T, g) {
  const I = dvIns(B) * (1 - smooth(5.3, 5.7, B.t)), RK = dvRk(B); if (I <= 0 && RK <= 0) return;
  const sl = DV.slot(B, DV.maxI);
  let ax, ay; if (k === 0) { ax = 26 + sl * 40 + 14; ay = h - 34 - 91 / 100 * 250 * g; } else if (k === 1) { ax = 140 + sl / 5 * (w - 190); ay = h - 26 - 91 / 100 * (h - 64); } else { ax = 60 + sl * 84 + 23; ay = h - 20 - 91 / 100 * (h - 60) * g; }
  const avgY = k === 0 ? h - 34 - DV.avg / 100 * 250 * g : k === 1 ? h - 26 - DV.avg / 100 * (h - 64) : h - 20 - DV.avg / 100 * (h - 60) * g;
  c.save(); c.setLineDash([8, 5]); c.strokeStyle = k === 1 ? '#fff' : T.ink; c.lineWidth = 2.5; c.globalAlpha = Math.max(I, RK); c.beginPath(); c.moveTo(6, avgY); c.lineTo(w - 6, avgY); c.stroke(); c.restore();
  if (I > 0) { const word = ['N4 WINS!', 'PEAK!', 'REALLY? 91?'][k], bw = tw(c, word, F(400, 22, 'Bangers'), 1) + 26, bx = Math.min(w - bw - 8, Math.max(8, ax - bw / 2)), by = Math.max(8, ay - 70);
    c.save(); c.globalAlpha = I; c.fillStyle = '#fff'; c.strokeStyle = T.ink; c.lineWidth = 3; rr(c, bx, by, bw, 38, 18); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(ax - 8, by + 36); c.lineTo(ax, ay - 8); c.lineTo(ax + 8, by + 36); c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.fillRect(ax - 7, by + 33, 14, 5);
    txt(c, word, bx + bw / 2, by + 27, { font: F(400, 22, 'Bangers'), fill: T.ink, align: 'center', track: 1 }); c.restore(); }
}

/* TX-19 · specimen frames re-sort into a symmetric pyramid */
DATA4['TX-19'] = (s, t, B, X) => {
  const { c, lvl } = s, T = s.th.tok, { fills, person } = X, cnt = s.st.rooms.map(r => r[2]), { rank } = dvRank(cnt), SYM = [2, 1, 3, 0, 4], I = dvIns(B), RK = dvRk(B);
  const sp = k => eioX(clamp((B.t - 5.6 - rank[k] * .12) / .9));
  s.st.rooms.forEach(([num, name, ppl], k) => { const slot = lerp(k, SYM[rank[k]], sp(k)), x = 60 + slot * 172, y = 130, w = 148, h = 300, q = pin(B, .4, .2 + k * .15), top = rank[k] === 0;
    c.save(); c.globalAlpha = q * (top ? 1 : 1 - .35 * I * (1 - smooth(5.3, 5.7, B.t)));
    c.fillStyle = fills[k]; c.fillRect(x, y, w, h); c.strokeStyle = T.ink; c.lineWidth = 2; c.strokeRect(x, y, w, h); c.strokeRect(x + 6, y + 6, w - 12, h - 12);
    if (top && (I > 0 || RK > 0)) { c.strokeStyle = T.a1; c.lineWidth = 3; c.strokeRect(x - 6, y - 6, w + 12, h + 12); }
    txt(c, 'SPECIMEN', x + w / 2, y + 34, { font: F(600, 11, 'Jost'), fill: T.ink, align: 'center', track: 4 }); txt(c, 'No. ' + (k + 1), x + w / 2, y + 52, { font: F(400, 13, 'Courier Prime'), fill: T.ink, align: 'center' });
    const shown = Math.min(ppl, Math.floor(pin(B, 1.8, .8 + k * .2) * (ppl + .99)));
    for (let i = 0; i < shown; i++) person(x + w / 2 + ((i % 3) - 1) * 26, y + 96 + Math.floor(i / 3) * 44, 1.1, lvl === 2 ? 0 : Math.max(0, Math.sin(t * 4 + i + k)) * 1.5);
    txt(c, String(shown), x + w / 2, y + 232, { font: F(600, 44, 'Jost'), fill: T.ink, align: 'center' });
    c.fillStyle = '#FFFDF7'; c.fillRect(x + 14, y + 248, w - 28, 34); c.strokeStyle = T.ink; c.lineWidth = 1; c.strokeRect(x + 14, y + 248, w - 28, 34);
    txt(c, name, x + w / 2, y + 270, { font: F(600, 12, 'Jost'), fill: T.ink, align: 'center', track: 3 });
    if (RK > 0) txt(c, ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH'][rank[k]], x + w / 2, y + 74, { font: F(600, 10, 'Jost'), fill: T.a1, align: 'center', track: 3, alpha: RK });
    c.restore(); });
  const ins = I * (1 - smooth(5.3, 5.7, B.t));
  s.st.over = () => {
    txt(c, 'SPECIMEN INVENTORY', 480, 64, { font: F(600, 28, 'Jost'), fill: T.ink, align: 'center', track: 10 });
    txt(c, RK > 0 ? 'ARRANGED BY HEADCOUNT, BUSIEST AT THE CENTER' : 'SAMPLE DATA · AGENTS PER ROOM', 480, 90, { font: F(400, 13, 'Courier Prime'), fill: T.ink, align: 'center', alpha: .8 });
    if (ins > 0) { c.save(); c.globalAlpha = ins; c.fillStyle = '#FFFDF7'; c.fillRect(300, 448, 360, 40); c.strokeStyle = T.ink; c.lineWidth = 1.5; c.strokeRect(300, 448, 360, 40); c.strokeRect(304, 452, 352, 32);
      txt(c, 'DELIVERY HOLDS THE MOST · 6 AGENTS', 480, 474, { font: F(600, 13, 'Jost'), fill: T.ink, align: 'center', track: 3 }); c.restore(); }
    if (RK > 0) { c.save(); c.globalAlpha = RK; c.fillStyle = T.a1; c.fillRect(330, 452, 300, 32); txt(c, 'TOTAL · 20 AGENTS · SAMPLE', 480, 473, { font: F(600, 13, 'Jost'), fill: '#FFFDF7', align: 'center', track: 4 }); c.restore(); }
  };
};

/* TX-20 · sort, then predicted vs actual with deltas and a match score */
DATA4['TX-20'] = (s, t, B, X) => {
  const { c } = s, T = s.th.tok, { tb, ti } = X, act = SAMPLE.share, pred = [25, 25, 25, 25], delta = act.map((v, i) => v - pred[i]), miss = delta.reduce((a, d, i) => Math.abs(d) > Math.abs(delta[a]) ? i : a, 0), match = 100 - delta.reduce((a, d) => a + Math.abs(d), 0) / 2;
  c.fillStyle = tb; c.fillRect(0, 0, 960, 540);
  const phaseB = smooth(4.0, 4.6, B.t), I = smooth(5.6, 6.0, B.t), K = smooth(7.0, 7.4, B.t);
  txt(c, phaseB > .5 ? 'PREDICTED vs ACTUAL · SAMPLE' : 'SORT INTO 4 BINS · SAMPLE', 60, 64, { font: F(400, 14, 'IBM Plex Mono'), fill: ti, track: 2 });
  txt(c, phaseB > .5 ? 'Your sort, checked against the real distribution.' : 'Drag each number into the bin it belongs to.', 60, 90, { font: F(400, 16, 'Hanken Grotesk'), fill: '#CFE6E0' });
  const gx = 120, gy = 140, cw = 60, chh = 34, bins = [[120, 'A'], [300, 'B'], [480, 'C'], [660, 'D']], pick = s.st.pick, fly = k => clamp((B.t - .9 - k * .2) / .7);
  for (let i = 0; i < 72; i++) { const col = i % 12, row = Math.floor(i / 12), pk = pick.indexOf(i); let x = gx + col * cw, y = gy + row * chh, sc = 1, al = .85 * (1 - phaseB), fc = ti;
    if (pk >= 0) { const f = eio(fly(pk)), [bx] = bins[pk % 4]; al = 1; fc = '#E8FFF9'; sc = 1 + .25 * Math.sin(Math.min(1, B.t / .9) * Math.PI) * (1 - f); x = lerp(x, bx + 70 + (Math.floor(pk / 4) - 1) * 20, f); y = lerp(y, 432, f); if (f >= 1) continue; }
    txt(c, String(s.st.dig[i]), x, y, { font: F(400, 21 * sc, 'IBM Plex Mono'), fill: fc, align: 'center', alpha: al }); }
  const counts = [0, 0, 0, 0]; pick.forEach((_, k) => { if (fly(k) >= 1) counts[k % 4]++; });
  bins.forEach(([x, l], k) => { c.strokeStyle = rgba(ti, .7); c.lineWidth = 1.5; c.strokeRect(x, 410, 140, 60); c.fillStyle = ti; c.fillRect(x, 470 - counts[k] * 18, 140, counts[k] * 18 * .9); txt(c, 'BIN ' + l, x + 70, 494, { font: F(400, 12, 'IBM Plex Mono'), fill: ti, align: 'center', track: 2 }); });
  if (phaseB > 0) { const top = 140, bot = 360, H = v => v / 40 * (bot - top);
    bins.forEach(([x], k) => { const g = eo(clamp((B.t - 4.2 - k * .15) / .9)), hp = H(pred[k]) * g, ha = H(act[k]) * g, hot = k === miss && I > 0;
      c.globalAlpha = phaseB; c.fillStyle = rgba(ti, .3); c.fillRect(x + 22, bot - hp, 40, hp); c.fillStyle = hot ? '#E8FFF9' : ti; c.fillRect(x + 72, bot - ha, 40, ha);
      txt(c, String(pred[k]), x + 42, bot - hp - 8, { font: F(400, 13, 'IBM Plex Mono'), fill: '#CFE6E0', align: 'center', alpha: g }); txt(c, String(act[k]), x + 92, bot - ha - 8, { font: F(400, 13, 'IBM Plex Mono'), fill: '#E8FFF9', align: 'center', alpha: g });
      if (I > 0) { const d = delta[k], chip = (d > 0 ? '+' : '−') + Math.abs(d), cy = bot + 14; c.fillStyle = hot ? '#E8FFF9' : rgba(ti, .2); rr(c, x + 42, cy - 2, 56, 22, 11); c.fill(); txt(c, chip, x + 70, cy + 14, { font: F(400, 13, 'IBM Plex Mono'), fill: hot ? tb : '#E8FFF9', align: 'center', alpha: I }); }
      c.globalAlpha = 1; });
    txt(c, 'PREDICTED', 120, 126, { font: F(400, 11, 'IBM Plex Mono'), fill: '#CFE6E0', alpha: phaseB * .8, track: 2 }); txt(c, 'ACTUAL', 220, 126, { font: F(400, 11, 'IBM Plex Mono'), fill: '#E8FFF9', alpha: phaseB, track: 2 });
    if (I > 0) callout(c, bins[miss][0] + 92, bot - H(act[miss]) - 24, bins[miss][0] + 40, 118, 'BIGGEST MISS · BIN ' + bins[miss][1], (delta[miss] > 0 ? '+' : '−') + Math.abs(delta[miss]) + ' POINTS', I * (1 - smooth(8.9, 9.3, B.t)), { col: '#E8FFF9', bg: 'rgba(14,26,25,.95)', f1: F(400, 13, 'IBM Plex Mono'), f2: F(400, 12, 'IBM Plex Mono'), ink: '#E8FFF9', ink2: ti });
    if (K > 0) { const cx = 860, cy = 150, r = 54; c.strokeStyle = rgba(ti, .2); c.lineWidth = 9; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke(); c.strokeStyle = ti; c.beginPath(); c.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU * match / 100 * K); c.stroke();
      txt(c, Math.round(match * K) + '%', cx, cy + 9, { font: F(500, 26, 'Instrument Sans'), fill: '#E8FFF9', align: 'center' }); txt(c, 'MATCH', cx, cy + r + 26, { font: F(400, 11, 'IBM Plex Mono'), fill: ti, align: 'center', track: 3, alpha: K }); }
  }
};
