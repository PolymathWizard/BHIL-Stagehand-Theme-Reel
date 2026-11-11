"""Render the README and docs visuals: one reel still per theme, figure thumbnails and two mosaics.

    python3 scripts/render_screens.py        # needs Playwright + Chromium and Pillow; set CHROME to use a system Chrome

Reads canon/screens.json (which frame of which beat), the built reel and the figure PNGs. Writes
docs/assets/screens/<slug>.jpg, docs/assets/screens/{reel,figure}-mosaic.jpg,
docs/assets/figures/thumb/<figure>.jpg and docs/assets/screens/SOURCES.sha256. The validator fails
when any input changes without a re-render (ADR-011).

Stills are taken from the canvas backing store at 1600 x 900 with the reel paused before its first
frame and Math.random seeded, so a re-render reproduces the same moment.
"""
import asyncio, base64, hashlib, io, json, os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SCREENS = ROOT / 'docs' / 'assets' / 'screens'
THUMBS = ROOT / 'docs' / 'assets' / 'figures' / 'thumb'
REEL = ROOT / 'reel' / 'dist' / 'stagehand-theme-reel.html'
NAVY = (13, 27, 46)

INIT = """
(() => {
  let a = %d >>> 0;
  Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  Object.defineProperty(window, '__reel', { configurable: true, get() { return undefined; },
    set(v) { v.state.playing = false; Object.defineProperty(window, '__reel', { value: v, writable: true, configurable: true }); } });
})();
"""

SHOT = """([i, beat, t]) => {
  const s = window.__reel.stages[i], R = window.__reel.render, bs = s.scene.beats;
  const idx = typeof beat === 'string' ? bs.findIndex(b => b[0] === beat) : beat;
  if (idx < 0 || idx >= bs.length) throw new Error('no beat ' + beat + ' in ' + s.th.id);
  s.q = 1; s.cv.width = 1600; s.cv.height = 900; s.k = 1600 / 960; s.prevOk = false;
  let st = 0; for (let k = 0; k < idx; k++) st += bs[k][2];
  s.t = st + Math.min(t, bs[idx][2] - .2) - .6;
  for (let k = 0; k < 18; k++) { s.t += 1 / 30; R(s, 1 / 30); }
  return s.cv.toDataURL('image/png');
}"""


def jpeg(im, path, size, q):
    path.parent.mkdir(parents=True, exist_ok=True)
    im.convert('RGB').resize(tuple(size), Image.LANCZOS).save(path, 'JPEG', quality=q, optimize=True, progressive=True)


def mosaic(images, cols, rows, size, gap=4):
    W, H = size; tw = (W - gap * (cols + 1)) // cols; th = (H - gap * (rows + 1)) // rows
    ox = (W - (tw * cols + gap * (cols - 1))) // 2; oy = (H - (th * rows + gap * (rows - 1))) // 2
    out = Image.new('RGB', (W, H), NAVY)
    for n, im in enumerate(images[:cols * rows]):
        r = tw / th; w, h = im.size
        box = (int((w - h * r) / 2), 0, int((w + h * r) / 2), h) if w / h > r else (0, int((h - w / r) / 2), w, int((h + w / r) / 2))
        out.paste(im.crop(box).resize((tw, th), Image.LANCZOS), (ox + (n % cols) * (tw + gap), oy + (n // cols) * (th + gap)))
    return out


def inputs(cfg, figs):
    rel = ['reel/dist/stagehand-theme-reel.html', 'canon/screens.json', 'canon/themes.json', 'canon/figures.json', 'scripts/render_screens.py']
    rel += [f'docs/assets/figures/png/{f[1]}.png' for f in figs]
    return ''.join(f'{hashlib.sha256((ROOT / p).read_bytes()).hexdigest()}  {p}\n' for p in rel)


async def stills(cfg, themes):
    from playwright.async_api import async_playwright
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 1600, 'height': 1000})
        errs = []; pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script(INIT % cfg['seed'])
        await pg.goto(REEL.as_uri()); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(800)
        for i, t in enumerate(themes):
            sel = cfg['stills'][t['id']]
            url = await pg.evaluate(SHOT, [i, sel['beat'], sel['t']])
            out[t['id']] = Image.open(io.BytesIO(base64.b64decode(url.split(',', 1)[1]))).convert('RGB')
        await b.close()
    if errs:
        raise SystemExit('reel errors while rendering stills: ' + '; '.join(errs))
    return out


def main():
    cfg = json.loads((ROOT / 'canon' / 'screens.json').read_text(encoding='utf-8'))
    themes = json.loads((ROOT / 'canon' / 'themes.json').read_text(encoding='utf-8'))['themes']
    figs = json.loads((ROOT / 'canon' / 'figures.json').read_text(encoding='utf-8'))['figures']
    missing = [t['id'] for t in themes if t['id'] not in cfg['stills']]
    if missing:
        raise SystemExit('canon/screens.json has no still for ' + ', '.join(missing))
    shots = asyncio.run(stills(cfg, themes)); q = cfg['jpeg_quality']
    for t in themes:
        jpeg(shots[t['id']], SCREENS / f'{t["slug"]}.jpg', cfg['still_size'], q)
    fig_png = [Image.open(ROOT / 'docs' / 'assets' / 'figures' / 'png' / f'{f[1]}.png').convert('RGB') for f in figs]
    for f, im in zip(figs, fig_png):
        jpeg(im, THUMBS / f'{f[1]}.jpg', cfg['thumb_size'], q)
    src = {'stills': dict(shots), 'figures': {f[0]: im for f, im in zip(figs, fig_png)}}
    for name, m in cfg['mosaics'].items():
        tiles = [src[m['from']][k] for k in m['pick']]
        jpeg(mosaic(tiles, m['cols'], m['rows'], cfg['still_size']), SCREENS / f'{name}.jpg', cfg['still_size'], q)
    (SCREENS / 'SOURCES.sha256').write_text(inputs(cfg, figs))
    n = len(list(SCREENS.glob('*.jpg'))) + len(list(THUMBS.glob('*.jpg')))
    kb = sum(p.stat().st_size for p in list(SCREENS.glob('*.jpg')) + list(THUMBS.glob('*.jpg'))) // 1024
    print(f'rendered {n} images, {kb} KB, errors: none')


if __name__ == '__main__':
    main()
