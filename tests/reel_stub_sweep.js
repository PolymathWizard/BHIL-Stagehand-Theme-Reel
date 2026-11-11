const fs = require('fs');
// Canvas stub sweep: runs every scene, at every intensity level, through its whole loop
// against a strict mock 2D context. Catches non-finite geometry, negative radii, bad colors
// and unknown composite modes before a browser ever sees them.
//   node tests/reel_stub_sweep.js reel/dist/stagehand-theme-reel.html [loops]
const html = fs.readFileSync(process.argv[2] || 'reel/dist/stagehand-theme-reel.html', 'utf8');
const LOOPS = parseFloat(process.argv[3] || '1.25');
const js = html.split('<script>')[1].split('</script>')[0];
const scenePart = js.split('/* ── Reel engine')[0];
let errors = [], calls = 0;
const colorOK = c => typeof c !== 'string' || /^#([0-9a-fA-F]{3}){1,2}$/.test(c) || /^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(,\s*-?[\d.e-]+\s*)?\)$/.test(c) || /^(white|black|transparent)$/.test(c);
function grad() { return { addColorStop(o, c) { if (!(o >= 0 && o <= 1) || !Number.isFinite(o)) throw new Error('addColorStop offset ' + o); if (!colorOK(c)) throw new Error('bad stop color ' + c); } }; }
function mkCtx() {
  const store = { globalAlpha: 1, lineWidth: 1, font: '10px sans-serif' };
  const fin = (...a) => a.forEach(v => { if (typeof v === 'number' && !Number.isFinite(v)) throw new Error('non-finite arg'); });
  const special = {
    createLinearGradient: (...a) => { fin(...a); return grad(); },
    createConicGradient: (...a) => { fin(...a); return grad(); },
    canvas: { width: 1440, height: 810 },
    createRadialGradient: (x0, y0, r0, x1, y1, r1) => { fin(x0, y0, r0, x1, y1, r1); if (r0 < 0 || r1 < 0) throw new Error('radial negative radius ' + r0 + ',' + r1); return grad(); },
    arc: (x, y, r, a, b) => { fin(x, y, r, a, b); if (r < 0) throw new Error('arc negative radius ' + r); calls++; },
    ellipse: (x, y, rx, ry) => { fin(x, y, rx, ry); if (rx < 0 || ry < 0) throw new Error('ellipse negative radius'); },
    arcTo: (...a) => { fin(...a); if (a[4] < 0) throw new Error('arcTo negative'); },
    measureText: s => ({ width: 9 * [...s].length }),
    createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
    putImageData() {}, drawImage: (...a) => { fin(...a.slice(1)); },
    setLineDash: a => { if (!Array.isArray(a)) throw new Error('dash'); },
    fillText: (s, x, y) => { fin(x, y); if (typeof s !== 'string') throw new Error('fillText non-string'); calls++; },
    strokeText: (s, x, y) => { fin(x, y); },
    fillRect: (...a) => { fin(...a); calls++; }, strokeRect: (...a) => fin(...a), moveTo: (...a) => fin(...a), lineTo: (...a) => fin(...a),
    quadraticCurveTo: (...a) => fin(...a), translate: (...a) => fin(...a), scale: (...a) => fin(...a), rotate: (...a) => fin(...a), setTransform: (...a) => fin(...a),
  };
  return new Proxy({}, {
    get(_, p) { if (p in special) return special[p]; if (p in store) return store[p]; return () => {}; },
    set(_, p, v) { if (p === 'globalCompositeOperation' && !['source-over', 'lighter', 'overlay', 'saturation', 'screen', 'multiply', 'source-atop', 'lighten', 'copy'].includes(v)) throw new Error('gco ' + v); if ((p === 'fillStyle' || p === 'strokeStyle' || p === 'shadowColor') && !colorOK(v) && typeof v === 'string') throw new Error('bad color ' + p + '=' + v); store[p] = v; return true; }
  });
}
global.document = { createElement: () => ({ width: 0, height: 0, getContext: () => mkCtx() }) };
const f = new Function('document', scenePart + '; return {THEMES, SCENES, rng, POST, CINE, sheenText};');
const { THEMES, SCENES, rng, POST, CINE, sheenText } = f(global.document);

const beatOf = (scene, t) => { const total = scene.beats.reduce((a, b) => a + b[2], 0), tc = ((t % total) + total) % total; let acc = 0;
  for (let i = 0; i < scene.beats.length; i++) { const d = scene.beats[i][2]; if (tc < acc + d || i === scene.beats.length - 1) return { i, t: tc - acc, d, p: Math.min(1, (tc - acc) / d), n: scene.beats.length }; acc += d; } };
let frames = 0;
for (const th of THEMES) {
  const sc = SCENES[th.id]; if (!sc) { errors.push(th.id + ' missing scene'); continue; }
  if (!Array.isArray(sc.beats) || !sc.beats.length) { errors.push(th.id + ' no beats'); continue; }
  const total = sc.beats.reduce((a, b) => a + b[2], 0);
  for (const lvl of [0, 1, 2]) {
    const s = { th, scene: sc, c: mkCtx(), W: 960, H: 540, k: 1.5, cv: { width: 1440, height: 810 }, R: rng(parseInt(th.id.slice(3)) * 977 + 13), st: {}, lvl, pointer: lvl === 0 ? [300, 200] : null };
    try { sc.init && sc.init(s); } catch (e) { errors.push(`${th.id} L${lvl} init: ${e.message}`); continue; }
    const dt = 1 / 30;
    for (let t = 0; t < total * LOOPS; t += dt) { frames++; try { const B = beatOf(sc, t); sc.draw(s, t, B, dt); const P = POST[th.id] || {}; if (P.fx) P.fx(s, t, B, dt); if (P.post) P.post(s, t, B, false); const C = CINE[th.id]; if (C && C.sheen) C.sheen.forEach(o => { if (o.b === B.i) sheenText(s.c, o, (B.t - o.at) / o.dur); }); if (s.st.over) { s.st.over(); s.st.over = null; } } catch (e) { errors.push(`${th.id} L${lvl} t=${t.toFixed(2)} beat=${beatOf(sc, t).i}: ${e.message}`); break; } }
  }
  console.log(th.id, 'loop', total.toFixed(1) + 's', sc.beats.map(b => b[0]).join(' '));
}
console.log('frames:', frames, 'draw calls:', calls);
console.log(errors.length ? errors.join('\n') : 'NO ERRORS');
process.exit(errors.length ? 1 : 0);
