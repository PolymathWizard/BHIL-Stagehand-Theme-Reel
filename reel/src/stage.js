/* ── v6 staging layer: a directed camera, rack focus and foreground parallax ──
   Each non-data beat carries focus keys [p, x, y, r]: at beat progress p the subject sits at scene point (x, y)
   and stays sharp inside radius r. The camera pushes toward the subject, the depth-of-field pass softens
   everything outside it, and a foreground particle layer drifts past the lens with stronger parallax.
   A theme can name a keep rectangle (its title block) that never blurs.
   Data beats (S4) carry no keys, so charts stay sharp and the foreground thins out. */
const STAGE = {
  'TX-01': { dof: .8, fg: [{ type: 'bits', n: 18, col: ['a1', 'ink'], a: .5, add: 1 }],
    beats: [{ k: [[0, 300, 420, 240], [.5, 480, 114, 300]], z: [1.03, 1.08] }, { k: [[0, 190, 375, 220], [.45, 480, 255, 240], [.85, 774, 345, 220]] }, null, { k: [[0, 510, 294, 260]] }] },
  'TX-02': { dof: .7, fg: [{ type: 'rain', ang: 90, sp: .35, n: 12, col: ['a1'], a: .3, add: 1 }],
    beats: [{ k: [[0, 480, 234, 300]] }, { k: [[0, 384, 156, 250], [.4, 330, 228, 250], [.65, 330, 276, 250], [.9, 330, 324, 250]] }, { k: [[0, 480, 267, 200], [.6, 640, 200, 240]] }, null] },
  'TX-03': { keep: [14, 14, 330, 70], dof: .8, fg: [{ type: 'motes', n: 9, col: ['a1'], a: .3, add: 1 }],
    beats: [{ k: [[0, 170, 150, 270], [.4, 795, 200, 230], [.8, 480, 288, 240]] }, { k: [[0, 216, 306, 240], [.9, 858, 190, 240]] }, null, { k: [[0, 150, 130, 260], [.5, 690, 354, 220]] }] },
  'TX-04': { dof: .9, fg: [{ type: 'rain', ang: 76, sp: 1, n: 16, col: ['ink'], a: .28, add: 1 }, { type: 'motes', n: 7, col: ['a2', 'a3', 'a1'], a: .3, add: 1, seed: 19 }],
    beats: [{ k: [[0, 126, 180, 220], [.4, 330, 264, 300]], z: [1.02, 1.07] }, { k: [[0, 330, 264, 300], [.45, 270, 378, 280]] }, null] },
  'TX-05': { dof: 0, fg: [],
    beats: [{ k: [[0, 480, 210, 300], [.7, 480, 400, 320]] }, { k: [[0, 486, 222, 330], [.6, 480, 300, 330]] }, null, { k: [[0, 312, 162, 280], [.5, 762, 150, 240], [.85, 837, 387, 240]] }] },
  'TX-06': { dof: .9, fg: [{ type: 'motes', n: 18, col: ['ink'], a: .28, add: 1, rmax: 14, vx: 4, vy: 6 }],
    beats: [{ k: [[0, 480, 174, 300], [.7, 440, 220, 320]] }, { k: [[0, 480, 228, 300]] }, null, { k: [[0, 228, 246, 220], [.9, 765, 240, 220]] }] },
  'TX-07': { dof: .8, fg: [{ type: 'motes', n: 9, col: ['a1', 'a2'], a: .3, add: 1 }],
    beats: [{ k: [[0, 480, 240, 300], [.6, 480, 150, 320]] }, { k: [[0, 192, 144, 240], [.5, 600, 150, 260]] }, null, { k: [[0, 480, 264, 280]], z: [1.03, 1.08] }] },
  'TX-08': { keep: [40, 50, 420, 70], dof: .7, fg: [{ type: 'bits', n: 8, col: ['a2'], a: .25, add: 1 }],
    beats: [{ k: [[0, 200, 80, 260], [.25, 410, 310, 230], [.5, 720, 170, 230], [.8, 720, 321, 220]] }, { k: [[0, 480, 270, 260], [.4, 300, 180, 260], [.9, 440, 440, 260]] }, null, { k: [[0, 480, 270, 260], [.4, 480, 342, 280]] }] },
  'TX-09': { dof: .6, fg: [{ type: 'motes', n: 6, col: ['a2'], a: .2, add: 1 }],
    beats: [{ k: [[0, 480, 400, 280], [1, 480, 330, 300]] }, { k: [[0, 480, 279, 300]] }, null, { k: [[0, 480, 270, 200], [1, 480, 270, 340]], z: [1.04, 1.14] }] },
  'TX-10': { dof: .7, fg: [{ type: 'sand', n: 22, col: ['#B89A6A', 'a2'], a: .4 }],
    beats: [{ k: [[0, 480, 120, 280], [.4, 480, 270, 300]] }, { k: [[0, 480, 267, 300]] }, null, { k: [[0, 300, 330, 260], [.8, 560, 300, 280]] }] },
  'TX-11': { dof: .8, fg: [{ type: 'sand', n: 20, col: ['#FFD9A0'], a: .4, add: 1 }, { type: 'embers', n: 14, col: ['a1', '#FFD27A'], a: .6, add: 1, seed: 31 }],
    beats: [{ k: [[0, 126, 465, 220], [.4, 480, 291, 300]], z: [1.03, 1.09] }, { k: [[0, 480, 285, 300]] }, null, { k: [[0, 522, 285, 260]], z: [1.03, 1.09] }] },
  'TX-12': { keep: [140, 20, 680, 60], dof: .8, fg: [{ type: 'motes', n: 6, col: ['ink'], a: .15, add: 1, rmax: 10 }],
    beats: [{ k: [[0, 480, 180, 300], [.8, 480, 267, 300]] }, { k: [[0, 480, 267, 220]] }, null, { k: [[0, 480, 275, 220], [.7, 480, 258, 300]] }] },
  'TX-13': { keep: [200, 14, 560, 66], dof: .9, fg: [{ type: 'motes', n: 12, col: ['a1', '#F3D9A0'], a: .3, add: 1 }],
    beats: [{ k: [[0, 480, 120, 280], [.2, 525, 210, 220], [.4, 410, 290, 220], [.6, 720, 306, 220], [.85, 609, 396, 220]] }, { k: [[0, 480, 261, 300]] }, null, { k: [[0, 520, 280, 260], [.4, 477, 456, 240]] }] },
  'TX-14': { keep: [20, 20, 620, 90], dof: .6, fg: [],
    beats: [{ k: [[0, 200, 80, 260], [.15, 135, 498, 210], [.35, 381, 252, 220], [.55, 400, 430, 220], [.8, 723, 273, 230]] }, { k: [[0, 330, 270, 260], [.3, 789, 219, 240], [.75, 650, 384, 240]] }, null] },
  'TX-15': { keep: [20, 30, 560, 90], dof: .5, fg: [{ type: 'petals', n: 14, col: ['#F2B8C6', '#FFFFFF', 'a1'], a: .8 }],
    beats: [{ k: [[0, 291, 72, 280], [.5, 705, 250, 260]] }, { k: [[0, 480, 246, 300]] }, null, { k: [[0, 705, 250, 260], [.4, 480, 252, 240]] }] },
  'TX-16': { dof: 0, fg: [{ type: 'flecks', n: 9, col: ['a1', 'a2', 'a3', 'ink'], a: .9 }],
    beats: [{ k: [[0, 345, 255, 0], [.5, 780, 165, 0], [.85, 345, 255, 0]] }, { k: [[0, 174, 300, 0], [.9, 780, 300, 0]] }, null, { k: [[0, 345, 255, 0], [.4, 642, 300, 0]] }] },
  'TX-17': { dof: .9, fg: [{ type: 'motes', n: 12, col: ['a3', 'a1'], a: .3, add: 1, rmax: 44 }],
    beats: [{ k: [[0, 480, 200, 240], [.5, 480, 258, 300]] }, { k: [[0, 486, 170, 220], [.6, 480, 258, 300]] }, null, { k: [[0, 480, 267, 260]], z: [1.03, 1.08] }] },
  'TX-18': { dof: 0, fg: [],
    beats: [{ k: [[0, 171, 276, 0], [.4, 660, 180, 0], [.8, 660, 405, 0]] }, null, null, { k: [[0, 246, 162, 0], [.4, 822, 126, 0], [.8, 636, 411, 0]] }] },
  'TX-19': { dof: .8, band: 1, fg: [],
    beats: [{ k: [[0, 480, 330, 120]] }, { k: [[0, 480, 264, 150]] }, null] },
  'TX-20': { keep: [20, 14, 420, 66], dof: .8, fg: [{ type: 'motes', n: 10, col: ['#FFFFFF'], a: .4, rmax: 16, vx: 3, vy: -2 }],
    beats: [{ k: [[0, 200, 60, 260], [.4, 480, 320, 250], [.8, 480, 225, 260]] }, { k: [[0, 480, 276, 240], [.6, 480, 312, 220]] }, null, { k: [[0, 480, 225, 260], [.4, 762, 153, 230]] }] }
};

/* where the subject is right now: eased between the beat's focus keys */
function stageFocus(s, B) {
  const S = STAGE[s.th.id], b = S && S.beats[B.i];
  if (!b) return null;
  const K = b.k; let i = 0;
  while (i < K.length - 1 && B.p >= K[i + 1][0]) i++;
  const a = K[i], n = K[Math.min(i + 1, K.length - 1)], u = n === a ? 0 : eio(clamp((B.p - a[0]) / Math.max(1e-6, n[0] - a[0])));
  const z = b.z || [1.015, 1.045];
  return { x: lerp(a[1], n[1], u), y: lerp(a[2], n[2], u), r: lerp(a[3], n[3], u), z0: z[0], z1: z[1], band: !!S.band, amt: S.dof, keep: S.keep };
}

/* the camera move for a staged beat: push in on the subject, settle after the cut, never show past the frame edge */
function stageCamera(f, B, k, L) {
  let z = 1 + (lerp(f.z0, f.z1, eio(B.p)) - 1) * k;
  if (L < 2) z += .012 * k * Math.exp(-5 * B.t) * Math.cos(11 * B.t);
  z = Math.max(1.004, z);
  const mx = 480 * (1 - 1 / z) * .94, my = 270 * (1 - 1 / z) * .94;
  const cx = clamp((f.x - 480) * .3, -mx, mx), cy = clamp((f.y - 270) * .2, -my, my);
  return { x: -cx * z, y: -cy * z, z };
}

const fgWrap = (v, span, m) => (((v % span) + span) % span) - m;
function fgLayer(s, F, cam, L, thin) {
  const c = s.c, T = s.th.tok, t = s.t, n = Math.max(1, Math.round(F.n * [1, .7, .4][L])), A = F.a * [1, .8, .55][L] * (thin ? .35 : 1), seed = F.seed || 7, M = 70, SX = 960 + 2 * M, SY = 540 + 2 * M;
  c.globalCompositeOperation = F.add ? 'lighter' : 'source-over'; c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const h1 = (hash3(i, 11, seed) % 1000) / 1000, h2 = (hash3(i, 23, seed) % 1000) / 1000, d = (hash3(i, 37, seed) % 1000) / 1000;
    const ck = F.col[i % F.col.length], col = T[ck] || ck, par = 1.4 + d * 1.6, zk = 1 + (cam.z - 1) * (1.5 + 2 * d);
    let x, y;
    const place = (vx, vy, sway) => { x = fgWrap(h1 * SX + t * vx, SX, M); y = fgWrap(h2 * SY + t * vy + (sway || 0), SY, M); x = 480 + (x - 480) * zk + cam.x * par; y = 270 + (y - 270) * zk + cam.y * par; };
    if (F.type === 'motes') {
      place((F.vx == null ? 6 : F.vx) * (.4 + d), (F.vy == null ? -4 : F.vy) * (.4 + d), Math.sin(t * .4 + i) * 8);
      const r = 4 + d * d * ((F.rmax || 34) - 4), a = A * (.25 + .5 * (1 - d * .6)), g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(col, a * .5)); g.addColorStop(.7, rgba(col, a * .45)); g.addColorStop(.88, rgba(col, a * .8)); g.addColorStop(1, rgba(col, 0));
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    } else if (F.type === 'rain') {
      const an = F.ang * Math.PI / 180, sp = (700 + d * 900) * F.sp, len = 40 + d * 120; place(Math.cos(an) * sp, Math.sin(an) * sp);
      c.strokeStyle = rgba(col, A * (.3 + .6 * d)); c.lineWidth = 1 + d * 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x - Math.cos(an) * len, y - Math.sin(an) * len); c.stroke();
    } else if (F.type === 'sand') {
      place(260 + d * 380, 12 + d * 20, Math.sin(t * 1.3 + i * 2.1) * 14); const len = 8 + d * 26;
      c.strokeStyle = rgba(col, A * (.35 + .5 * d)); c.lineWidth = 1 + d * 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x - len, y - len * .06); c.stroke();
    } else if (F.type === 'embers') {
      place(Math.sin(i) * 14, -(30 + d * 70), Math.sin(t * .9 + i * 1.7) * 18); const r = 1.2 + d * 2.4, a = A * (.55 + .45 * Math.sin(t * (1.1 + h1) + i));
      c.fillStyle = rgba(col, a * .22); c.beginPath(); c.arc(x, y, r * 4, 0, TAU); c.fill(); c.fillStyle = rgba(col, a); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    } else if (F.type === 'petals') {
      place(40 + d * 70, 18 + d * 26, Math.sin(t * .8 + i * 1.3) * 26); const rx = 4 + d * 7;
      c.save(); c.translate(x, y); c.rotate(t * (.8 + h1) + i); c.scale(1, .45 + .3 * Math.sin(t * 1.6 + i)); c.fillStyle = rgba(col, A * (.5 + .4 * d)); c.beginPath(); c.arc(0, 0, rx, 0, TAU); c.fill(); c.restore();
    } else if (F.type === 'flecks') {
      const ts = Math.floor(t * 12) / 12, fr = Math.floor(t * 12); x = fgWrap(h1 * SX + ts * 5 + (hash3(fr, i, 3) % 5) - 2, SX, M); y = fgWrap(h2 * SY + ts * (14 + d * 22), SY, M);
      x = 480 + (x - 480) * zk + cam.x * par; y = 270 + (y - 270) * zk + cam.y * par; const sz = 3 + d * 7, rot = ((hash3(Math.floor(t * 3), i, 5) % 100) / 100) * TAU;
      c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = rgba(col, A); c.beginPath(); c.moveTo(-sz, -sz * .6); c.lineTo(sz * .8, -sz * .4); c.lineTo(sz * .5, sz * .7); c.lineTo(-sz * .7, sz * .5); c.closePath(); c.fill(); c.restore();
    } else if (F.type === 'bits') {
      place(0, -(10 + d * 26)); const sz = 2 + d * 5, wide = i % 3 === 0, a = A * (.3 + .5 * d) * (.7 + .3 * Math.sin(t * (.6 + h1) + i));
      c.fillStyle = rgba(col, a); c.fillRect(x, y, wide ? sz * 4 : sz, wide ? Math.max(1, sz * .4) : sz);
    }
  }
  c.globalCompositeOperation = 'source-over';
}
