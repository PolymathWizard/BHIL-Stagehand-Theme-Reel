"""Shared frame, type and font embedding for the Stagehand figure kit (STC-01 to STC-10).

Non-stdlib (fontTools + brotli): figures embed subset woff2 so they render with exact type even through an <img> tag.
"""
import base64, io, json, math, os
from pathlib import Path
from xml.sax.saxutils import escape
from fontTools.ttLib import TTFont
from fontTools import subset as ftsub

ROOT = Path(__file__).resolve().parents[1]
FONTROOT = ROOT / 'reel' / 'node_modules' / '@fontsource'
OUTDIR = ROOT / 'docs' / 'assets' / 'figures' / 'svg'
# @fontsource packages: brand (newsreader, ibm-plex-mono, ibm-plex-sans) and the theme display faces
BRANDF = Path(os.environ.get('STC_FONTS', FONTROOT))
THEMEF = BRANDF

# BHIL Brand Guidelines v1.0
NAVY, INK, PAPER, P3 = '#0D1B2E', '#0A0A0A', '#FFFFFF', '#F3F3F0'
BLUE, BLUE2, BLUE3, BRIGHT = '#4FA3D1', '#2E80B0', '#1E3A5F', '#6CC0E8'
COPPER, STONE, SAGE = '#D97757', '#6B6258', '#4A8A6E'

FONTS = {  # key: (file, family, weight, style, fallback)
    'serif': (BRANDF / 'newsreader/files/newsreader-latin-400-normal.woff2', 'Newsreader', 400, 'normal', "Georgia, 'Times New Roman', serif"),
    'serifi': (BRANDF / 'newsreader/files/newsreader-latin-400-italic.woff2', 'Newsreader', 400, 'italic', "Georgia, 'Times New Roman', serif"),
    'mono': (BRANDF / 'ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2', 'IBM Plex Mono', 400, 'normal', "'Courier New', monospace"),
    'mono5': (BRANDF / 'ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2', 'IBM Plex Mono', 500, 'normal', "'Courier New', monospace"),
    'sans': (BRANDF / 'ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2', 'IBM Plex Sans', 400, 'normal', 'Arial, Helvetica, sans-serif'),
    'sans5': (BRANDF / 'ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2', 'IBM Plex Sans', 500, 'normal', 'Arial, Helvetica, sans-serif'),
}


def theme_font(family, weight):
    slug = family.lower().replace(' ', '-')
    key = f'tf-{slug}-{weight}'
    if key not in FONTS:
        FONTS[key] = (THEMEF / f'{slug}/files/{slug}-latin-{weight}-normal.woff2', family, weight, 'normal', 'Arial, sans-serif')
    return key


_tt = {}
def tt(key):
    if key not in _tt:
        _tt[key] = TTFont(str(FONTS[key][0]))
    return _tt[key]


def width(s, key, size, ls=0.0):
    f = tt(key); cmap = f.getBestCmap(); hm = f['hmtx']; upm = f['head'].unitsPerEm
    w = 0
    for ch in s:
        g = cmap.get(ord(ch)) or cmap.get(32)
        w += hm[g][0]
    return w * size / upm + ls * size * max(0, len(s) - 1)


def missing(s, key):
    cmap = tt(key).getBestCmap()
    return sorted({ch for ch in s if ord(ch) not in cmap and ch not in ' \n'})


def wrap(s, key, size, maxw, ls=0.0):
    out, cur = [], ''
    for word in s.split(' '):
        trial = (cur + ' ' + word).strip()
        if cur and width(trial, key, size, ls) > maxw:
            out.append(cur); cur = word
        else:
            cur = trial
    if cur:
        out.append(cur)
    return out


def fmt(v):
    return ('%.2f' % v).rstrip('0').rstrip('.') if isinstance(v, float) else str(v)


class Fig:
    def __init__(self, num, slug, eyebrow, title, dek, desc):
        self.num, self.slug, self.eyebrow, self.title, self.dek, self.desc = num, slug, eyebrow, title, dek, desc
        self.parts, self.css, self.used = [], [], {}
        self.id = f'STC-{num:02d}'

    # primitives
    def add(self, s):
        self.parts.append(s)

    def T(self, x, y, s, key='mono', size=14, fill=P3, ls=0.0, anchor='start', op=None, cls=None, extra=''):
        self.used.setdefault(key, set()).update(s)
        a = f' text-anchor="{anchor}"' if anchor != 'start' else ''
        o = f' opacity="{fmt(op)}"' if op is not None else ''
        l = f' letter-spacing="{fmt(ls * size)}"' if ls else ''
        self.parts.append(f'<text x="{fmt(x)}" y="{fmt(y)}" class="{self.fcls(key)}{(" " + cls) if cls else ""}" font-size="{fmt(size)}" fill="{fill}"{l}{a}{o}{extra}>{escape(s)}</text>')
        return width(s, key, size, ls)

    def lines(self, x, y, s, key='sans', size=15, fill=P3, maxw=400, lh=None, op=None, ls=0.0):
        lh = lh or size * 1.35
        ls_ = wrap(s, key, size, maxw, ls)
        for i, ln in enumerate(ls_):
            self.T(x, y + i * lh, ln, key, size, fill, ls=ls, op=op)
        return y + (len(ls_) - 1) * lh

    def fcls(self, key):
        return 'f-' + key

    def R(self, x, y, w, h, fill='none', stroke=None, sw=1, op=None, cls=None, extra=''):
        s = f' stroke="{stroke}" stroke-width="{fmt(sw)}"' if stroke else ''
        o = f' opacity="{fmt(op)}"' if op is not None else ''
        c = f' class="{cls}"' if cls else ''
        self.parts.append(f'<rect x="{fmt(x)}" y="{fmt(y)}" width="{fmt(w)}" height="{fmt(h)}" fill="{fill}"{s}{o}{c}{extra}/>')

    def L(self, x1, y1, x2, y2, stroke=BLUE3, sw=1, dash=None, op=None, cls=None, extra=''):
        d = f' stroke-dasharray="{dash}"' if dash else ''
        o = f' opacity="{fmt(op)}"' if op is not None else ''
        c = f' class="{cls}"' if cls else ''
        self.parts.append(f'<line x1="{fmt(x1)}" y1="{fmt(y1)}" x2="{fmt(x2)}" y2="{fmt(y2)}" stroke="{stroke}" stroke-width="{fmt(sw)}"{d}{o}{c}{extra}/>')

    def C(self, cx, cy, r, fill, op=None, cls=None, extra=''):
        o = f' opacity="{fmt(op)}"' if op is not None else ''
        c = f' class="{cls}"' if cls else ''
        self.parts.append(f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(r)}" fill="{fill}"{o}{c}{extra}/>')

    def P(self, d, fill='none', stroke=None, sw=1, op=None, cls=None, extra=''):
        s = f' stroke="{stroke}" stroke-width="{fmt(sw)}"' if stroke else ''
        o = f' opacity="{fmt(op)}"' if op is not None else ''
        c = f' class="{cls}"' if cls else ''
        self.parts.append(f'<path d="{d}" fill="{fill}"{s}{o}{c}{extra}/>')

    def chevron(self, x, y, s=10, fill=BLUE):
        self.P(f'M{fmt(x)} {fmt(y - s / 2)}L{fmt(x + s * .75)} {fmt(y)}L{fmt(x)} {fmt(y + s / 2)}Z', fill)

    def xmark(self, x, y, s=10, col=COPPER, sw=2):
        h = s / 2
        self.P(f'M{fmt(x - h)} {fmt(y - h)}L{fmt(x + h)} {fmt(y + h)}M{fmt(x + h)} {fmt(y - h)}L{fmt(x - h)} {fmt(y + h)}', stroke=col, sw=sw)

    def tick(self, x, y, s=10, col=BRIGHT, sw=2):
        self.P(f'M{fmt(x - s / 2)} {fmt(y)}L{fmt(x - s / 8)} {fmt(y + s * .4)}L{fmt(x + s / 2)} {fmt(y - s * .45)}', stroke=col, sw=sw)

    def stepper(self, n, cycle):
        """Keyframes that show item i during slot i of n (base opacity 0)."""
        frac = 100.0 / n
        self.css.append(f'@keyframes hl{n}{{0%,{fmt(frac - .01)}%{{opacity:1}}{fmt(frac)}%,100%{{opacity:0}}}}')
        return lambda i: f' style="animation:hl{n} {fmt(cycle)}s step-end infinite;animation-delay:{fmt(i * cycle / n)}s"'

    # frame
    def frame(self):
        top = []
        top.append(f'<rect width="1600" height="900" fill="{NAVY}"/>')
        top.append(f'<rect width="1600" height="56" fill="{INK}"/>')
        top.append(f'<line x1="0" y1="56.5" x2="1600" y2="56.5" stroke="{BLUE3}" stroke-width="1"/>')
        self.parts, body = [], self.parts
        self.T(72, 34, 'BARRY HURD INTELLIGENCE LAB · STAGEHAND', 'mono5', 13, BRIGHT, ls=.14)
        self.T(1528, 34, f'REF STC V1.0 / REEL V5 · FIG {self.id}', 'mono', 13, P3, ls=.14, anchor='end', op=.72)
        self.chevron(72, 107, 11, BLUE)
        self.T(92, 112, self.eyebrow, 'mono5', 15, BLUE, ls=.16)
        self.T(72, 176, self.title, 'serif', 52, PAPER)
        self.T(72, 216, self.dek, 'serifi', 22, P3, op=.8)
        head = self.parts
        self.parts = []
        self.L(72, 846.5, 1528, 846.5, BLUE3)
        self.T(72, 876, f'BHIL · STAGEHAND THEME CODEX · FIG {self.id}', 'mono', 12, P3, ls=.14, op=.62)
        self.T(1528, 876, 'BARRYHURD.COM', 'mono', 12, P3, ls=.14, anchor='end', op=.62)
        foot = self.parts
        return top + head + body + foot

    def fontface(self):
        out = []
        for key, chars in sorted(self.used.items()):
            path, fam, w, st, _ = FONTS[key]
            f = TTFont(str(path))
            opts = ftsub.Options(); opts.flavor = 'woff2'; opts.layout_features = ['kern', 'liga', 'calt']; opts.name_IDs = []; opts.notdef_outline = True
            sub = ftsub.Subsetter(opts); sub.populate(text=''.join(sorted(chars)) + ' '); sub.subset(f)
            buf = io.BytesIO(); f.flavor = 'woff2'; f.save(buf)
            b64 = base64.b64encode(buf.getvalue()).decode()
            out.append(f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(data:font/woff2;base64,{b64}) format('woff2')}}")
        return out

    def render(self):
        frame = self.frame()
        classes = []
        for key in sorted(self.used):
            _, fam, w, st, fb = FONTS[key]
            classes.append(f".f-{key}{{font-family:'{fam}',{fb};font-weight:{w};font-style:{st}}}")
        css = '\n'.join(self.fontface() + classes + self.css + [
            '.am{opacity:0}',
            '@media (prefers-reduced-motion: reduce){*{animation:none!important}.am{display:none}}'])
        title = f'{self.id} · {self.title}'
        return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900" role="img" aria-labelledby="t d">\n'
                f'<title id="t">{escape(title)}</title>\n<desc id="d">{escape(self.desc)}</desc>\n'
                f'<style>\n{css}\n</style>\n' + '\n'.join(frame) + '\n</svg>\n')

    def save(self):
        OUTDIR.mkdir(parents=True, exist_ok=True)
        out = OUTDIR / f'stc-{self.num:02d}-{self.slug}.svg'
        out.write_text(self.render(), encoding='utf-8')
        return out
