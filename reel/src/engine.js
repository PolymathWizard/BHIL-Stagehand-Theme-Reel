/* ── Reel engine v3: scene → afterglow → bloom → post → beat transition ── */
(() => {
  const FINE = matchMedia('(hover: hover) and (pointer: fine)');
  const FILTER_OK = typeof CanvasRenderingContext2D !== 'undefined' && 'filter' in CanvasRenderingContext2D.prototype;
  const state = { level: 0, playing: true, fam: 'all' };   // plays by default for every viewer; Pause stays available
  const NAMES = ['Full', 'Tempered', 'Boardroom'];
  const byId = Object.fromEntries(THEMES.map(t => [t.id, t]));
  const stages = [];
  const eff = th => (state.level < 2 ? state.level : (th.b2b === 'temp' || th.b2b === 'avoid') ? 1 : 2);
  const off = (s, key, w, h) => { let o = s[key]; if (!o) o = s[key] = document.createElement('canvas'); if (o.width !== w || o.height !== h) { o.width = w; o.height = h; } return o; };

  function size(s) {
    const r = s.cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(2, Math.min(1600, Math.round(r.width * dpr * (s.q || 1)))), h = Math.round(w * 9 / 16);
    if (s.cv.width !== w || s.cv.height !== h) { s.cv.width = w; s.cv.height = h; s.prevOk = false; }
    s.k = w / 960;
  }
  function beatOf(s) {
    const tc = ((s.t % s.total) + s.total) % s.total; let acc = 0;
    for (let i = 0; i < s.scene.beats.length; i++) {
      const d = s.scene.beats[i][2];
      if (tc < acc + d || i === s.scene.beats.length - 1) return { i, t: tc - acc, d, p: clamp((tc - acc) / d), n: s.scene.beats.length, tc, start: acc };
      acc += d;
    }
  }
  function camera(s, B, P) {
    const C = P.cam || {}, L = s.lvl, k = [1, .7, .4][L], dir = B.i % 2 ? 1 : -1;
    let x = 0, y = 0, z = 1, r = 0;
    if (C.z) z = 1 + C.z * k * (.2 + .8 * eio(B.p));
    if (C.pan) x = C.pan * k * (B.p - .5) * dir;
    if (C.rot) r = C.rot * k * (B.p - .5) * dir * Math.PI / 180;
    if (C.shake && L === 0) { const tt = s.t; x += (Math.sin(tt * 13.1) + Math.sin(tt * 7.3)) * C.shake; y += (Math.cos(tt * 11.7) + Math.sin(tt * 5.9)) * C.shake; }
    if (C.weave && L < 2) y += ((hash3(Math.floor(s.t * 24), 5, 5) % 100) / 100 - .5) * C.weave;
    if (C.beat && L < 2) { const bp = (s.t % C.beat) / C.beat; z *= 1 + .014 * k * Math.pow(1 - bp, 3); }
    const o = s.st.cam, f = !o && typeof stageFocus === 'function' ? stageFocus(s, B) : null;
    s.focus = f;
    if (f) {
      const m = stageCamera(f, B, k, L); x = m.x; y = m.y; z = m.z; r = 0;
      if (C.shake && L === 0) { const tt = s.t; x += (Math.sin(tt * 13.1) + Math.sin(tt * 7.3)) * C.shake; y += (Math.cos(tt * 11.7) + Math.sin(tt * 5.9)) * C.shake; }
      if (C.weave && L < 2) y += ((hash3(Math.floor(s.t * 24), 5, 5) % 100) / 100 - .5) * C.weave;
      if (C.beat && L < 2) { const bp = (s.t % C.beat) / C.beat; z *= 1 + .014 * k * Math.pow(1 - bp, 3); }
      z = Math.max(z, 1 + Math.abs(x) / 478, 1 + Math.abs(y) / 268);
      return { x, y, z, r };
    }
    if (o) { z *= o.z; x += -(o.cx - 480) * o.z; y += -(o.cy - 270) * o.z; return { x, y, z, r }; }
    z = Math.max(z, 1 + Math.abs(x) / 470 + Math.abs(y) / 265 + Math.abs(r) * 1.3);
    return { x, y, z, r };
  }
  function bloom(s, amt, thresh) {
    const cv = s.cv, w = cv.width, h = cv.height;
    const a = off(s, 'bA', Math.max(2, Math.round(w / 4)), Math.max(2, Math.round(h / 4))), b = off(s, 'bB', Math.max(2, Math.round(w / 12)), Math.max(2, Math.round(h / 12)));
    const ac = a.getContext('2d'), bc = b.getContext('2d');
    ac.imageSmoothingQuality = 'high'; ac.globalCompositeOperation = 'copy';
    ac.filter = FILTER_OK ? (thresh ? 'blur(1.5px) brightness(.85) contrast(2.6) saturate(1.35)' : 'blur(1.5px)') : 'none';
    ac.drawImage(cv, 0, 0, a.width, a.height); ac.filter = 'none';
    bc.imageSmoothingQuality = 'high'; bc.globalCompositeOperation = 'copy'; bc.drawImage(a, 0, 0, b.width, b.height);
    const c = s.c, m = FILTER_OK ? 1 : .6;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter'; c.imageSmoothingQuality = 'high';
    c.globalAlpha = clamp(amt * .55 * m); c.drawImage(a, 0, 0, w, h);
    c.globalAlpha = clamp(amt * .9 * m); c.drawImage(b, 0, 0, w, h);
    c.restore();
  }
  const CALM = { fade: 1, slow: 1, soft: 1, iris: 1, page: 1, whip: 1, paper: 1, sand: 1, glass: 1, focus: 1, cut: 1 };
  function transition(s, style, p) {
    const c = s.c, sn = s.snap, W = 960, H = 540, k = s.k, T = s.th.tok;
    c.save(); c.setTransform(k, 0, 0, k, 0, 0); c.globalCompositeOperation = 'source-over';
    const full = (a = 1) => { c.globalAlpha = a; c.drawImage(sn, 0, 0, W, H); c.globalAlpha = 1; };
    switch (style) {
      case 'fade': case 'soft': case 'slow': full(1 - eio(p)); break;
      case 'shards': {
        c.beginPath(); for (let i = 0; i < 60; i++) for (let j = 0; j < 34; j++) if ((hash3(i, j, 11) % 1000) / 1000 >= p) c.rect(i * 16, j * 16, 16.5, 16.5);
        c.save(); c.clip(); full(); c.restore();
        c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 60; i++) for (let j = 0; j < 34; j++) { const r = (hash3(i, j, 11) % 1000) / 1000, d = p - r; if (d > 0 && d < .12) { c.fillStyle = rgba(T.a1, (1 - d / .12) * .8); c.fillRect(i * 16 + 4, j * 16 + 4 - d * 300, 8, 8); } }
        break; }
      case 'rain': for (let x = 0; x < W; x += 24) { const sp = .6 + (hash3(x, 3, 7) % 100) / 100, dy = Math.pow(p, 1.6) * 620 * sp; c.globalAlpha = 1 - clamp(p * 1.3 * sp); c.drawImage(sn, x * k, 0, 24 * k, sn.height, x, dy, 24, H); } c.globalAlpha = 1; break;
      case 'glass': { const z = 1 + .12 * eio(p); c.translate(480, 270); c.scale(z, z); c.translate(-480, -270); c.globalCompositeOperation = 'screen'; full((1 - p) * .9); break; }
      case 'focus': { const sm = off(s, 'tBlur', Math.max(2, Math.round(sn.width / 10)), Math.max(2, Math.round(sn.height / 10))); if (!s.tBlurDone) { const g = sm.getContext('2d'); g.imageSmoothingQuality = 'high'; g.globalCompositeOperation = 'copy'; g.drawImage(sn, 0, 0, sm.width, sm.height); s.tBlurDone = true; }
        c.imageSmoothingQuality = 'high'; c.globalAlpha = 1 - eio(p); c.drawImage(sm, 0, 0, W, H); c.globalAlpha = Math.pow(1 - p, 4); c.drawImage(sn, 0, 0, W, H); break; }
      case 'channel': case 'vhs': {
        if (p < .55) { full(1 - p * .6); for (let i = 0; i < 9; i++) { const y = (hash3(i, Math.floor(s.t * 30), 3) % 540); sliceShift(c, s, y, 14 + (i % 3) * 10, ((hash3(i, 7, Math.floor(s.t * 30)) % 60) - 30) * (1 - p)); } }
        noiseBand(c, (p * 900) % H, style === 'vhs' ? 60 : 30, s.t, .35 * (1 - p));
        if (style === 'channel' && p < .2) { for (let y = 0; y < H; y += 8) for (let x = 0; x < W; x += 16) { const v = hash3(x, y, Math.floor(s.t * 40)) % 255; c.fillStyle = `rgba(${v},${v},${v},${.85 * (1 - p / .2)})`; c.fillRect(x, y, 16, 8); } }
        break; }
      case 'streak': { const sx = 1 + 1.8 * eio(p); c.translate(480, 270); c.scale(sx, 1 - .2 * p); c.translate(-480, -270); c.globalCompositeOperation = 'lighter'; full((1 - p) * .9); break; }
      case 'crt': {
        c.fillStyle = '#000'; c.globalAlpha = p < .62 ? 1 : 1 - eio((p - .62) / .38); c.fillRect(0, 0, W, H); c.globalAlpha = 1;
        if (p < .4) { const q = eio(p / .4), sy = Math.max(.006, 1 - q); c.save(); c.translate(480, 270); c.scale(1 + q * .05, sy); c.translate(-480, -270); full(1); c.globalCompositeOperation = 'lighter'; full(q * .8); c.restore(); }
        else if (p < .62) { const q = (p - .4) / .22, wl = 480 * (1 - eio(q)); c.globalCompositeOperation = 'lighter'; const g = c.createLinearGradient(480 - wl, 0, 480 + wl, 0); g.addColorStop(0, 'rgba(200,255,210,0)'); g.addColorStop(.5, 'rgba(230,255,235,.95)'); g.addColorStop(1, 'rgba(200,255,210,0)'); c.fillStyle = g; c.fillRect(480 - wl, 268, wl * 2, 4); c.fillStyle = `rgba(230,255,235,${1 - q})`; c.beginPath(); c.arc(480, 270, 3 + 3 * q, 0, TAU); c.fill(); }
        break; }
      case 'sand': { const ex = eio(p) * 1120 - 80; c.save(); c.beginPath(); c.moveTo(970, 0); for (let y = 0; y <= H; y += 12) c.lineTo(ex + 18 * Math.sin(y * .07 + s.t * 3) + (hash3(y, 3, 1) % 14), y); c.lineTo(970, H); c.closePath(); c.clip(); full(); c.restore();
        for (let i = 0; i < 46; i++) { const y = (i * 11.7) % H, x = ex + 18 * Math.sin(y * .07 + s.t * 3) + (hash3(i, Math.floor(s.t * 20), 5) % 30) - 5; c.fillStyle = 'rgba(140,106,67,.55)'; c.fillRect(x, y, 2, 2); } break; }
      case 'crash': { const z = 1 + .6 * eio(p); c.translate(480, 270); c.scale(z, z); c.translate(-480, -270); full(1 - p); break; }
      case 'iris': { const r = 620 * eio(p); c.beginPath(); c.rect(0, 0, W, H); c.moveTo(480 + r, 270); c.arc(480, 270, r, 0, TAU, true); c.save(); c.clip('evenodd'); full(); c.restore(); c.strokeStyle = rgba(T.a1, .8 * (1 - p)); c.lineWidth = 3; c.beginPath(); c.arc(480, 270, r, 0, TAU); c.stroke(); break; }
      case 'page': { const x = -980 * eio(p); c.drawImage(sn, x, 0, W, H); const g = c.createLinearGradient(x + W, 0, x + W + 40, 0); g.addColorStop(0, 'rgba(46,35,24,.35)'); g.addColorStop(1, 'rgba(46,35,24,0)'); c.fillStyle = g; c.fillRect(x + W, 0, 40, H); break; }
      case 'paper': { const ex = eio(p) * 1060 - 50; c.save(); c.beginPath(); c.moveTo(980, -10); for (let y = -10; y <= H + 10; y += 9) c.lineTo(ex + ((hash3(y, 5, 2) % 100) / 100 - .5) * 7, y); c.lineTo(980, H + 10); c.closePath(); c.fillStyle = 'rgba(28,28,28,.28)'; c.translate(-6, 4); c.fill(); c.translate(6, -4); c.clip(); full(); c.restore(); break; }
      case 'ink': { c.beginPath(); c.rect(0, 0, W, H); [[300, 220], [640, 330], [480, 120], [180, 420], [800, 160], [520, 470]].forEach(([x, y], i) => { const r = 640 * eio(clamp(p * 1.15 - i * .03)); c.moveTo(x + r, y); for (let a = 0; a <= 32; a++) { const th = a / 32 * TAU, rr_ = r * (1 + .12 * Math.sin(th * 5 + i + s.t * 2)); c.lineTo(x + Math.cos(th) * rr_, y + Math.sin(th) * rr_); } });
        c.save(); c.clip('evenodd'); full(); c.restore(); break; }
      case 'shatter': { const polys = [[[0, 0], [560, 0], [300, 540], [0, 540]], [[560, 0], [960, 0], [960, 220], [430, 290]], [[430, 290], [960, 220], [960, 540], [300, 540]]], dirs = [[-1, .3, -.2], [1, -.6, .25], [.6, 1, -.15]];
        polys.forEach((pg, i) => { const q = eio(clamp((p - i * .08) / .8)), [dx, dy, rot] = dirs[i]; c.save(); c.translate(dx * 520 * q, dy * 420 * q); c.translate(480, 270); c.rotate(rot * q); c.translate(-480, -270); c.beginPath(); pg.forEach(([x, y], j) => j ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.save(); c.clip(); full(1 - q * .3); c.restore(); c.strokeStyle = '#111'; c.lineWidth = 6; c.stroke(); c.restore(); }); break; }
      case 'whip': { const x = -1000 * eioX(p); [3, 2, 1].forEach(g => { c.globalAlpha = .15; c.drawImage(sn, x + g * 22 * (p > .05 && p < .95 ? 1 : 0), 0, W, H); }); c.globalAlpha = 1; c.drawImage(sn, x, 0, W, H); break; }
    }
    c.restore();
  }

  function halo(s, col, amt) { const b = s.bB; if (!b || amt <= 0) return; const hb = off(s, 'hb', b.width, b.height), g = hb.getContext('2d');
    g.globalCompositeOperation = 'copy'; g.drawImage(b, 0, 0); g.globalCompositeOperation = 'multiply'; g.fillStyle = col; g.fillRect(0, 0, hb.width, hb.height);
    const c = s.c; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter'; c.globalAlpha = clamp(amt); c.imageSmoothingQuality = 'high'; c.drawImage(hb, 0, 0, s.cv.width, s.cv.height); c.restore(); }
  function vrays(s, R, amt) { const a = s.bA; if (!a || amt <= 0) return; const r = off(s, 'vr', a.width, a.height), g = r.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'copy'; g.drawImage(a, 0, 0); g.globalCompositeOperation = 'lighter';
    const cx = R.x / 960 * a.width, cy = R.y / 540 * a.height; let al = .5;
    for (let i = 1; i <= 8; i++) { const sc = 1 + .05 * i; g.globalAlpha = al; g.setTransform(sc, 0, 0, sc, cx * (1 - sc), cy * (1 - sc)); g.drawImage(a, 0, 0); al *= .84; }
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
    const c = s.c; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter'; c.globalAlpha = clamp(amt * .32); c.imageSmoothingQuality = 'high'; c.drawImage(r, 0, 0, s.cv.width, s.cv.height); c.restore(); }
  function lensDirt(s, amt) { const b = s.bB; if (!b || amt <= 0) return; const D = dirtTex(), d = off(s, 'dirtC', 480, 270), g = d.getContext('2d');
    g.globalCompositeOperation = 'copy'; g.imageSmoothingQuality = 'high'; g.drawImage(b, 0, 0, 480, 270); g.globalCompositeOperation = 'multiply'; g.drawImage(D, 0, 0);
    const c = s.c; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter'; c.globalAlpha = clamp(amt * 1.6); c.imageSmoothingQuality = 'high'; c.drawImage(d, 0, 0, s.cv.width, s.cv.height); c.restore(); }
  function gradePass(s, G) { const c = s.c, cv = s.cv, w = cv.width, h = cv.height;
    if (G.f && FILTER_OK && (s.q || 1) >= .75) { const gcv = off(s, 'gr', w, h), g = gcv.getContext('2d'); g.globalCompositeOperation = 'copy'; g.filter = G.f; g.drawImage(cv, 0, 0); g.filter = 'none';
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'copy'; c.drawImage(gcv, 0, 0); c.restore(); }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
    if (G.tint) { c.globalCompositeOperation = 'soft-light'; c.globalAlpha = G.tint[1]; c.fillStyle = G.tint[0]; c.fillRect(0, 0, w, h); }
    if (G.lift) { c.globalCompositeOperation = 'screen'; c.globalAlpha = G.lift[1]; c.fillStyle = G.lift[0]; c.fillRect(0, 0, w, h); }
    c.restore(); }
  function chroma(s, amt) { if (amt <= 0) return; const c = s.c, cv = s.cv, w = cv.width, h = cv.height, r = off(s, 'caR', w, h), g = r.getContext('2d');
    g.globalCompositeOperation = 'copy'; g.drawImage(cv, 0, 0); g.globalCompositeOperation = 'multiply'; g.fillStyle = '#FF0000'; g.fillRect(0, 0, w, h);
    const k = 1 + amt * 2 / 960; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'multiply'; c.fillStyle = '#00FFFF'; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter'; c.drawImage(r, w / 2 * (1 - k), h / 2 * (1 - k), w * k, h * k); c.restore(); }
  function grainPass(s, amt) { if (amt <= 0) return; const c = s.c, fr = Math.floor(s.t * 24), gt = grainTex(fr), ox = hash3(fr, 3, 3) % 256, oy = hash3(fr, 4, 4) % 256;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'overlay'; c.globalAlpha = amt; for (let x = -ox; x < s.cv.width; x += 256) for (let y = -oy; y < s.cv.height; y += 256) c.drawImage(gt, x, y); c.restore(); }
  function focusPull(s, p) { const c = s.c, cv = s.cv, sm = off(s, 'fz', Math.max(2, Math.round(cv.width / 8)), Math.max(2, Math.round(cv.height / 8))), g = sm.getContext('2d');
    g.imageSmoothingQuality = 'high'; g.globalCompositeOperation = 'copy'; g.drawImage(cv, 0, 0, sm.width, sm.height);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingQuality = 'high'; c.globalAlpha = (1 - eio(p)) * .92; c.drawImage(sm, 0, 0, cv.width, cv.height); c.restore(); }
  /* v6 depth of field: a blurred copy of the frame, cut away around the subject, laid back over the sharp frame */
  function dof(s, f, cam, amt) {
    const c = s.c, cv = s.cv, w = cv.width, h = cv.height, q = FILTER_OK ? 4 : 8, bw = Math.max(2, Math.round(w / q)), bh = Math.max(2, Math.round(h / q));
    const a = off(s, 'dfA', bw, bh), g = a.getContext('2d'), kx = bw / 960, ky = bh / 540;
    const fx = (480 + cam.x + (f.x - 480) * cam.z) * kx, fy = (270 + cam.y + (f.y - 270) * cam.z) * ky, fr = f.r * cam.z * kx;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'copy';
    if (FILTER_OK) g.filter = `blur(${(bw / 240 * 1.7).toFixed(2)}px)`;
    g.drawImage(cv, 0, 0, bw, bh); if (FILTER_OK) g.filter = 'none';
    g.globalCompositeOperation = 'destination-out';
    let m;
    if (f.band) { m = g.createLinearGradient(0, fy - fr * 2, 0, fy + fr * 2); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(.25, 'rgba(0,0,0,1)'); m.addColorStop(.75, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)'); }
    else { m = g.createRadialGradient(fx, fy, fr * .6, fx, fy, fr * 1.7); m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)'); }
    g.fillStyle = m; g.fillRect(0, 0, bw, bh);
    if (f.keep) { const K = f.keep, px = v => (480 + cam.x + (v - 480) * cam.z) * kx, py = v => (270 + cam.y + (v - 270) * cam.z) * ky;
      g.fillStyle = '#000'; g.shadowColor = '#000'; g.shadowBlur = 10 * kx * q; g.fillRect(px(K[0]), py(K[1]), K[2] * cam.z * kx, K[3] * cam.z * ky); g.shadowBlur = 0; g.shadowColor = 'transparent'; }
    g.globalCompositeOperation = 'source-over';
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = Math.min(1, amt); c.imageSmoothingEnabled = true; c.drawImage(a, 0, 0, w, h); c.restore();
  }
  function render(s, dt) {
    const c = s.c, B = beatOf(s), P = s.P || (s.P = Object.assign({}, (typeof POST !== 'undefined' && POST[s.th.id]) || {}, (typeof CINE !== 'undefined' && CINE[s.th.id]) || {})), L = s.lvl, cv = s.cv, w = cv.width, h = cv.height;
    let style = P.trans || 'fade'; if (L === 2 && !CALM[style]) style = 'fade'; if (L === 1 && (style === 'channel' || style === 'vhs')) style = 'fade';
    if (s.drawn && s.active !== -1 && B.i !== s.active && style !== 'cut' && !(P.skip || []).includes(B.i)) {
      const sn = off(s, 'snap', w, h), g = sn.getContext('2d'); g.globalCompositeOperation = 'copy'; g.drawImage(cv, 0, 0); s.tStart = s.t; s.tBlurDone = false;
    }
    c.setTransform(s.k, 0, 0, s.k, 0, 0); c.filter = 'none';
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.shadowBlur = 0; c.setLineDash([]); c.lineCap = 'butt'; c.lineJoin = 'miter';
    const cam = camera(s, B, P);
    c.save(); c.translate(480 + cam.x, 270 + cam.y); c.rotate(cam.r); c.scale(cam.z, cam.z); c.translate(-480, -270);
    try { s.scene.draw(s, s.t, B, dt); } catch (e) { console.error(s.th.id, e); }
    c.restore();
    if (P.fx || P.sheen) { c.save(); c.setTransform(s.k, 0, 0, s.k, 0, 0); c.translate(480 + cam.x, 270 + cam.y); c.rotate(cam.r); c.scale(cam.z, cam.z); c.translate(-480, -270); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.setLineDash([]);
      try { if (P.fx) P.fx(s, s.t, B, dt); if (P.sheen) P.sheen.forEach(o => { if (o.b === B.i) sheenText(c, o, (B.t - o.at) / o.dur); }); } catch (e) { console.error(s.th.id, 'fx', e); } c.restore(); }
    if (P.persist && L < 2 && dt > 0) {
      const pv = off(s, 'prev', w, h), pc = pv.getContext('2d');
      if (s.prevOk) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighten'; c.globalAlpha = P.persist * (L === 1 ? .6 : 1); c.drawImage(pv, 0, 0); c.restore(); }
      pc.globalCompositeOperation = 'copy'; pc.drawImage(cv, 0, 0); s.prevOk = true;
    } else if (dt > 0) s.prevOk = false;
    const hq = (s.q || 1) >= .75, SG = typeof STAGE !== 'undefined' && STAGE[s.th.id];
    if (SG && SG.fg.length) { c.save(); c.setTransform(s.k, 0, 0, s.k, 0, 0); c.globalAlpha = 1; c.setLineDash([]);
      try { SG.fg.forEach(F => fgLayer(s, F, cam, L, !s.focus)); } catch (e) { console.error(s.th.id, 'fg', e); } c.restore(); }
    if (s.focus && s.focus.amt > 0 && s.focus.r > 0 && hq) dof(s, s.focus, cam, s.focus.amt * [1, .65, .3][L]);
    if (P.focus && B.t < P.focus) focusPull(s, B.t / P.focus);
    if (P.bloom) { bloom(s, P.bloom * [1, .8, .45][L], P.th);
      if (P.halo) halo(s, P.halo[0], P.halo[1] * [1, .8, .5][L]);
      if (P.rays) vrays(s, P.rays, P.rays.a * [1, .8, .4][L]);
      if (P.dirt && L < 2 && hq) lensDirt(s, P.dirt * (L === 1 ? .7 : 1)); }
    if (P.grade) gradePass(s, P.grade);
    if (P.ca && L < 2 && hq) chroma(s, P.ca * (L === 1 ? .6 : 1));
    if (P.grain) grainPass(s, P.grain * (L === 2 ? .5 : 1));
    if (P.post) { c.save(); c.setTransform(s.k, 0, 0, s.k, 0, 0); try { P.post(s, s.t, B, FILTER_OK); } catch (e) { console.error(s.th.id, 'post', e); } c.restore(); }
    if (s.st.over) { c.save(); c.setTransform(s.k, 0, 0, s.k, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; try { s.st.over(); } catch (e) { console.error(s.th.id, 'over', e); } c.restore(); s.st.over = null; }
    if (s.tStart != null && s.snap) { const tp = (s.t - s.tStart) / ((P.tdur || .6) * (L === 2 ? 1.2 : 1)); if (tp >= 0 && tp < 1) transition(s, style, tp); else s.tStart = null; }
    const lbT = state.cine ? 1 : 0; s.lb = s.lb == null ? lbT : (dt > 0 ? lerp(s.lb, lbT, Math.min(1, dt * 5)) : lbT);
    if (s.lb > .002) { const bh = 69.2 * s.lb; c.save(); c.setTransform(s.k, 0, 0, s.k, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.fillStyle = '#000'; c.fillRect(0, 0, 960, bh); c.fillRect(0, 540 - bh, 960, bh); c.restore(); }
    s.drawn = true;
    if (s.chips) {
      if (s.active !== B.i) { s.chips.forEach((ch, k) => { ch.classList.toggle('on', k === B.i); ch.setAttribute('aria-current', k === B.i ? 'step' : 'false'); if (k !== B.i) ch.style.setProperty('--p', k < B.i ? 1 : 0); }); }
      s.chips[B.i].style.setProperty('--p', B.p.toFixed(3));
    }
    s.active = B.i;
  }
  function flag(s) {
    const capped = state.level === 2 && s.lvl < 2;
    s.flag.textContent = capped ? 'Tempered · no Boardroom version' : NAMES[s.lvl];
    s.flag.classList.toggle('capped', capped);
  }

  document.querySelectorAll('.plate').forEach(el => {
    const th = byId[el.dataset.id], scene = SCENES[th && th.id], cv = el.querySelector('canvas');
    if (!th || !scene || !cv) return;
    const s = { th, scene, el, cv, c: cv.getContext('2d'), W: 960, H: 540, R: rng(parseInt(th.id.slice(3), 10) * 977 + 13),
      st: {}, t: 0, lvl: eff(th), visible: false, pointer: null, flag: el.querySelector('.lvl-flag'), active: -1, drawn: false,
      total: scene.beats.reduce((a, b) => a + b[2], 0) };
    try { scene.init && scene.init(s); } catch (e) { console.error(th.id, 'init', e); }
    const bar = el.querySelector('.beats');
    if (bar) {
      let acc = 0;
      s.chips = scene.beats.map(([slot, label, d]) => {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'beat'; b.style.flexGrow = d;
        b.innerHTML = `<span class="slot">${slot}</span><span class="bl">${label}</span><i></i>`;
        b.setAttribute('aria-label', `Jump to ${slot}: ${label}`);
        const start = acc; acc += d;
        b.addEventListener('click', () => { s.t = Math.floor(s.t / s.total) * s.total + start + .001; render(s, 0); });
        bar.appendChild(b); return b;
      });
    }
    size(s); flag(s); render(s, 0); stages.push(s);
    if (FINE.matches) {
      cv.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); s.pointer = [(e.clientX - r.left) / r.width * 960, (e.clientY - r.top) / r.height * 540]; if (!state.playing) render(s, 0); });
      cv.addEventListener('pointerleave', () => { s.pointer = null; if (!state.playing) render(s, 0); });
    }
  });

  const io = new IntersectionObserver(es => es.forEach(e => { const s = stages.find(x => x.cv === e.target); if (s) { s.visible = e.isIntersecting; if (!s.visible) s.prevOk = false; } }), { rootMargin: '80px 0px' });
  stages.forEach(s => io.observe(s.cv));
  const ro = new ResizeObserver(es => es.forEach(e => { const s = stages.find(x => x.cv === e.target); if (s) { size(s); render(s, 0); } }));
  stages.forEach(s => ro.observe(s.cv));

  let last = performance.now(), fEma = 16, cool = 2;
  function loop(now) {
    const raw = now - last, dt = Math.min(.05, raw / 1000); last = now;
    if (state.playing && !document.hidden) {
      const vis = stages.filter(s => s.visible);
      for (const s of vis) { s.t += dt; render(s, dt); }
      /* adaptive resolution: hold frame rate on slower devices by rendering fewer pixels */
      if (vis.length && raw < 250) { fEma = fEma * .93 + raw * .07; cool -= dt;
        if (cool <= 0) { if (fEma > 26) { vis.forEach(s => { if ((s.q || 1) > .5) { s.q = Math.max(.5, (s.q || 1) * .82); size(s); } }); cool = 1.5; }
          else if (fEma < 18) { vis.forEach(s => { if ((s.q || 1) < 1) { s.q = Math.min(1, s.q * 1.1); size(s); } }); cool = 3; } } }
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  window.__reel = { stages, render, state };

  const fontList = new Set();
  THEMES.forEach(t => t.fonts.forEach(([f, w]) => fontList.add(`${w} 24px "${f}"`)));
  ['400 24px "Mr Dafoe"', '400 24px "IM Fell English"', '600 24px "Inter"', '700 24px "Inter"', '700 24px "Syncopate"', '500 24px "Cormorant Garamond"', '400 24px "VT323"', '400 24px "Special Elite"', '400 24px "Permanent Marker"', '600 24px "Josefin Sans"', '500 24px "Cormorant SC"', '700 24px "Stardos Stencil"', '400 24px "Space Mono"', '400 24px "IBM Plex Mono"', '400 24px "Courier Prime"', '600 24px "Jost"', '400 24px "EB Garamond"', '400 24px "Libre Caslon Text"', '500 24px "Barlow Condensed"', '400 24px "Exo 2"']
    .forEach(f => fontList.add(f));
  Promise.all([...fontList].map(f => document.fonts.load(f).catch(() => null))).then(() => stages.forEach(s => render(s, 0)));

  /* controls */
  const motionBtn = document.getElementById('motion');
  const syncMotion = () => { motionBtn.setAttribute('aria-pressed', String(!state.playing)); motionBtn.textContent = state.playing ? 'Pause motion' : 'Play motion'; };
  motionBtn.addEventListener('click', () => { state.playing = !state.playing; last = performance.now(); syncMotion(); });
  syncMotion();

  document.querySelectorAll('input[name="level"]').forEach(r => r.addEventListener('change', () => {
    state.level = +r.value; document.body.classList.toggle('lvl-2', state.level === 2);
    stages.forEach(s => { s.lvl = eff(s.th); s.st = {}; s.prevOk = false; s.tStart = null; try { s.scene.init && s.scene.init(s); } catch (e) { } flag(s); render(s, 0); });
  }));

  document.querySelectorAll('.fams button').forEach(b => b.addEventListener('click', () => {
    state.fam = b.dataset.fam;
    document.querySelectorAll('.fams button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    document.querySelectorAll('[data-fam-block]').forEach(sec => { sec.hidden = !(state.fam === 'all' || sec.dataset.famBlock === state.fam); });
  }));

  const cineBox = document.getElementById('cine');
  if (cineBox) cineBox.addEventListener('change', () => { state.cine = cineBox.checked; if (!state.playing) stages.forEach(s => render(s, 0)); });

  document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const plate = btn.closest('.plate'), th = byId[plate.dataset.id], out = plate.querySelector('.copied');
    const seed = btn.dataset.copy === 'seed', text = seed ? th.seed : plate.querySelector('pre code').textContent;
    try { await navigator.clipboard.writeText(text); out.textContent = seed ? 'Prompt seed copied' : 'Tokens copied'; }
    catch (e) {
      const d = plate.querySelector('details'); d.open = true;
      const range = document.createRange(); range.selectNodeContents(plate.querySelector('pre code'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      out.textContent = seed ? 'Copy blocked here. Seed: ' + th.seed : 'Copy blocked here: tokens are selected, press Ctrl+C or Cmd+C';
    }
    setTimeout(() => { out.textContent = ''; }, 6000);
  }));
})();
