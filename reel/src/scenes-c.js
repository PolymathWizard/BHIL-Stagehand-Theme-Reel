/* ── TX-11 WASTELAND CHROME ──────────────────────────────────────────── */
const backOut = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
SCENES['TX-11'] = {
  beats: [['S1', 'Crash-zoom title', 5], ['S2', 'Speed-ramp section slam', 4], ['S4', 'Rival race: gap, then laps', 9.5], ['S1', 'Slow-mo decisive number', 4]],
  init(s) { const R = s.R; s.st.lines = Array.from({ length: 90 }, () => [R() * TAU, R(), .6 + R() * .8]); s.st.dust = Array.from({ length: 80 }, () => [R(), R() < .5 ? -1 : 1, .6 + R() * .8, 1.5 + R() * 2.5]); s.st.tw = 0; },
  draw(s, t, B, dt = 0) {
    const { c, W, H } = s, T = s.th.tok, lvl = Math.min(s.lvl, 1), hy = 300;
    let sf = 1;
    if (B.i === 0) sf = B.t > .25 && B.t < 1.4 ? (lvl === 0 ? .15 : .5) : 1;
    else if (B.i === 1) sf = 1 + 1.2 * pin(B, 2);
    else if (B.i === 2) sf = .6;
    else sf = B.t > .3 && B.t < 2.6 ? (lvl === 0 ? .1 : .4) : 1;
    s.st.tw += dt * sf;
    const tw_ = s.st.tw, spd = lvl === 0 ? 1.4 : .7;
    let shake = [0, 0]; if (lvl === 0 && ((B.i === 1 && B.t > .3 && B.t < .5) || (B.i === 3 && B.t > .05 && B.t < .25))) shake = [(hash3(Math.floor(t * 60), 1, 1) % 9) - 4, (hash3(Math.floor(t * 60), 2, 2) % 9) - 4];
    c.save(); c.translate(shake[0], shake[1]);
    const sky = c.createLinearGradient(0, 0, 0, hy); sky.addColorStop(0, '#0B5C66'); sky.addColorStop(1, T.a2); c.fillStyle = sky; c.fillRect(-10, -10, W + 20, hy + 10);
    const gr = c.createLinearGradient(0, hy, 0, H); gr.addColorStop(0, T.a1); gr.addColorStop(1, '#6E2604'); c.fillStyle = gr; c.fillRect(-10, hy, W + 20, H - hy + 10);
    c.strokeStyle = 'rgba(242,230,208,.32)'; c.lineWidth = 1.2; c.beginPath();
    s.st.lines.forEach(([a, r0, k]) => { const r = (r0 + tw_ * spd * k * .5) % 1, r1 = 30 + r * 620, r2 = r1 + 20 + r * 140 * sf; c.moveTo(480 + Math.cos(a) * r1, hy + Math.sin(a) * r1 * .62); c.lineTo(480 + Math.cos(a) * r2, hy + Math.sin(a) * r2 * .62); });
    c.stroke();
    s.st.dust.forEach(([l0, dir, k, r]) => { const l = (l0 + tw_ * .45 * k) % 1, x = 480 + dir * (60 + l * 520), y = 520 - l * 260 + l * l * 140; c.fillStyle = `rgba(242,211,160,${(1 - l) * .55})`; c.beginPath(); c.arc(x, y, r * (1 + l), 0, TAU); c.fill(); });
    const vg = c.createRadialGradient(480, 290, 200, 480, 290, 620); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,10,10,.85)'); c.fillStyle = vg; c.fillRect(-10, -10, W + 20, H + 20);
    const chrome = (y0, y1) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.46, '#E2E2E2'); g.addColorStop(.52, '#6E6E6E'); g.addColorStop(1, '#D9D9D9'); return g; };
    const slam = (str, size, y, bt, at = 0, track = 3) => {
      let p = clamp((bt - at) / (lvl === 0 ? .25 : .4)); if (lvl === 0) p = stepq(p, 8); if (bt < at) return;
      const sc = lvl === 0 ? 1.3 - .3 * eo(p) : 1.12 - .12 * eo(p), font = F(400, size, 'Anton'), fill = chrome(y - size * .75, y);
      const one = (k, a) => { c.save(); c.translate(480, y); c.scale(k, k); txt(c, str, 0, 0, { font, stroke: '#0A0A0A', lw: 7, align: 'center', track, alpha: a }); txt(c, str, 0, 0, { font, fill, align: 'center', track, alpha: a }); c.restore(); };
      if (lvl === 0 && p < 1) [1.18, 1.1].forEach(k => one(sc * k, .15)); one(sc, 1);
    };
    const gauge = (gx, gy, r, val, label, p) => { c.lineCap = 'butt'; c.strokeStyle = 'rgba(10,10,10,.75)'; c.lineWidth = 12; c.beginPath(); c.arc(gx, gy, r, Math.PI, TAU); c.stroke();
      c.strokeStyle = val > 80 ? '#FF3B1F' : T.a1; c.beginPath(); c.arc(gx, gy, r, Math.PI, Math.PI + Math.PI * val / 100 * clamp(p)); c.stroke();
      for (let k = 0; k <= 10; k++) { const a = Math.PI + Math.PI * k / 10; c.strokeStyle = T.ink; c.lineWidth = k % 5 ? 1 : 2; c.beginPath(); c.moveTo(gx + Math.cos(a) * (r - 18), gy + Math.sin(a) * (r - 18)); c.lineTo(gx + Math.cos(a) * (r - 10), gy + Math.sin(a) * (r - 10)); c.stroke(); }
      const na = Math.PI + Math.PI * val / 100 * backOut(clamp(p)) + (lvl === 0 ? .02 * Math.sin(t * 9) : 0); c.strokeStyle = T.ink; c.lineWidth = 3; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + Math.cos(na) * (r - 8), gy + Math.sin(na) * (r - 8)); c.stroke(); c.fillStyle = T.ink; c.beginPath(); c.arc(gx, gy, 6, 0, TAU); c.fill();
      txt(c, `${label} ${Math.round(val * clamp(p))}%`, gx, gy + 30, { font: F(700, 18, 'Stardos Stencil'), fill: T.ink, align: 'center', track: 2 }); };
    if (B.i === 0) {
      slam('WASTELAND CHROME', 92, 332, B.t);
      txt(c, 'TX-11 · FULL THROTTLE', 480, 372, { font: F(500, 18, 'Barlow Condensed'), fill: T.ink, align: 'center', track: 6, alpha: pin(B, .4, .6) });
      gauge(130, 486, 66, 31, 'FUEL', 1);
    } else if (B.i === 1) {
      slam('THE RACE FOR SHELF SPACE', 70, 318, B.t, .3, 2);
      txt(c, '02 · SECTION SLAM', 480, 366, { font: F(700, 22, 'Stardos Stencil'), fill: T.ink, align: 'center', track: 4, alpha: pin(B, .3, .7) });
      txt(c, 'S2 · SPEED RAMP INTO A CRASH ZOOM', 480, 500, { font: F(500, 16, 'Barlow Condensed'), fill: T.ink, align: 'center', track: 4, alpha: .8 });
    } else if (B.i === 2) {
      DATA4['TX-11'](s, t, B, { gauge });
    } else {
      slam('+14', 230, 380, B.t, .05, 6);
      txt(c, 'RIVAL GAP · SAMPLE', 480, 430, { font: F(700, 24, 'Stardos Stencil'), fill: T.ink, align: 'center', track: 6, alpha: pin(B, .4, .6) });
      if (lvl === 0) for (let k = 0; k < 30; k++) { const l = ((k * .137 + s.st.tw * .3) % 1), x = 480 + Math.cos(k * 2.4) * (80 + l * 360), y = 300 + Math.sin(k * 2.4) * (40 + l * 160); c.fillStyle = `rgba(255,190,90,${(1 - l) * .9})`; c.fillRect(x, y, 3, 3); }
      txt(c, 'S1 · SUDDEN SLOW-MOTION ON THE DECISIVE NUMBER', 480, 500, { font: F(500, 15, 'Barlow Condensed'), fill: T.ink, align: 'center', track: 3, alpha: .8 });
    }
    c.restore();
    if (lvl === 0) grain(c, W, H, .09, t, true);
  }
};

/* ── TX-12 SLIT-SCAN COSMOS ──────────────────────────────────────────── */
SCENES['TX-12'] = {
  beats: [['S1', 'Slit-scan corridor', 7], ['S1', 'Silence as a beat', 2.5], ['S4', 'Log scale, then the linear truth', 9.5], ['S2', 'Lensing ring', 5]],
  init(s) { const R = s.R, T = s.th.tok, cols = [T.a1, T.a2, T.a3, T.ink]; s.st.st = Array.from({ length: 100 }, () => [(R() * 2 - 1) * 1.7, R(), R() < .5 ? -1 : 1, cols[Math.floor(R() * 4)], .5 + R() * 1.4]); s.st.stars = Array.from({ length: 140 }, () => [R() * 960, R() * 540, R()]); s.st.tw = 0; },
  draw(s, t, B, dt = 0) {
    const { c, W, H, lvl } = s, T = s.th.tok, hy = 270;
    s.st.tw += dt * [1, 0, .2, 0][B.i] * (lvl === 0 ? 1 : .5);
    c.fillStyle = T.bg; c.fillRect(0, 0, W, H);
    const lens = (cx, cy, rot, a) => {
      s.st.stars.forEach(([x, y, k]) => { let dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy) || 1; const r2 = r + 5200 / r; c.fillStyle = `rgba(232,225,213,${(.15 + k * .4) * a})`; c.fillRect(cx + dx / r * r2, cy + dy / r * r2, 1.2, 1.2); });
      c.save(); c.globalAlpha = a; c.shadowBlur = 30; c.shadowColor = T.a1;
      const ring = c.createLinearGradient(cx - 210, 0, cx + 210, 0), o = (Math.sin(rot) + 1) / 2; ring.addColorStop(0, rgba(T.a1, .15)); ring.addColorStop(clamp(o * .8 + .1), '#FFE2B8'); ring.addColorStop(1, rgba(T.a1, .15));
      c.strokeStyle = ring; c.lineWidth = 7; c.beginPath(); c.ellipse(cx, cy, 210, 32, 0, 0, TAU); c.stroke();
      c.strokeStyle = rgba(T.a1, .8); c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, 96, Math.PI * 1.04, Math.PI * 1.96); c.stroke(); c.restore();
      c.fillStyle = '#000'; c.beginPath(); c.arc(cx, cy, 72, 0, TAU); c.fill();
      c.save(); c.globalAlpha = a; c.shadowBlur = 24; c.shadowColor = T.a1; c.strokeStyle = '#FFE2B8'; c.lineWidth = 6; c.beginPath(); c.ellipse(cx, cy, 210, 32, 0, Math.PI * .03, Math.PI * .97); c.stroke(); c.restore();
    };
    const corridor = (a) => {
      s.st.stars.forEach(([x, y, k]) => { c.fillStyle = `rgba(232,225,213,${.1 + k * .25})`; c.fillRect(x, y, 1, 1); });
      const pj = (u, z, sg) => [480 + u * 300 / z, hy + sg * 150 / z]; c.save(); c.globalCompositeOperation = 'lighter'; c.globalAlpha = a;
      s.st.st.forEach(([u, z0, sg, col, L]) => { const z = (((z0 - s.st.tw * .055) % 1) + 1) % 1 * 9 + .35, du = .045, P = [pj(u - du, z, sg), pj(u + du, z, sg), pj(u + du, z + L, sg), pj(u - du, z + L, sg)];
        c.fillStyle = rgba(col, clamp(1.4 / z) * .55); c.beginPath(); P.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); });
      c.restore(); const hg = c.createLinearGradient(0, hy - 6, 0, hy + 6); hg.addColorStop(0, 'rgba(0,0,0,0)'); hg.addColorStop(.5, 'rgba(255,255,255,.8)'); hg.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = hg; c.fillRect(440, hy - 6, 80, 12);
    };
    const bands = () => { const bb = c.createLinearGradient(0, 430, 0, H); bb.addColorStop(0, 'rgba(0,0,0,0)'); bb.addColorStop(.35, 'rgba(0,0,0,.92)'); c.fillStyle = bb; c.fillRect(0, 430, W, 110); const tb = c.createLinearGradient(0, 0, 0, 110); tb.addColorStop(0, 'rgba(0,0,0,.92)'); tb.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = tb; c.fillRect(0, 0, W, 110); };
    if (B.i === 0) { if (lvl === 2) lens(480, 262, 0, 1); else corridor(1); bands(); }
    else if (B.i === 1) { if (lvl === 2) lens(480, 262, 0, 1); else corridor(1 - .85 * pin(B, 1.2)); bands();
      txt(c, 'Hold.', 480, 286, { font: F(200, 40, 'Inter Tight'), fill: T.ink, align: 'center', track: 8, alpha: pin(B, .8, .5) * (1 - pout(B, .4)) });
      txt(c, 'SILENCE · 2.5 S', 480, 316, { font: F(400, 11, 'Space Mono'), fill: T.a1, align: 'center', track: 4, alpha: pin(B, .6, 1) * (1 - pout(B, .4)) }); }
    else if (B.i === 2) {
      DATA4['TX-12'](s, t, B, {});
    } else { lens(480, 262, lvl === 2 ? 0 : t * .4, pin(B, 1)); bands(); txt(c, 'HORIZON · SAMPLE', 480, 470, { font: F(400, 11, 'Space Mono'), fill: T.a1, align: 'center', track: 4, alpha: pin(B, .6, .8) }); }
    txt(c, 'SLIT-SCAN COSMOS', 480, 64, { font: F(200, 38, 'Inter Tight'), fill: T.ink, align: 'center', track: 16 });
    txt(c, 'TX-12 · TIME AT SCALE', 480, 90, { font: F(400, 11, 'Space Mono'), fill: T.a1, align: 'center', track: 4 });
  }
};

/* ── TX-13 CLOCKWORK REALM ───────────────────────────────────────────── */
SCENES['TX-13'] = {
  beats: [['S1', 'Mechanisms rise', 7], ['S2', 'Gear-turn transition', 2.5], ['S4', 'Tiles flip, ledger re-sorts', 9.5], ['S5', 'Brass toggles', 3]],
  init(s) { const R = s.R; s.st.tile = Array.from({ length: 54 }, () => R()); },
  draw(s, t, B) {
    const { c, W, H, lvl } = s, T = s.th.tok, step = lvl === 0; s.st.tops = [];
    const bg = c.createRadialGradient(480, 300, 60, 480, 300, 640); bg.addColorStop(0, '#2C251B'); bg.addColorStop(.6, T.bg); bg.addColorStop(1, '#0E0C09'); c.fillStyle = bg; c.fillRect(0, 0, W, H);
    const spin = B.i === 3 ? 1 + 3 * pin(B, 1.5) : 1, rt = lvl === 2 ? t * .2 : t * spin;
    [330, 280, 230].forEach((rx, k) => { const ry = 8 + 42 * Math.abs(Math.cos(rt * .15 + k * .9)); c.strokeStyle = rgba(T.a1, .22); c.lineWidth = 1.4; c.beginPath(); c.ellipse(480, 118, rx, ry, .04 * (k - 1), 0, TAU); c.stroke(); });
    const players = [[2, 1, 34, T.a1, 'N°1'], [6, 1, 22, T.a3, 'N°2'], [3, 4, 31, '#A07B45', 'N°3'], [7, 4, 13, T.a2, 'N°4']];
    const gear = (x, y, r, teeth, ang, fill, sy = 1) => { c.save(); c.translate(x, y); c.scale(1, sy); c.rotate(ang); c.fillStyle = fill; c.beginPath(); for (let g = 0; g < teeth * 2; g++) { const a = g / (teeth * 2) * TAU, rr_ = g % 2 ? r * .82 : r; g ? c.lineTo(Math.cos(a) * rr_, Math.sin(a) * rr_) : c.moveTo(Math.cos(a) * rr_, Math.sin(a) * rr_); } c.closePath(); c.fill(); c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.arc(0, 0, r * .3, 0, TAU); c.fill(); c.restore(); };
    const realm = (ox, oy, riseOf, flipOf) => {
      const iso = (i, j) => [ox + (i - j) * 46, oy + (i + j) * 21], items = [];
      for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) items.push({ i, j, d: i + j });
      items.sort((a, b) => a.d - b.d).forEach(({ i, j }) => {
        const [x, y] = iso(i, j), v = s.st.tile[i * 6 + j]; let fill = rgba(T.ink, .05 + v * .07), sy = 1;
        let owner = -1; players.forEach(([pi, pj], k) => { if (Math.abs(pi - i) + Math.abs(pj - j) <= 1) owner = k; });
        const fp = flipOf ? flipOf(i, j) : (owner >= 0 ? 1 : 0);
        if (flipOf && fp > 0 && fp < 1) sy = Math.abs(Math.cos(Math.PI * fp));
        if (owner >= 0 && fp > .5) fill = rgba(players[owner][3], flipOf ? .42 : .16);
        c.save(); c.translate(x, y); c.scale(1, sy); c.beginPath(); c.moveTo(0, -21); c.lineTo(46, 0); c.lineTo(0, 21); c.lineTo(-46, 0); c.closePath(); c.fillStyle = fill; c.fill(); c.strokeStyle = rgba(T.a1, .28); c.lineWidth = 1; c.stroke(); c.restore();
        const k = players.findIndex(([pi, pj]) => pi === i && pj === j); if (k < 0) return;
        const [, , share, col, lab] = players[k]; let q = riseOf(k); q = step ? stepq(eio(q), 12) : eio(q); const h = share * 3.2 * q, w = 26, d = 12; if (q > .5) s.st.tops.push([x, y - h]);
        c.fillStyle = '#4E3F28'; c.beginPath(); c.moveTo(x, y + d); c.lineTo(x + w, y); c.lineTo(x + w, y - h); c.lineTo(x, y + d - h); c.closePath(); c.fill();
        c.fillStyle = '#6E5A3A'; c.beginPath(); c.moveTo(x, y + d); c.lineTo(x - w, y); c.lineTo(x - w, y - h); c.lineTo(x, y + d - h); c.closePath(); c.fill();
        c.fillStyle = col; c.beginPath(); c.moveTo(x, y - d - h); c.lineTo(x + w, y - h); c.lineTo(x, y + d - h); c.lineTo(x - w, y - h); c.closePath(); c.fill();
        gear(x, y - h, 19, 10, (step ? Math.floor(t * 3) / 12 * TAU : t * .3) + k, 'rgba(26,23,18,.55)', .46);
        txt(c, `${lab} · ${share}%`, x, y - h - 26, { font: F(500, 16, 'Cormorant SC'), fill: T.ink, align: 'center', alpha: .35 + .65 * q });
      });
    };
    const head = (a, b) => { txt(c, a, 480, 66, { font: F(600, 36, 'Cinzel'), fill: T.ink, align: 'center', track: 8 }); txt(c, b, 480, 96, { font: F(500, 16, 'Cormorant SC'), fill: T.a1, align: 'center', track: 3 }); };
    if (B.i === 0) { realm(480, 196, k => pin(B, 1.2, .8 + k * .9), null); head('CLOCKWORK REALM', 'TX-13 · WHO HOLDS WHAT · SAMPLE SHARES'); }
    else if (B.i === 1) {
      const gx = eio(pin(B, 1.6, .1)) * 1500 - 300;
      realm(480, 196, () => 1, null); head('CLOCKWORK REALM', 'TX-13 · WHO HOLDS WHAT · SAMPLE SHARES');
      c.save(); c.beginPath(); c.rect(0, 0, Math.max(0, gx), H); c.clip(); c.fillStyle = T.bg; c.fillRect(0, 0, W, H);
      txt(c, 'CHAPTER II', 480, 220, { font: F(500, 18, 'Cormorant SC'), fill: T.a1, align: 'center', track: 8 }); txt(c, 'THE TRADE ROUTES', 480, 282, { font: F(600, 52, 'Cinzel'), fill: T.ink, align: 'center', track: 6 });
      txt(c, 'Every pass has a keeper; every keeper has a price.', 480, 326, { font: F(400, 22, 'EB Garamond'), fill: T.ink, align: 'center', alpha: .85 }); c.restore();
      gear(gx, 270, 300, 24, step ? Math.floor(t * 4) / 24 * TAU : t * .6, '#6E5A3A'); gear(gx, 270, 120, 12, -(step ? Math.floor(t * 4) / 12 * TAU : t * 1.2), T.a1);
    } else if (B.i === 2) {
      DATA4['TX-13'](s, t, B, { realm, head, players });
    } else {
      realm(480, 196, () => 1 - pout(B, .8), null); head('CLOCKWORK REALM', 'S5 · BRASS TOGGLES');
      [0, 1, 2].forEach(k => { const x = 380 + k * 100, y = 470, on = B.t > .4 + k * .45, a = on ? lerp(-.6, .6, eo(clamp((B.t - .4 - k * .45) / .25))) : -.6;
        c.fillStyle = '#3A3022'; rr(c, x - 30, y - 20, 60, 40, 8); c.fill(); c.strokeStyle = T.a1; c.lineWidth = 1.5; rr(c, x - 30, y - 20, 60, 40, 8); c.stroke();
        c.save(); c.translate(x, y); c.rotate(a); c.fillStyle = T.a1; c.fillRect(-3, -30, 6, 30); c.beginPath(); c.arc(0, -30, 7, 0, TAU); c.fill(); c.restore();
        const lg = c.createRadialGradient(x, y - 44, 0, x, y - 44, 14); lg.addColorStop(0, on ? '#FFE6A8' : 'rgba(201,164,100,.15)'); lg.addColorStop(1, 'rgba(201,164,100,0)'); c.fillStyle = lg; c.fillRect(x - 14, y - 58, 28, 28); });
    }
    grain(c, W, H, .06, t, false);
  }
};

/* ── TX-14 RED-LINE EXPEDITION ───────────────────────────────────────── */
SCENES['TX-14'] = {
  beats: [['S1', 'Route inks across the map', 9], ['S2', 'Journal page', 4.5], ['S4', 'Route: longest leg, ranked finds', 9.5]],
  init(s) {
    const R = s.R;
    s.st.land = [[230, 300, 120], [560, 220, 140], [790, 380, 110]].map(([x, y, r]) => { const a = R() * 9, b = R() * 9; return Array.from({ length: 64 }, (_, k) => { const th = k / 64 * TAU, rr_ = r * (1 + .2 * Math.sin(3 * th + a) + .12 * Math.sin(7 * th + b)); return [x + Math.cos(th) * rr_ * 1.3, y + Math.sin(th) * rr_ * .8]; }); });
    s.st.stops = [[120, 392, 'Basecamp'], [290, 214, 'The Archive'], [470, 338, 'Field Site'], [650, 168, 'The Vault'], [834, 302, 'Findings']];
    const P = s.st.stops, pts = [];
    for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let k = 0; k < 40; k++) { const u = k / 40, u2 = u * u, u3 = u2 * u; pts.push([0, 1].map(d => .5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * u + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * u2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * u3))); } }
    pts.push([P[P.length - 1][0], P[P.length - 1][1]]); s.st.route = pts; s.st.L = polyLen(pts);
    s.st.sf = P.map(([x, y]) => { let best = 0, bd = 1e9; pts.forEach((q, i) => { const d = Math.hypot(q[0] - x, q[1] - y); if (d < bd) { bd = d; best = i; } }); return s.st.L[best] / s.st.L[s.st.L.length - 1]; });
    s.st.waves = Array.from({ length: 22 }, () => [R() * 960, R() * 540]);
  },
  draw(s, t, B) {
    const { c, W, H } = s, T = s.th.tok, lvl = Math.min(s.lvl, 1);
    const map = (fr) => { s.st.headPos = null;
      c.fillStyle = T.bg; c.fillRect(0, 0, W, H); grain(c, W, H, .16, t, false);
      if (lvl === 0) [[180, 120, 90], [760, 460, 120], [600, 90, 60]].forEach(([x, y, r]) => { const g = c.createRadialGradient(x, y, r * .6, x, y, r); g.addColorStop(0, 'rgba(110,80,40,0)'); g.addColorStop(.85, 'rgba(110,80,40,.09)'); g.addColorStop(1, 'rgba(110,80,40,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); });
      c.strokeStyle = rgba(T.ink, .12); c.lineWidth = 1; for (let i = 0; i < 8; i++) { const x = 60 + i * 120; c.beginPath(); c.moveTo(x, 0); c.quadraticCurveTo(x + 30, 270, x, 540); c.stroke(); } for (let j = 0; j < 5; j++) { const y = 60 + j * 105; c.beginPath(); c.moveTo(0, y); c.quadraticCurveTo(480, y - 24, 960, y); c.stroke(); }
      c.strokeStyle = rgba(T.ink, .25); s.st.waves.forEach(([x, y]) => { c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 5, y - 4, x + 10, y); c.quadraticCurveTo(x + 15, y + 4, x + 20, y); c.stroke(); });
      s.st.land.forEach(pts => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = 'rgba(201,168,106,.38)'; c.fill(); c.strokeStyle = rgba(T.ink, .45); c.lineWidth = 1.2; c.stroke(); });
      c.fillStyle = 'rgba(255,255,255,.22)'; c.fillRect(480, 0, 1, H); c.fillStyle = 'rgba(60,40,20,.12)'; c.fillRect(481, 0, 1, H); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(0, 270, W, 1);
      const R = s.st.route, L = s.st.L, tot = L[L.length - 1], dl = fr * tot;
      c.save(); c.setLineDash([11, 7]); c.strokeStyle = T.a1; c.lineWidth = 3; c.lineCap = 'round'; c.beginPath(); for (let i = 0; i < R.length && L[i] <= dl; i++) i ? c.lineTo(R[i][0], R[i][1]) : c.moveTo(R[i][0], R[i][1]); if (fr < 1 && dl > 0) { const h = polyAt(R, L, dl); c.lineTo(h[0], h[1]); } c.save(); c.setLineDash([]); c.strokeStyle = 'rgba(168,52,28,.13)'; c.lineWidth = 10; c.stroke(); c.restore(); c.stroke(); c.restore();
      s.st.stops.forEach(([x, y, name], k) => { c.fillStyle = T.ink; c.beginPath(); c.arc(x, y, 4, 0, TAU); c.fill(); txt(c, name, x + 10, y - 10, { font: F(400, 19, 'IM Fell English'), fill: T.ink });
        const q = clamp((fr - s.st.sf[k]) / .04); if (q > 0) { c.save(); c.translate(x - 4, y + 34); c.rotate(((k * 37) % 10 - 5) / 30); const sc = lerp(1.5, 1, eo(q)); c.scale(sc, sc); c.globalAlpha = q * .85;
          if (lvl === 0) { c.fillStyle = 'rgba(168,52,28,.12)'; c.beginPath(); c.arc(3, 2, 25, 0, TAU); c.fill(); }
          c.strokeStyle = T.a1; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 22, 0, TAU); c.stroke(); c.beginPath(); c.arc(0, 0, 17, 0, TAU); c.stroke(); txt(c, 'DAY ' + (k * 3 + 1), 0, 4, { font: F(400, 11, 'Special Elite'), fill: T.a1, align: 'center' }); c.restore(); } });
      if (fr > 0 && fr < 1) { const [hx, hy, ang] = polyAt(R, L, dl); s.st.headPos = [hx, hy]; [[8, 10, 'rgba(46,35,24,.18)'], [0, 0, T.a3]].forEach(([ox, oy, col]) => { c.save(); c.translate(hx + ox, hy + oy); c.rotate(ang); c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 13, 3, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(3, 0); c.lineTo(-3, -12); c.lineTo(-7, -12); c.lineTo(-3, 0); c.lineTo(-7, 12); c.lineTo(-3, 12); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-9, 0); c.lineTo(-13, -5); c.lineTo(-13, 5); c.closePath(); c.fill(); c.restore(); }); }
      const cx = 880, cy = 470; c.strokeStyle = rgba(T.ink, .55); c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, 34, 0, TAU); c.stroke();
      [['N', 0, -44], ['S', 0, 52], ['E', 46, 4], ['W', -46, 4]].forEach(([l, dx, dy]) => txt(c, l, cx + dx, cy + dy, { font: F(400, 13, 'IM Fell English'), fill: T.ink, align: 'center' }));
      c.save(); c.translate(cx, cy); c.rotate(Math.sin(t * .9) * .15); c.fillStyle = T.a1; c.beginPath(); c.moveTo(0, -28); c.lineTo(5, 0); c.lineTo(-5, 0); c.closePath(); c.fill(); c.fillStyle = T.ink; c.beginPath(); c.moveTo(0, 28); c.lineTo(5, 0); c.lineTo(-5, 0); c.closePath(); c.fill(); c.restore();
      txt(c, 'RED-LINE EXPEDITION', 40, 64, { font: F(400, 34, 'Alfa Slab One'), fill: T.ink, track: 1 });
      txt(c, 'Field note 07: the route bends where the evidence does.', 42, 94, { font: F(400, 15, 'Special Elite'), fill: T.ink, alpha: .85 });
    };
    if (B.i !== 0) { s.st.cam = null; s.st.camS = null; }
    if (B.i === 0) { map(pin(B, 7.5, .5)); const hp = s.st.headPos, zr = lvl === 0 ? 1 + .2 * eio(pin(B, 1.4, .3)) * (1 - eio(pout(B, 1.4))) : 1;
      if (zr > 1.001) { const tgt = hp || (s.st.camS || [480, 270]), pc = s.st.camS || [480, 270], cx = lerp(pc[0], tgt[0], .08), cy = lerp(pc[1], tgt[1], .08); s.st.camS = [cx, cy]; s.st.cam = { cx: clamp(cx, 480 / zr, 960 - 480 / zr), cy: clamp(cy, 270 / zr, 540 - 270 / zr), z: zr }; } else { s.st.cam = null; s.st.camS = null; } }
    else if (B.i === 1) {
      map(1); const sl = eio(pin(B, .8)) * (1 - eio(pout(B, .6))), px = lerp(980, 470, sl);
      c.save(); c.translate(px, 70); c.rotate(.03);
      c.fillStyle = 'rgba(46,35,24,.25)'; c.fillRect(8, 10, 440, 420); c.fillStyle = '#F4ECD8'; c.fillRect(0, 0, 440, 420);
      c.strokeStyle = 'rgba(62,100,160,.18)'; c.lineWidth = 1; for (let y = 60; y < 410; y += 26) { c.beginPath(); c.moveTo(20, y); c.lineTo(420, y); c.stroke(); } c.strokeStyle = 'rgba(168,52,28,.3)'; c.beginPath(); c.moveTo(48, 0); c.lineTo(48, 420); c.stroke();
      txt(c, 'DAY 7 · FIELD SITE', 64, 44, { font: F(400, 18, 'Special Elite'), fill: T.ink });
      c.save(); c.translate(220, 72); c.rotate(-.05); c.fillStyle = '#fff'; c.fillRect(0, 0, 190, 170); const sky = c.createLinearGradient(0, 10, 0, 130); sky.addColorStop(0, '#C9B48A'); sky.addColorStop(1, '#8C7A58'); c.fillStyle = sky; c.fillRect(10, 10, 170, 120);
      c.fillStyle = '#5A4A33'; c.beginPath(); c.moveTo(10, 130); c.lineTo(60, 70); c.lineTo(95, 105); c.lineTo(130, 60); c.lineTo(180, 130); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,240,200,.8)'; c.beginPath(); c.arc(140, 40, 12, 0, TAU); c.fill();
      txt(c, 'the ridge, day 7', 95, 156, { font: F(400, 13, 'Special Elite'), fill: T.ink, align: 'center' });
      c.fillStyle = 'rgba(46,35,24,.55)'; [[0, 0], [190, 0], [0, 170], [190, 170]].forEach(([x, y]) => { c.beginPath(); c.moveTo(x + (x ? -14 : 14), y); c.lineTo(x, y); c.lineTo(x, y + (y ? -14 : 14)); c.closePath(); c.fill(); }); c.restore();
      c.strokeStyle = '#8A8A8A'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(380, -10); c.lineTo(380, 40); c.arc(388, 40, 8, Math.PI, 0, true); c.lineTo(396, 0); c.stroke();
      const notes = ['Found the second ledger under', 'the floorboards. Same hand as', 'the Archive copy. Dates match', 'within a week. Sample note.'];
      let budget = Math.floor(clamp(B.t - .9) * 0 + Math.max(0, B.t - .9) * 40);
      notes.forEach((l, k) => { if (budget <= 0) return; const sh = l.slice(0, budget); budget -= l.length; txt(c, sh, 64, 278 + k * 26, { font: F(400, 15, 'Special Elite'), fill: T.ink }); });
      c.restore();
    } else {
      DATA4['TX-14'](s, t, B, { map });
    }
    vignette(c, W, H, .35, '60,40,20');
    if (lvl === 0) { c.fillStyle = `rgba(40,25,10,${.03 * (.5 + .5 * Math.sin(t * TAU * 1.6))})`; c.fillRect(0, 0, W, H); }
  }
};

/* ── TX-15 PAINTED WIND ──────────────────────────────────────────────── */
SCENES['TX-15'] = {
  beats: [['S1', 'Wind through the grass', 7], ['S2', 'Soft fade, then a held pause', 3], ['S4', 'Watercolor: tallest blooms, re-sort', 9.5], ['S5', 'Seeds and a soft button', 3]],
  init(s) {
    const R = s.R;
    s.st.clouds = Array.from({ length: 4 }, () => ({ x: R() * 1200, y: 70 + R() * 130, v: 5 + R() * 7, s: .7 + R() * .6, puffs: Array.from({ length: 8 }, () => [(R() - .5) * 180, (R() - .5) * 40, 34 + R() * 40]) }));
    const hill = (x, b, a, f, ph) => b - a * Math.sin(x * f + ph) - a * .4 * Math.sin(x * f * 2.3 + ph * 2);
    s.st.hills = [[330, 26, .006, R() * 9, '#9CC487'], [384, 30, .005, R() * 9, '#5E9A4E'], [446, 26, .0042, R() * 9, '#2F5D3A']]; s.st.hill = hill;
    s.st.blades = Array.from({ length: 360 }, () => { const k = R() < .4 ? 1 : 2, x = R() * 980 - 10; const [b, a, f, ph] = s.st.hills[k]; return [x, hill(x, b, a, f, ph) + R() * 40 * (k === 2 ? 2.2 : 1), 16 + R() * (k === 2 ? 34 : 18), ['#3E7A3F', '#4F8F48', '#6FA65A', '#2F5D3A', '#86B86A'][Math.floor(R() * 5)], R() * TAU]; }).sort((a, b) => a[1] - b[1]);
    s.st.seeds = Array.from({ length: 34 }, () => [R() * 960, 150 + R() * 300, R() * TAU, .6 + R()]);
    s.st.leaves = Array.from({ length: 70 }, () => [(R() - .5) * 110, (R() - .5) * 70, 6 + R() * 8, R() * TAU]);
    s.st.blob = Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => [(R() - .5) * 50, (R() - .5) * 40, 30 + R() * 30]));
  },
  draw(s, t, B) {
    const { c, W, H } = s, T = s.th.tok, lvl = Math.min(s.lvl, 1);
    const land = (gustOn, seedsN) => {
      const sky = c.createLinearGradient(0, 0, 0, 360); sky.addColorStop(0, '#8FC7E8'); sky.addColorStop(.6, '#CFE5EE'); sky.addColorStop(.88, '#F7E7C4'); sky.addColorStop(1, '#F2C46D'); c.fillStyle = sky; c.fillRect(0, 0, W, H);
      s.st.clouds.forEach(cl => { const cx = ((cl.x + t * cl.v) % 1400) - 220;
        cl.puffs.forEach(([dx, dy, r]) => { const x = cx + dx * cl.s, y = cl.y + dy * cl.s + r * .25, g = c.createRadialGradient(x, y, 0, x, y, r * cl.s * 1.1); g.addColorStop(0, 'rgba(150,170,195,.22)'); g.addColorStop(1, 'rgba(150,170,195,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * cl.s * 1.1, 0, TAU); c.fill(); });
        cl.puffs.forEach(([dx, dy, r]) => { const x = cx + dx * cl.s, y = cl.y + dy * cl.s, g = c.createRadialGradient(x, y, 0, x, y, r * cl.s); g.addColorStop(0, 'rgba(255,255,255,.96)'); g.addColorStop(.7, 'rgba(255,255,255,.75)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * cl.s, 0, TAU); c.fill(); }); });
      for (let k = 0; k < 4; k++) { const bx = ((k * 180 + t * 22) % 1200) - 120, by = 150 + k * 18 + Math.sin(t + k) * 6, f = Math.sin(t * 6 + k) * 4; c.strokeStyle = 'rgba(40,55,40,.6)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(bx - 7, by - f); c.quadraticCurveTo(bx - 3, by - 3, bx, by); c.quadraticCurveTo(bx + 3, by - 3, bx + 7, by - f); c.stroke(); }
      s.st.hills.forEach(([b, a, f, ph, col]) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, H); for (let x = 0; x <= W; x += 8) c.lineTo(x, s.st.hill(x, b, a, f, ph)); c.lineTo(W, H); c.closePath(); c.fill(); });
      const tx = 700, ty = s.st.hill(700, ...s.st.hills[1].slice(0, 4)); c.strokeStyle = '#3D2E1E'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(tx, ty + 6); c.quadraticCurveTo(tx + 6, ty - 50, tx - 4, ty - 96); c.stroke(); c.lineCap = 'butt';
      const cyc = t % 9, gx = cyc / 6 * 1400 - 220, gust = gustOn && cyc < 6 ? 1 : 0;
      s.st.leaves.forEach(([dx, dy, r, ph]) => { const sw = Math.sin(t * 1.5 + ph) * 3 + gust * 6 * Math.exp(-((tx - gx) ** 2) / (2 * 140 * 140)); c.fillStyle = ['#3E7A3F', '#4F8F48', '#6FA65A'][Math.floor(ph) % 3]; c.beginPath(); c.arc(tx + dx + sw, ty - 120 + dy, r, 0, TAU); c.fill(); });
      c.lineCap = 'round';
      s.st.blades.forEach(([x, b, h, col, ph]) => { const bend = .14 * Math.sin(t * 1.3 + x * .02 + ph) * (lvl === 0 ? 1 : .6) + gust * .95 * Math.exp(-((x - gx) ** 2) / (2 * 120 * 120)); c.strokeStyle = col; c.lineWidth = 1.7; c.beginPath(); c.moveTo(x, b); c.quadraticCurveTo(x + bend * h * .45, b - h * .6, x + bend * h, b - h * Math.cos(bend * .7)); c.stroke(); if (ph > 2.6) { const tx2 = x + bend * h, ty2 = b - h * Math.cos(bend * .7); c.strokeStyle = 'rgba(255,226,150,.6)'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(lerp(x + bend * h * .45, tx2, .45), lerp(b - h * .6, ty2, .45)); c.lineTo(tx2, ty2); c.stroke(); } });
      c.lineCap = 'butt';
      for (let k = 0; k < seedsN; k++) { const [x0, y0, ph, r] = s.st.seeds[k], x = (x0 + t * 34) % W, y = y0 + Math.sin(t + ph) * 12; c.fillStyle = 'rgba(255,255,255,.88)'; c.beginPath(); c.arc(x, y, r * 1.6, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = .8; for (let q = 0; q < 5; q++) { const a = q / 5 * TAU + t; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 5, y + Math.sin(a) * 5); c.stroke(); } }
      grain(c, W, H, .05, t, false);
    };
    const paper = () => { c.fillStyle = T.bg; c.fillRect(0, 0, W, H); grain(c, W, H, .08, t, false); };
    if (B.i === 0) { land(true, lvl === 0 ? 14 : 0); txt(c, 'PAINTED WIND', 60, 92, { font: F(600, 50, 'Shippori Mincho'), fill: T.ink, track: 4 }); txt(c, 'TX-15 · wind moves through the story', 62, 128, { font: F(500, 18, 'Zen Maru Gothic'), fill: T.ink, alpha: .82 }); }
    else if (B.i === 1) { land(false, 0); const a = pin(B, 1.1); c.save(); c.globalAlpha = a; paper(); c.restore();
      txt(c, 'Pause here.', 480, 262, { font: F(600, 46, 'Shippori Mincho'), fill: T.ink, align: 'center', track: 3, alpha: pin(B, .8, 1) });
      txt(c, 'Let the reader breathe before the numbers.', 480, 304, { font: F(500, 20, 'Zen Maru Gothic'), fill: T.ink, align: 'center', alpha: .8 * pin(B, .8, 1.4) }); }
    else if (B.i === 2) {
      DATA4['TX-15'](s, t, B, { paper });
    } else {
      land(true, lvl === 0 ? 34 : 0);
      const bx = 380, by = 230, bw = 200, bh = 56, cp = pin(B, .9), hov = B.t > .9, lift = hov ? eo(clamp((B.t - .9) / .4)) * 4 : 0;
      c.fillStyle = `rgba(35,54,31,${.12 + lift * .03})`; rr(c, bx, by + 6, bw, bh, 28); c.fill();
      c.fillStyle = '#F7F3E8'; rr(c, bx, by - lift, bw, bh, 28); c.fill(); c.strokeStyle = rgba(T.a1, .6); c.lineWidth = 1.5; rr(c, bx, by - lift, bw, bh, 28); c.stroke();
      txt(c, 'Read the story', 480, by + 36 - lift, { font: F(500, 20, 'Zen Maru Gothic'), fill: T.ink, align: 'center' });
      const [mx, my] = glide([760, 460], [530, 262], cp); cursor(c, mx, my, B.t > 1.8 && B.t < 2);
    }
  }
};
