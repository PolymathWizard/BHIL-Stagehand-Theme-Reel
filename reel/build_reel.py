"""Build reel/dist/stagehand-theme-reel.html: one self-contained file, fonts inlined as subset woff2.

Non-stdlib on purpose (fontTools + brotli for woff2 subsetting) and kept out of the stdlib gates.
The validator checks that the committed build is fresh against reel/dist/SOURCES.sha256.

    cd reel && npm ci && pip install fonttools brotli && python3 build_reel.py
"""
import base64, hashlib, html, io, json, os, sys
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

REEL = Path(__file__).resolve().parent
ROOT = REEL.parent
SRC = REEL / 'src'
FONTDIR = Path(os.environ.get('STC_FONTS', REEL / 'node_modules' / '@fontsource'))
OUT = REEL / 'dist' / 'stagehand-theme-reel.html'
ORDER = ('data.js', 'helpers.js', 'dataviz.js', 'scenes-a.js', 'scenes-b.js', 'scenes-c.js', 'scenes-d.js', 'fx.js', 'cine.js', 'stage.js', 'engine.js')
INPUTS = [SRC / f for f in ORDER] + [SRC / 'shell.html', ROOT / 'canon' / 'themes.json', ROOT / 'canon' / 'families.json', ROOT / 'canon' / 'stagehand.json', REEL / 'build_reel.py']

THEMES = json.loads((ROOT / 'canon' / 'themes.json').read_text(encoding='utf-8'))['themes']
FAMS = {f['id']: f for f in json.loads((ROOT / 'canon' / 'families.json').read_text(encoding='utf-8'))['families']}
DIAL = json.loads((ROOT / 'canon' / 'dial.json').read_text(encoding='utf-8'))['b2b_fit']
META = json.loads((ROOT / 'canon' / 'stagehand.json').read_text(encoding='utf-8'))

GLYPHS = ''.join(chr(c) for c in range(0x20, 0x7F)) + '·‘’“”…×°▶é©'
# Page shell (BHIL Brand Guidelines v1.0): Newsreader, IBM Plex Sans, IBM Plex Mono. Scene fonts follow.
UI = {('Newsreader', 300), ('Newsreader', 300, 'italic'), ('IBM Plex Sans', 400), ('IBM Plex Sans', 600),
      ('IBM Plex Mono', 400), ('IBM Plex Mono', 500), ('IBM Plex Mono', 600),
      ('Mr Dafoe', 400), ('IM Fell English', 400), ('Inter', 600), ('Inter', 700)}

# The BHIL terminal badge, drawn from the guidelines' anatomy: window dots, prompt chevron, BHIL monogram,
# dot-matrix cursor over a live input line, on its navy field. Replace with the master artwork if it changes.
BADGE = ('<svg viewBox="0 0 132 80" role="img" aria-hidden="true" focusable="false">'
         '<rect width="132" height="80" fill="#0D1B2E"/>'
         '<circle cx="12" cy="12" r="3.2" fill="#6CC0E8"/><circle cx="22" cy="12" r="3.2" fill="#4FA3D1"/><circle cx="32" cy="12" r="3.2" fill="#2E80B0"/>'
         '<rect x="0" y="22" width="132" height="1" fill="#1E3A5F"/>'
         '<path d="M12 39l8 6-8 6z" fill="#4FA3D1"/>'
         '<text x="27" y="52" fill="#FFFFFF" font-family="IBM Plex Mono, ui-monospace, monospace" font-weight="600" font-size="21" letter-spacing="2">BHIL</text>'
         '<g class="cursor" fill="#6CC0E8">' + ''.join(f'<rect x="{92 + c * 3.4:.1f}" y="{37 + r * 3.4:.1f}" width="2.4" height="2.4"/>' for r in range(5) for c in range(3)) + '</g>'
         '<rect x="12" y="62" width="108" height="1" fill="#4FA3D1"/>'
         '</svg>')


def subset_font(path):
    opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern', 'liga', 'calt', 'tnum', 'lnum']
    opts.hinting = False; opts.desubroutinize = True
    f = TTFont(path); s = subset.Subsetter(opts); s.populate(text=GLYPHS); s.subset(f)
    buf = io.BytesIO(); f.flavor = 'woff2'; f.save(buf); return buf.getvalue()


def faces():
    need = {(f[0], f[1], f[2] if len(f) > 2 else 'normal') for f in UI} | {(*t['fonts'][r], 'normal') for t in THEMES for r in ('display', 'body', 'mono')}
    out, missing = [], []
    for fam, w, style in sorted(need):
        pkg = fam.lower().replace(' ', '-'); p = FONTDIR / pkg / 'files' / f'{pkg}-latin-{w}-{style}.woff2'
        if not p.exists():
            missing.append(str(p)); continue
        b64 = base64.b64encode(subset_font(p)).decode()
        out.append(f'@font-face{{font-family:"{fam}";font-weight:{w};font-style:{style};font-display:swap;src:url(data:font/woff2;base64,{b64}) format("woff2");}}')
    if missing:
        sys.exit('missing font files (run npm ci in reel/):\n  ' + '\n  '.join(missing))
    return out


E = html.escape
B2B = {'native': 'b-native', 'board': 'b-board', 'news': 'b-news', 'temp': 'b-temp', 'avoid': 'b-avoid'}


def hexa(h, a):
    n = int(h[1:], 16); return f'rgba({n >> 16 & 255},{n >> 8 & 255},{n & 255},{a})'


def tokens_css(t):
    k, f, x = t['tokens'], t['fonts'], t['extra_tokens']
    extra = ' '.join(f'--tx-{n}: {v};' for n, v in x.items() if n != 'fills')
    return (f'/* {t["id"]} {t["name"]} · Stagehand Theme Codex STC v1.0 */\n:root {{\n  --tx-id: "{t["id"]}";\n'
            f'  --tx-bg: {k["bg"]}; --tx-ink: {k["ink"]};\n  --tx-a1: {k["a1"]}; --tx-a2: {k["a2"]}; --tx-a3: {k["a3"]};\n'
            f'  --tx-display: "{f["display"][0]}"; --tx-body: "{f["body"][0]}"; --tx-mono: "{f["mono"][0]}";\n'
            f'  --tx-ease: {t["ease"]}; --tx-dur: {t["dur"]};\n  {extra}\n}}')


def plate(t):
    k = t['tokens']; df, dw = t['fonts']['display']
    sw = ''.join(f'<div class="sw"><i style="background:{k[r]}"></i><span>{r}</span><code>{k[r]}</code></div>' for r in ('bg', 'ink', 'a1', 'a2', 'a3'))
    ty = ''.join(f'<div><dt>{role.title()}</dt><dd style="font-family:&quot;{E(t["fonts"][role][0])}&quot;,system-ui,sans-serif;font-weight:{t["fonts"][role][1]}">{E(t["fonts"][role][0])} {t["fonts"][role][1]}</dd></div>' for role in ('display', 'body', 'mono'))
    ess = ''.join(f'<li>{E(e)}</li>' for e in t['essence'])
    return f'''
    <article class="plate" id="{t['id'].lower()}" data-id="{t['id']}" style="--p-bg:{k['bg']};--p-tint:{hexa(k['a1'], .13)};--p-ring:{hexa(k['a1'], .45)}">
      <div class="stage">
        <div class="screen">
          <canvas role="img" aria-label="Animated example for {t['id']} {E(t['name'])}: {E(t['feel'])}"></canvas>
          <span class="lvl-flag">Full</span>
        </div>
        <div class="beats" role="group" aria-label="Beats in this example"></div>
      </div>
      <div class="spec">
        <div class="col">
        <p class="slate">{t['id']} &middot; Family {t['family']} &middot; {E(FAMS[t['family']]['name'])}</p>
        <h3 style="font-family:&quot;{E(df)}&quot;,system-ui,sans-serif;font-weight:{dw}">{E(t['name'])}</h3>
        <p class="feel">{E(t['feel'])}</p>
        <ul class="badges"><li>Home: {E(t['home_register'])}</li><li class="{B2B[t['b2b']]}">B2B: {E(DIAL[t['b2b']])}</li></ul>
        <div><p class="sub">Essence words</p><ul class="essence">{ess}</ul></div>
        </div>
        <div class="col">
        <div><p class="sub">Palette</p><div class="swatches">{sw}</div></div>
        <div><p class="sub">Type</p><dl class="type">{ty}</dl></div>
        <p class="motion"><b>ease</b> {E(t['ease'])} &middot; <b>dur</b> {E(t['dur'])}</p>
        </div>
        <div class="col">
        <p class="board"><b>Boardroom:</b> {E(t['boardroom'])}</p>
        <div class="actions"><button type="button" data-copy="tokens">Copy tokens</button><button type="button" data-copy="seed">Copy prompt seed</button><span class="copied" aria-live="polite"></span></div>
        <details><summary>Show tokens</summary><pre><code>{E(tokens_css(t))}</code></pre></details>
        </div>
      </div>
    </article>'''


def build():
    index = '\n'.join(f'    <li><a href="#{t["id"].lower()}" style="--b:{t["tokens"]["bg"]};--c:{t["tokens"]["a1"]}"><i></i>{t["id"][3:]} {E(t["name"].title())}</a></li>' for t in THEMES)
    blocks = []
    for fk in sorted(FAMS):
        ps = ''.join(plate(t) for t in THEMES if t['family'] == fk)
        blocks.append(f'''
  <section data-fam-block="{fk}" aria-labelledby="fam-{fk}">
    <div class="fam-head"><p class="slate chev">Family {fk}</p><h2 id="fam-{fk}">{E(FAMS[fk]['name'])}</h2><p>{E(FAMS[fk]['blurb'])}</p></div>
    <div class="plates">{ps}
    </div>
  </section>''')
    scripts = '\n'.join((SRC / f).read_text(encoding='utf-8') for f in ORDER)
    page = (SRC / 'shell.html').read_text(encoding='utf-8')
    page = page.replace('{{FONTS}}', '\n'.join(faces())).replace('{{INDEX}}', index).replace('{{PLATES}}', ''.join(blocks)).replace('{{SCRIPTS}}', scripts)
    for k, v in (('BADGE', BADGE), ('VERSION', META['version']), ('RELEASED', META['released']), ('REPO', META['repo']), ('SITE', META['site'])):
        page = page.replace('{{' + k + '}}', v)
    OUT.parent.mkdir(exist_ok=True); OUT.write_text(page, encoding='utf-8')
    (OUT.parent / 'SOURCES.sha256').write_text(''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(ROOT).as_posix()}\n' for p in INPUTS))
    print(f'wrote {OUT.relative_to(ROOT)} {len(page.encode()) / 1024:.0f} KB')


if __name__ == '__main__':
    build()
