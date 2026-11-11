"""Render each figure SVG to a 1600x900 PNG (reduced motion = the designed static frame) plus a contact sheet.

Non-stdlib: Playwright + Chromium. Set CHROME to use a system Chrome.
"""
import asyncio, hashlib, io, os, sys
from pathlib import Path
from playwright.async_api import async_playwright
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
async def main(live=False):
    FIG = ROOT / 'docs' / 'assets' / 'figures'
    svgs = sorted((FIG / 'svg').glob('stc-*.svg'))
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--no-sandbox'])
        pg = await b.new_page(viewport={'width': 1600, 'height': 900})
        errs = []; pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
        await pg.emulate_media(reduced_motion='no-preference' if live else 'reduce')
        shots = []
        for s in svgs:
            await pg.goto(s.as_uri()); await pg.wait_for_timeout(2600 if live else 400)
            png = await pg.screenshot(clip={'x': 0, 'y': 0, 'width': 1600, 'height': 900})
            out = (FIG / 'png' if not live else Path('/tmp/stc-live')) / (s.stem + '.png'); out.parent.mkdir(exist_ok=True); out.write_bytes(png)
            shots.append(Image.open(io.BytesIO(png)))
        await b.close()
    tw, th = 800, 450
    sheet = Image.new('RGB', (tw * 2 + 30, (th + 10) * 5 + 10), (13, 27, 46))
    for i, im in enumerate(shots):
        sheet.paste(im.resize((tw, th), Image.LANCZOS), (10 + (i % 2) * (tw + 10), 10 + (i // 2) * (th + 10)))
    sheet.save('/tmp/stc-live-sheet.png' if live else FIG / 'stc-contact-sheet.png')
    if not live:
        (FIG / 'png' / 'SOURCES.sha256').write_text(''.join(f'{hashlib.sha256(s.read_bytes()).hexdigest()}  svg/{s.name}\n' for s in svgs))
    print('rendered', len(shots), 'errors:', errs or 'none')
asyncio.run(main('--live' in sys.argv))
