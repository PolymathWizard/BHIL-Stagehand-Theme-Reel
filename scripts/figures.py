"""Generate the ten Stagehand figures (STC-01 to STC-10) from canon/*.json and the reel scenes.

    python3 scripts/figures.py && python3 scripts/render_figures.py

Writes docs/assets/figures/svg/*.svg and INPUTS.sha256; the validator fails when canon or these
scripts change without a rebuild.
"""
import hashlib, json, math, sys
from figlib import *
sys.path.insert(0, str(ROOT / 'scripts'))
from build_derived import beats_from_scenes

_C = lambda n: json.loads((ROOT / 'canon' / n).read_text(encoding='utf-8'))
_B = beats_from_scenes(ROOT)
TH = [{'id': t['id'], 'name': t['name'], 'fam': t['family'], 'home': t['home_register'], 'b2b': t['b2b'], 'tok': t['tokens'],
       'fonts': [t['fonts'][r] for r in ('display', 'body', 'mono')], 'ease': t['ease'], 'dur': t['dur'], 'essence': t['essence'],
       'beats': _B[t['id']]} for t in _C('themes.json')['themes']]
FAM = {f['id']: f['name'] for f in _C('families.json')['families']}
S = _C('sample.json')
INPUTS = ['canon/themes.json', 'canon/families.json', 'canon/sample.json', 'canon/brand.json', 'scripts/figures.py', 'scripts/figlib.py',
          'reel/src/scenes-a.js', 'reel/src/scenes-b.js', 'reel/src/scenes-c.js', 'reel/src/scenes-d.js']


def inputs_digest(root=ROOT):
    return ''.join(f'{hashlib.sha256((root / p).read_bytes()).hexdigest()}  {p}\n' for p in INPUTS)
FIT = {'native': ('NATIVE AT BOARDROOM', SAGE, 'RUNS AT BOARDROOM'), 'board': ('BOARDROOM VERSION', BLUE, 'B2B VERSION'),
       'news': ('NEWS DESK ONLY', BLUE2, 'NEWS DESK'), 'temp': ('TEMPERED MAX', STONE, 'TEMPERED MAX'),
       'avoid': ('AVOID FOR B2B', COPPER, 'NOT FOR B2B')}
SLOT = {'S1': ('HERO SIGNATURE', BRIGHT, NAVY), 'S2': ('SECTION TRANSITIONS', BLUE2, PAPER), 'S3': ('AMBIENT LAYER', STONE, PAPER),
        'S4': ('DATA SKIN', SAGE, PAPER), 'S5': ('INTERACTION AND FOCUS', P3, NAVY)}


def fit_text(f, x, y, s, key, size, maxw, fill, ls=0.0, op=None, anchor='start'):
    while width(s, key, size, ls) > maxw and size > 8:
        size -= .5
    return f.T(x, y, s, key, size, fill, ls=ls, op=op, anchor=anchor)


def hexrgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def desat(h, k=.2):
    r, g, b = hexrgb(h); y = .299 * r + .587 * g + .114 * b
    return '#%02X%02X%02X' % tuple(round(c + (y - c) * k) for c in (r, g, b))


# ── STC-01 ───────────────────────────────────────────────────────────────
def fig01():
    f = Fig(1, 'masthead', 'STAGEHAND THEME CODEX · STC V1.0', 'Twenty themes. One stage.',
            'Motion themes that page, reel and deck agents can wear, at three volumes.',
            'Masthead for the Stagehand Theme Codex. Twenty motion themes in five families, each tile showing its codename, five-color palette, home register and B2B fit. Counts: 20 themes, 5 families, 3 intensity levels, 5 web slots, 1 sample dataset, 0 outside requests.')
    counts = [(str(len(TH)), 'THEMES'), (str(len(FAM)), 'FAMILIES'), ('3', 'INTENSITY LEVELS'), ('5', 'WEB SLOTS'), ('1', 'SAMPLE DATASET'), ('0', 'OUTSIDE REQUESTS')]
    for i, (n, l) in enumerate(counts):
        x, y = 72 + (i % 2) * 232, 262 + (i // 2) * 122
        f.L(x, y + .5, x + 208, y + .5, BLUE3)
        f.T(x, y + 74, n, 'serif', 72, PAPER)
        f.T(x, y + 102, l, 'mono5', 13, BLUE, ls=.14)
    f.lines(72, 650, 'Inspired by genres, never copied from them. Public copy uses codenames only, and every number on screen is a labeled placeholder.', 'sans', 16, P3, maxw=440, lh=23, op=.82)
    # constellation: stepped three-band falloff from the lower-left corner, no gradient
    f.css.append('@keyframes tw{0%,100%{opacity:.25}50%{opacity:1}}')
    k = 0
    for r in range(5):
        for c in range(25):
            x, y = 72 + c * 18, 742 + r * 18
            d = math.hypot(x - 72, y - 814)
            op = .9 if d < 150 else .5 if d < 300 else .2
            tw = (c * 7 + r * 13) % 11 == 0
            f.C(x, y, 1.7, BLUE, op=op, extra=(f' style="animation:tw 6s ease-in-out infinite;animation-delay:{fmt((k % 6) * .9)}s"' if tw else ''))
            k += tw
    st = f.stepper(20, 24)
    for r, fk in enumerate(sorted(FAM)):
        y = 252 + r * 116
        f.T(560, y + 40, fk, 'serif', 36, BRIGHT)
        words = FAM[fk].upper().split(' ')
        l1 = ' '.join(words[:2]) if len(words) > 2 else words[0]; l2 = ' '.join(words[2:]) if len(words) > 2 else ' '.join(words[1:])
        f.T(560, y + 64, l1, 'mono5', 11, P3, ls=.12, op=.78); f.T(560, y + 80, l2, 'mono5', 11, P3, ls=.12, op=.78)
        for c, t in enumerate([t for t in TH if t['fam'] == fk]):
            x, tk = 668 + c * 174, t['tok']
            f.R(x, y, 164, 100, tk['bg'], BLUE3)
            for j, a in enumerate(('a1', 'a2', 'a3')):
                f.R(x + j * 164 / 3, y, 164 / 3, 6, tk[a])
            f.T(x + 12, y + 32, t['id'], 'mono5', 11, tk['a1'], ls=.1)
            fit_text(f, x + 12, y + 58, t['name'], 'mono5', 13, 140, tk['ink'], ls=.04)
            fit_text(f, x + 12, y + 84, f"{t['home'].upper()} · {FIT[t['b2b']][2]}", 'mono', 10.5, 140, tk['ink'], ls=.04, op=.66)
            f.R(x - 4, y - 4, 172, 108, 'none', BRIGHT, 2, cls='am', extra=st(TH.index(t)))
    return f


# ── STC-02 ───────────────────────────────────────────────────────────────
def fig02():
    f = Fig(2, 'families-and-fit', '02 · ROSTER AND B2B FIT', 'Five families. Each knows its room.',
            'Home register says where a theme runs at full strength; B2B fit says whether it survives the Boardroom dial.',
            'Twenty Stagehand themes arranged in five families (Digital Frontier, Retro Signal, Epic Cinema, Worlds and Maps, Auteur and Title Design) with home register and B2B fit for each, plus a stacked bar of B2B fit across all twenty.')
    cw, gap = (1456 - 4 * 16) / 5, 16
    st = f.stepper(5, 12.5)
    for k, fk in enumerate(sorted(FAM)):
        x = 72 + k * (cw + gap); ts = [t for t in TH if t['fam'] == fk]
        f.T(x, 298, fk, 'serif', 40, BRIGHT)
        fit_text(f, x + 38, 286, FAM[fk], 'serif', 22, cw - 40, PAPER)
        f.T(x + 38, 310, f"{ts[0]['id']} TO {ts[-1]['id']}", 'mono', 12, BLUE, ls=.12)
        f.L(x, 330.5, x + cw, 330.5, BLUE3)
        for j, t in enumerate(ts):
            y = 344 + j * 77
            fit_text(f, x, y + 24, t['name'], 'mono5', 16, cw, PAPER, ls=.03)
            f.T(x, y + 43, f"Home register: {t['home']}", 'sans', 14, P3, op=.72)
            lab, col, _ = FIT[t['b2b']]
            f.R(x, y + 53, 11, 11, col)
            f.T(x + 18, y + 63, lab, 'mono5', 12, P3, ls=.08)
            f.L(x, y + 72.5, x + cw, y + 72.5, BLUE3, op=.6)
        f.R(x - 10, 246, cw + 20, 484, 'none', BRIGHT, 2, cls='am', extra=st(k))
    order = ['native', 'board', 'news', 'temp', 'avoid']; cnt = {o: sum(t['b2b'] == o for t in TH) for o in order}
    long_ = {'native': 'RUN AT BOARDROOM AS IS', 'board': 'HAVE A BOARDROOM VERSION', 'news': 'NEWS DESK ONLY', 'temp': 'TEMPERED IS THE CEILING', 'avoid': 'NEVER PITCHED FOR B2B'}
    f.T(72, 742, f'B2B FIT ACROSS ALL {len(TH)}', 'mono5', 12, BLUE, ls=.14)
    x = 72.0
    for o in order:
        w = cnt[o] / len(TH) * 1456
        f.R(x, 754, w - 2, 24, FIT[o][1])
        f.T(x + 10, 771, str(cnt[o]), 'mono5', 14, NAVY if o in ('board',) else PAPER)
        x += w
    for k, o in enumerate(order):
        x = 72 + k * (cw + gap)
        f.R(x, 798, 11, 11, FIT[o][1]); f.T(x + 18, 808, f'{cnt[o]} {long_[o]}', 'mono5', 12, P3, ls=.06)
    return f


# ── STC-03 ───────────────────────────────────────────────────────────────
def bez(t, a, b):
    return 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3


def ease_at(x, p):
    lo, hi = 0.0, 1.0
    for _ in range(40):
        m = (lo + hi) / 2
        (lo, hi) = (m, hi) if bez(m, p[0], p[2]) < x else (lo, m)
    return bez((lo + hi) / 2, p[1], p[3])


def fig03():
    t = next(t for t in TH if t['id'] == 'TX-03'); tk = t['tok']
    f = Fig(3, 'card-anatomy', '03 · THEME CARD ANATOMY', 'Every card carries the same eleven fields.',
            f"Worked example: {t['id']} {t['name']}, a theme that runs at Boardroom as is.",
            f"Anatomy of a Stagehand theme card using {t['id']} {t['name']}: five color tokens with hex values, the type trio, the ease curve and duration, and essence words, beside a table of the eleven card fields, what each gives an agent, and the pipeline stage that uses it.")
    dkey, bkey, mkey = (theme_font(n, w) for n, w in t['fonts'])
    px, py, pw, ph = 72, 252, 640, 570
    f.R(px, py, pw, ph, tk['bg'], BLUE3)
    x0 = px + 28
    f.T(x0, py + 40, f"{t['id']} · B2B NATIVE · HOME REGISTER {t['home'].upper()}", 'mono5', 12, tk['a1'], ls=.12)
    f.T(x0, py + 88, t['name'], dkey, 44, tk['ink'], ls=.04)
    roles = [('bg', '--tx-bg'), ('ink', '--tx-ink'), ('a1', '--tx-a1'), ('a2', '--tx-a2'), ('a3', '--tx-a3')]
    for i, (r, lab) in enumerate(roles):
        x = x0 + i * 117
        f.R(x, py + 118, 104, 58, tk[r], tk['ink'] if r == 'bg' else None, 1)
        f.T(x, py + 198, lab, 'mono', 11.5, tk['ink'], op=.8)
        f.T(x, py + 215, tk[r].upper(), 'mono5', 11.5, tk['ink'])
    f.L(x0, py + 236.5, px + pw - 28, py + 236.5, tk['ink'], op=.18)
    trio = [(dkey, f"{t['fonts'][0][0]} {t['fonts'][0][1]}", 26, 'DISPLAY'), (bkey, f"{t['fonts'][1][0]} {t['fonts'][1][1]}: body copy reads here", 18, 'BODY'), (mkey, f"{t['fonts'][2][0]} {t['fonts'][2][1]}: 87.4% · N4 91", 16, 'MONO')]
    for i, (k, s, sz, lab) in enumerate(trio):
        y = py + 274 + i * 36
        f.T(x0, y, s, k, sz, tk['ink'])
        f.T(px + pw - 28, y, lab, 'mono5', 11, tk['a1'], ls=.14, anchor='end')
    f.L(x0, py + 362.5, px + pw - 28, py + 362.5, tk['ink'], op=.18)
    p = [float(v) for v in t['ease'][t['ease'].index('(') + 1:-1].split(',')]
    f.T(x0, py + 390, f"EASE {t['ease']} · {t['dur'].replace('ms', ' MS')}", 'mono5', 11.5, tk['a1'], ls=.06)
    gx, gy, gw, gh = x0 + 6, py + 540, 236, 128
    f.L(gx, gy, gx + gw, gy, tk['ink'], op=.35); f.L(gx, gy, gx, gy - gh, tk['ink'], op=.35)
    f.L(gx, gy - gh, gx + gw, gy - gh, tk['ink'], op=.12, dash='3 4')
    pts = [(gx + i / 48 * gw, gy - ease_at(i / 48, p) * gh) for i in range(49)]
    f.P('M' + 'L'.join(f'{fmt(a)} {fmt(b)}' for a, b in pts), stroke=tk['a1'], sw=2.4)
    f.T(gx, gy + 18, 'TIME', 'mono', 10, tk['ink'], ls=.12, op=.6); f.T(gx + gw, gy + 18, '450 MS', 'mono', 10, tk['ink'], ls=.12, op=.6, anchor='end')
    f.T(gx - 6, gy - gh + 4, '1', 'mono', 10, tk['ink'], op=.6, anchor='end')
    # animated dot plays the ease at quarter speed; its static state is the end of the curve
    frames = []
    for i in range(25):
        u = i / 24; frames.append(f'{fmt(u * 70)}%{{transform:translate({fmt(u * gw)}px,{fmt(-ease_at(u, p) * gh)}px)}}')
    f.css.append('@keyframes ez{' + ''.join(frames) + f'100%{{transform:translate({fmt(gw)}px,{fmt(-gh)}px)}}}}')
    f.css.append('@keyframes ezy{' + ''.join(f'{fmt(i / 24 * 70)}%{{transform:translateY({fmt(-ease_at(i / 24, p) * gh)}px)}}' for i in range(25)) + f'100%{{transform:translateY({fmt(-gh)}px)}}}}')
    f.css.append(f'.ezd{{transform:translate({fmt(gw)}px,{fmt(-gh)}px);animation:ez 2.6s linear infinite}}.ezy{{transform:translateY({fmt(-gh)}px);animation:ezy 2.6s linear infinite}}')
    f.C(gx, gy, 5.5, tk['a2'], cls='ezd')
    f.R(gx - 10, gy - 2, 6, 4, tk['a2'], cls='ezy')
    f.T(x0 + 286, py + ph - 14, 'THE DOT PLAYS THE EASE AT QUARTER SPEED', 'mono', 10, tk['ink'], ls=.1, op=.6)
    ex = x0 + 286
    f.T(ex, py + 412, 'ESSENCE WORDS', 'mono5', 11.5, tk['a1'], ls=.12)
    cx, cy = ex, py + 428
    for wd in t['essence']:
        w = width(wd, bkey, 15) + 24
        if cx + w > px + pw - 28:
            cx, cy = ex, cy + 38
        f.R(cx, cy, w, 28, 'none', tk['a1'], 1, op=.7)
        f.T(cx + 12, cy + 19, wd, bkey, 15, tk['ink'])
        cx += w + 8
    # field table
    rows = [('Tokens', 'Paste-ready --tx-* CSS custom properties', 'C'), ('Essence words', 'Vocabulary for the U1 fit test', 'U1, U2'),
            ('Look', 'Palette roles, type trio, texture, light, composition', 'R'), ('Motion grammar', 'Eases, durations, signature transitions, camera', 'R, E'),
            ('Web slot map', 'S1 to S5 fills, each with a build tier', 'E'), ('Video', 'Opener, cut grammar, pacing, sound bed', 'VIDEO'),
            ('Data skin', 'How charts, numbers and labels look', 'E (S4)'), ('Boardroom translation', 'The B2B version in one line', 'R'),
            ('Homage guardrails', 'Theme-specific off-limits list', 'T'), ('Ledger proximity', 'Shipped properties it sits near', 'U3'),
            ('Prompt seed', 'One line for a concept or orchestration prompt', 'U2')]
    tx = 752
    f.T(tx, 272, 'FIELD', 'mono5', 12, BLUE, ls=.14); f.T(tx + 238, 272, 'WHAT IT GIVES THE AGENT', 'mono5', 12, BLUE, ls=.14); f.T(1528, 272, 'STAGE', 'mono5', 12, BLUE, ls=.14, anchor='end')
    f.L(tx, 284.5, 1528, 284.5, BLUE3)
    st = f.stepper(len(rows), 17.6)
    for i, (a, b, c) in enumerate(rows):
        y = 285 + i * 48
        f.R(tx - 8, y + 1, 1528 - tx + 16, 46, BLUE, op=None, cls='am', extra=st(i) + ' fill-opacity=".14"')
        f.T(tx, y + 31, a, 'serif', 21, PAPER)
        fit_text(f, tx + 238, y + 30, b, 'sans', 15, 450, P3, op=.82)
        f.T(1528, y + 30, c, 'mono5', 13, BRIGHT, ls=.06, anchor='end')
        f.L(tx, y + 48.5, 1528, y + 48.5, BLUE3, op=.55)
    return f


# ── STC-04 ───────────────────────────────────────────────────────────────
def fig04():
    f = Fig(4, 'slots-and-beats', '04 · WEB SLOTS AND REEL BEATS', 'Five slots on the page. Twenty loops on the reel.',
            'Each reel beat demonstrates one web slot, so the reel doubles as a working slot map.',
            'Left: the five Stagehand web slots (S1 hero signature, S2 section transitions, S3 ambient layer, S4 data skin, S5 interaction and focus) with example fills from TX-01 VECTOR GRID. Right: a timeline of all twenty reel loops, beat by beat, colored by slot, with loop lengths from 21 to 26.3 seconds and every S4 data beat at 9.5 seconds.')
    ex = {'S1': 'A grid floor scrolls to the horizon while a light trail draws the headline.', 'S2': 'Light trails link section points at right angles.',
          'S3': 'Horizon glow and 2% scanlines under everything.', 'S4': 'Bars become light walls; lines leave a fading wake.', 'S5': 'Neon focus rings with circuit-trace corners.'}
    f.T(72, 272, 'THE FIVE WEB SLOTS · FILLS FROM TX-01', 'mono5', 12, BLUE, ls=.14)
    f.L(72, 284.5, 520, 284.5, BLUE3)
    for k, sl in enumerate(['S1', 'S2', 'S3', 'S4', 'S5']):
        y = 300 + k * 104; nm, col, _ = SLOT[sl]
        f.R(72, y + 4, 14, 14, col)
        f.T(98, y + 19, sl, 'serif', 26, PAPER)
        f.T(146, y + 16, nm, 'mono5', 13, BRIGHT, ls=.12)
        f.lines(146, y + 42, ex[sl], 'sans', 15, P3, maxw=372, lh=21, op=.82)
    x0, lab, sc = 572, 200, 27.0
    bx = x0 + lab + 8
    f.T(x0, 272, 'THE REEL · TWENTY LOOPS, BEAT BY BEAT', 'mono5', 12, BLUE, ls=.14)
    f.L(x0, 284.5, 1528, 284.5, BLUE3)
    tots = []
    for r, t in enumerate(TH):
        y = 298 + r * 24
        f.T(x0, y + 12, t['id'], 'mono5', 11.5, BLUE, ls=.04)
        fit_text(f, x0 + 50, y + 12, t['name'], 'mono', 11.5, lab - 54, P3, op=.85)
        acc = 0.0
        for sl, _, d in t['beats']:
            nm, col, tc = SLOT[sl]; w = d * sc
            f.R(bx + acc * sc, y, w - 2, 14, col)
            if w > 30:
                f.T(bx + acc * sc + 5, y + 11, sl, 'mono5', 10, tc)
            acc += d
        f.R(bx, y + 16, acc * sc - 2, 2, STONE)
        f.T(bx + acc * sc + 6, y + 12, fmt(round(acc, 1)), 'mono', 10.5, P3, op=.62)
        tots.append(acc)
    ay = 298 + 20 * 24 + 6
    f.L(bx, ay + .5, bx + 27 * sc, ay + .5, BLUE3)
    for s_ in range(0, 28, 5):
        f.L(bx + s_ * sc, ay, bx + s_ * sc, ay + 6, BLUE3)
        f.T(bx + s_ * sc, ay + 22, f'{s_} S', 'mono', 10.5, P3, op=.62, anchor='middle')
    f.T(x0, ay + 50, f'LOOPS RUN {fmt(min(tots))} TO {fmt(round(max(tots), 1))} S · EVERY S4 RUNS 9.5 S · THE THIN STONE LINE IS S3, ALWAYS ON', 'mono5', 11.5, P3, ls=.08, op=.75)
    f.css.append(f'@keyframes ph{{from{{transform:translateX(0)}}to{{transform:translateX({fmt(27 * sc)}px)}}}}')
    f.L(bx, 292, bx, ay, BRIGHT, 1.5, cls='am', extra=' style="opacity:1;animation:ph 27s linear infinite"')
    return f


# ── STC-05 ───────────────────────────────────────────────────────────────
def spec_tx01(f, x, y, w, h, L):
    t = TH[0]; tk = t['tok']
    bg = '#06101E' if L == 2 else tk['bg']
    f.add(f'<clipPath id="sp{L}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath><g clip-path="url(#sp{L})">')
    f.R(x, y, w, h, bg)
    hz = y + 62; vp = x + w / 2
    gcol = tk['a1'] if L == 2 else (tk['a3'] if L == 0 else desat(tk['a3']))
    gop = [.75, .5, .1][L]
    for k in range(6):
        yy = hz + (h - 62) * (k / 6) ** 1.6
        f.L(x, yy, x + w, yy, gcol, 1, op=gop)
    for k in range(-8, 9):
        f.L(vp, hz, vp + k * 60, y + h, gcol, 1, op=gop)
    f.L(x, hz, x + w, hz, tk['a1'] if L < 2 else tk['a1'], 1.2, op=[.9, .6, .3][L])
    base = y + h - 12
    for i, v in enumerate(S['bars']):
        bxx = x + 70 + i * 40; bh = v / 100 * 86; lead = i == 3
        col = tk['a2'] if lead and L < 2 else tk['a1']
        if L == 1:
            col = desat(col)
        if L == 0:
            f.R(bxx - 3, base - bh - 3, 30, bh + 3, 'none', col, 6, op=.22)
        if L == 2:
            if lead:
                f.R(bxx, base - bh, 24, bh, tk['a1'], tk['a1'], 1, op=.75)
            else:
                f.R(bxx, base - bh, 24, bh, 'none', tk['ink'], 1, op=.4)
        else:
            f.R(bxx, base - bh, 24, bh, col, None, op=.22)
            f.R(bxx, base - bh, 24, bh, 'none', col, 1.2)
            f.L(bxx, base - bh, bxx + 24, base - bh, tk['ink'] if not lead else '#FFE2CC', 2)
    if L == 0:
        for yy in range(int(y) + 2, int(y + h), 3):
            f.L(x, yy + .5, x + w, yy + .5, '#000000', 1, op=.16)
    f.T(x + 10, y + 18, f"TX-01 VECTOR GRID · {['FULL', 'TEMPERED', 'BOARDROOM'][L]}", 'mono5', 10.5, tk['ink'], ls=.1, op=.75)
    f.add('</g>')
    f.R(x, y, w, h, 'none', BLUE3)


def fig05():
    f = Fig(5, 'intensity-dial', '05 · THE INTENSITY DIAL', 'One theme. Three volumes.',
            'Intensity is set once per property from its register. The theme keeps its identity; only the volume changes.',
            'The Stagehand intensity dial: Full for creative and community work, Tempered for editorial and civic work, Boardroom for B2B intelligence and the BHIL default. Each level shows what stays, what goes and its timing, with a TX-01 VECTOR GRID specimen at that level and the reel engine multipliers for bloom, rays, halo, chroma, lens dirt, grain and persistence.')
    cx, cy, R = 212, 400, 110
    f.P(f'M{cx - R} {cy}A{R} {R} 0 0 1 {cx + R} {cy}', stroke=BLUE3, sw=8)
    labs = [(-55, 'FULL', 'end'), (0, 'TEMPERED', 'middle'), (55, 'BOARDROOM', 'start')]
    for a, l, an in labs:
        r = math.radians(a)
        f.L(cx + math.sin(r) * (R - 14), cy - math.cos(r) * (R - 14), cx + math.sin(r) * (R + 6), cy - math.cos(r) * (R + 6), BLUE, 2)
        lx, ly = cx + math.sin(r) * (R + 22), cy - math.cos(r) * (R + 22)
        f.T(lx + (-4 if an == 'end' else 4 if an == 'start' else 0), ly + (4 if an != 'middle' else -2), l, 'mono5', 12, P3, ls=.12, anchor=an)
    f.css.append(f'.ndl{{transform-box:view-box;transform-origin:{cx}px {cy}px;transform:rotate(55deg);animation:ndl 12s ease-in-out infinite}}'
                 '@keyframes ndl{0%,27%{transform:rotate(55deg)}33%,60%{transform:rotate(-55deg)}66%,94%{transform:rotate(0deg)}100%{transform:rotate(55deg)}}')
    f.add(f'<g class="ndl"><line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy - R + 18}" stroke="{BRIGHT}" stroke-width="3"/></g>')
    f.C(cx, cy, 7, BRIGHT)
    f.T(cx, cy + 34, 'BHIL DEFAULT: BOARDROOM', 'mono5', 11.5, BRIGHT, ls=.12, anchor='middle')
    f.T(72, 482, 'REEL ENGINE MULTIPLIERS', 'mono5', 12, BLUE, ls=.14)
    hx = [244, 300, 356]
    for i, h in enumerate(['F', 'T', 'B']):
        f.T(hx[i], 506, h, 'mono5', 12, P3, anchor='end', op=.7)
    f.L(72, 514.5, 372, 514.5, BLUE3)
    gates = [('BLOOM', '1.0', '.80', '.45'), ('LIGHT RAYS', '1.0', '.80', '.40'), ('HALO', '1.0', '.80', '.50'), ('CHROMA', '1.0', '.60', 'OFF'),
             ('LENS DIRT', '1.0', '.70', 'OFF'), ('GRAIN', '1.0', '1.0', '.50'), ('PERSISTENCE', '1.0', '.60', 'OFF'), ('LOUD CUTS', 'ON', 'FADE', 'OFF')]
    for i, g in enumerate(gates):
        y = 540 + i * 32
        f.T(72, y, g[0], 'mono5', 12.5, P3, ls=.06)
        for j in range(3):
            v = g[j + 1]
            f.T(hx[j], y, v, 'mono5', 12.5, COPPER if v == 'OFF' else PAPER, anchor='end')
        f.L(72, y + 11.5, 372, y + 11.5, BLUE3, op=.5)
    cols = [('Full', 'CREATIVE / COMMUNITY', 'Everything on the card: glitch, chroma split, stutter, flicker, stepped frames, cursor effects.', 'Nothing beyond the hard gates.', "The card's own timing."),
            ('Tempered', 'EDITORIAL / CIVIC', 'Palette, type trio, transition grammar, the S1 signature, the ambient layer.', 'Glitch, chroma and stutter cut to accents of 150 ms or less, one per section. Saturation down 20%. No cursor effects.', 'Card timing × 1.25.'),
            ('Boardroom', 'B2B INTELLIGENCE · BHIL DEFAULT', 'Palette darkened or neutralized, type trio, one transition grammar, the S1 at low contrast.', 'All glitch, flicker, stutter, chroma split and stepped frames. Particles above 30. WebGL fluid.', '600 to 1200 ms, power3.out or expo.out.')]
    f.css.append('@keyframes c0{0%,30%{opacity:0}33%,63%{opacity:1}66%,100%{opacity:0}}@keyframes c1{0%,63%{opacity:0}66%,96%{opacity:1}99%,100%{opacity:0}}@keyframes c2{0%,29%{opacity:1}30%,96%{opacity:0}99%,100%{opacity:1}}')
    for k, (nm, reg, stay, go, tim) in enumerate(cols):
        x = 412 + k * 378
        f.T(x, 290, nm, 'serif', 32, PAPER)
        f.T(x, 314, reg, 'mono5', 12, BLUE, ls=.12)
        spec_tx01(f, x, 330, 360, 150, k)
        f.T(x, 512, 'STAYS', 'mono5', 12, BLUE, ls=.14)
        e = f.lines(x, 534, stay, 'sans', 15, P3, maxw=360, lh=20, op=.85)
        f.T(x, e + 34, 'GOES', 'mono5', 12, COPPER, ls=.14)
        e = f.lines(x, e + 56, go, 'sans', 15, P3, maxw=360, lh=20, op=.85)
        f.T(x, 736, 'TIMING', 'mono5', 12, BLUE, ls=.14)
        f.T(x, 758, tim, 'sans', 15, P3, op=.85)
        f.R(x - 12, 258, 384, 516, 'none', BRIGHT, 2, cls='am', extra=f' style="animation:c{k} 12s step-end infinite"')
    f.T(412, 808, 'One chapter may step up one level for a deliberate beat, declared in the manifest. The dial never loosens a hard gate.', 'serifi', 19, P3, op=.8)
    return f


# ── STC-06 ───────────────────────────────────────────────────────────────
def fig06():
    f = Fig(6, 'film-pipeline', '06 · THE REEL ENGINE', 'Sixteen passes make one frame.',
            "The reel's film pipeline in render order, with what each intensity level turns down.",
            'The Stagehand reel render pipeline in order: scene draw, fx and sheen, persistence, focus pull, bloom, halo, light rays, lens dirt, grade, chroma, grain, tilt-shift, overlays, transition, letterbox and beat chips, with the level gates on each pass. Below: the scene API, the quality governor and the zero-request build.')
    f.R(72, 252, 1456, 322, INK, BLUE3)
    f.T(96, 282, 'RENDER ORDER · ONE FRAME · T = FULL, B = BOARDROOM', 'mono5', 12, BLUE, ls=.14)
    steps = [('SCENE.DRAW', 'INSIDE THE CAMERA', 0), ('FX + SHEEN', 'PER THEME', 0), ('PERSISTENCE', 'OFF AT BOARDROOM', 1), ('FOCUS PULL', 'ON EACH CUT', 0),
             ('BLOOM', '×.80 T · ×.45 B', 0), ('HALO', '×.80 T · ×.50 B', 0), ('LIGHT RAYS', '×.80 T · ×.40 B', 0), ('LENS DIRT', 'OFF AT BOARDROOM', 1),
             ('GRADE', 'FILTER AT Q .75+', 0), ('CHROMA', 'OFF AT BOARDROOM', 1), ('GRAIN', '24 FPS · ×.50 B', 0), ('TILT-SHIFT', 'PER THEME', 0),
             ('OVERLAYS', 'CRISP TEXT ON TOP', 0), ('TRANSITION', 'CALM ONLY AT B', 0), ('LETTERBOX', '2.39:1 TOGGLE', 0), ('BEAT CHIPS', 'DOM, TRACKS THE BEAT', 0)]
    steps[0] = ('SCENE.DRAW', 'INSIDE THE CAMERA', 0)
    bw, g = 160, (1408 - 8 * 160) / 7
    pos = []
    for i in range(16):
        row = i // 8; c = i % 8 if row == 0 else 7 - i % 8
        pos.append((96 + c * (bw + g), 302 if row == 0 else 452))
    for i in range(15):
        (x1, y1), (x2, y2) = pos[i], pos[i + 1]
        if y1 == y2:
            a, b = (x1 + bw, x2) if x2 > x1 else (x1, x2 + bw)
            d = 1 if x2 > x1 else -1
            f.L(a + 4 * d, y1 + 36, b - 9 * d, y1 + 36, BLUE, 1.5)
            f.P(f'M{fmt(b - 9 * d)} {y1 + 31}L{fmt(b - 3 * d)} {y1 + 36}L{fmt(b - 9 * d)} {y1 + 41}Z', BLUE)
        else:
            xm = x1 + bw / 2
            f.L(xm, y1 + 72, xm, y2 - 9, BLUE, 1.5)
            f.P(f'M{fmt(xm - 5)} {y2 - 9}L{fmt(xm)} {y2 - 3}L{fmt(xm + 5)} {y2 - 9}Z', BLUE)
    st = f.stepper(16, 17.6)
    for i, (nm, note, warn) in enumerate(steps):
        x, y = pos[i]
        f.R(x, y, bw, 72, NAVY, BLUE3)
        f.T(x + 12, y + 22, f'{i + 1:02d}', 'mono5', 11, BLUE, ls=.1)
        f.T(x + 12, y + 44, nm, 'mono5', 13.5, PAPER, ls=.04)
        fit_text(f, x + 12, y + 62, note, 'mono', 10.5, bw - 20, COPPER if warn else BRIGHT, ls=.04, op=None if warn else .85)
        f.R(x - 3, y - 3, bw + 6, 78, 'none', BRIGHT, 2, cls='am', extra=st(i))
    f.T(96, 556, 'PASSES 01 AND 02 RUN IN CAMERA SPACE · 13 TO 16 STAY CRISP ABOVE THE FILM LOOK', 'mono', 11, P3, ls=.1, op=.6)
    cw = (1456 - 2 * 40) / 3
    xs = [72 + k * (cw + 40) for k in range(3)]
    f.T(xs[0], 618, 'THE SCENE API', 'mono5', 12, BLUE, ls=.14)
    f.R(xs[0], 632, cw, 184, INK, BLUE3)
    code = ["SCENES['TX-01'] = {", "  beats: [['S1', 'Wire-in hero', 6], ...],", '  init(s) { /* seeded state */ },', '  draw(s, t, B, dt) { /* one frame */ }', '};', 'B = { i, t, d, p }  s.lvl: 0 FULL, 1 T, 2 B']
    for i, ln in enumerate(code):
        f.T(xs[0] + 16, 660 + i * 26, ln, 'mono', 13, BRIGHT if i < 5 else P3, op=None if i < 5 else .7, extra=' xml:space="preserve"')
    f.T(xs[1], 618, 'QUALITY GOVERNOR', 'mono5', 12, BLUE, ls=.14)
    e = 646
    for s_ in ['Device pixel ratio capped at 1.5; canvas capped at 1600 px wide.', 'Frame time is averaged. Above 26 ms the render scale drops to 82%, floor 50%; under 18 ms it climbs back.', 'Grade, chroma and lens dirt run only at render scale .75 or better.']:
        f.R(xs[1], e - 9, 6, 6, BLUE)
        e = f.lines(xs[1] + 16, e, s_, 'sans', 15, P3, maxw=cw - 16, lh=21, op=.85) + 32
    f.T(xs[2], 618, 'ZERO OUTSIDE REQUESTS', 'mono5', 12, BLUE, ls=.14)
    e = 646
    for s_ in ['One self-contained HTML file, about 1 MB.', 'Fonts inlined as subset woff2. No CDN, no font links, no analytics.', 'Every number on screen is a placeholder labeled SAMPLE.']:
        f.R(xs[2], e - 9, 6, 6, BLUE)
        e = f.lines(xs[2] + 16, e, s_, 'sans', 15, P3, maxw=cw - 16, lh=21, op=.85) + 32
    return f


# ── STC-07 ───────────────────────────────────────────────────────────────
def fig07():
    f = Fig(7, 'data-story', '07 · THE DATA BEAT', 'Build. Insight. Re-sort. Rank.',
            "Every data beat in the reel tells the same four-part story, in its own theme's language.",
            'The four-part data story used in every Stagehand reel data beat, shown on six sample values: the bars build, an average line of 68.5 draws and a callout names the leader (N4 at 91, 7 ahead of N2 and 22.5 above average), the bars re-sort into rank order, and rank labels arrive. A 9.5 second timeline and the rules for each phase sit to the right.')
    v = S['bars']; n = len(v); avg = sum(v) / n
    order = sorted(range(n), key=lambda i: -v[i]); rank = [0] * n
    for r, i in enumerate(order):
        rank[i] = r
    lead = order[0]
    px, py, pw, ph = 72, 252, 740, 570
    f.R(px, py, pw, ph, 'none', BLUE3)
    f.T(px + 24, py + 32, 'SAMPLE DATA · SIX SOURCES · N4 LEADS', 'mono5', 12, BLUE, ls=.14)
    base, hmax, x0, step, bw = py + 500, 340, px + 64, 104, 64
    for k in (25, 50, 75, 100):
        yy = base - k / 100 * hmax
        f.L(px + 40, yy, px + pw - 24, yy, BLUE3, op=.6)
        f.T(px + 34, yy + 4, str(k), 'mono', 10.5, P3, op=.5, anchor='end')
    f.L(px + 40, base + .5, px + pw - 24, base + .5, P3, op=.5)
    f.css.append('@keyframes dim{0%,25%{opacity:.4}29%,88%{opacity:1}93%,100%{opacity:.4}}.dm{opacity:.4;animation:dim 10s ease-in-out infinite}'
                 '@keyframes co{0%,25%{opacity:1}28%,91%{opacity:0}95%,100%{opacity:1}}.co{animation:co 10s ease-in-out infinite}'
                 '@keyframes rk{0%,46%{opacity:0}51%,80%{opacity:1}84%,100%{opacity:0}}.rk{animation:rk 10s ease-in-out infinite}')
    for i in range(n):
        dx = (rank[i] - i) * step
        f.css.append(f'@keyframes s{i}{{0%,30%{{transform:translateX(0)}}45%,80%{{transform:translateX({dx}px)}}92%,100%{{transform:translateX(0)}}}}'
                     f'.s{i}{{animation:s{i} 10s ease-in-out infinite;animation-delay:{fmt(rank[i] * .09)}s}}')
        x = x0 + i * step; h = v[i] / 100 * hmax
        f.add(f'<g class="s{i}">')
        f.add('<g>' if i == lead else '<g class="dm">')
        f.R(x, base - h, bw, h, BRIGHT if i == lead else BLUE)
        f.T(x + bw / 2, base - h + 24, str(v[i]), 'mono5', 16, NAVY if i == lead else PAPER, anchor='middle')
        f.T(x + bw / 2, base + 22, S['cats'][i], 'mono5', 12.5, P3, anchor='middle', op=.8)
        f.add('</g>')
        f.T(x + bw / 2, base + 46, f'#{rank[i] + 1}', 'mono5', 14, BRIGHT, anchor='middle', cls='am rk')
        f.add('</g>')
    ay = base - avg / 100 * hmax
    f.L(px + 40, ay, px + pw - 24, ay, P3, 1.4, dash='7 5', op=.85)
    f.T(px + pw - 24, ay - 8, f'AVG {fmt(avg)}', 'mono5', 12, P3, anchor='end')
    lx = x0 + lead * step + bw / 2; ly = base - v[lead] / 100 * hmax - 12
    f.add('<g class="co">')
    f.P(f'M{fmt(lx)} {fmt(ly)}V{py + 74}H{px + 470}', stroke=BRIGHT, sw=1.4)
    f.C(lx, ly, 4, BRIGHT)
    f.R(px + 470, py + 48, 246, 58, INK, BRIGHT, 1)
    f.T(px + 484, py + 74, f'N4 LEADS · {v[lead]}', 'serif', 22, PAPER)
    sec = v[order[1]]
    f.T(px + 484, py + 95, f'+{v[lead] - sec} VS N2 · +{fmt(v[lead] - avg)} VS AVERAGE', 'mono5', 11.5, P3, op=.85)
    f.add('</g>')
    # timeline
    tx, tw_ = 852, 676; sc = tw_ / 9.5
    f.T(tx, 272, 'THE DATA BEAT · 9.5 SECONDS', 'mono5', 12, BLUE, ls=.14)
    f.L(tx, 284.5, 1528, 284.5, BLUE3)
    ph = [('BUILD', .3, 2.0, BLUE2), ('INSIGHT', 2.8, 5.5, BLUE), ('RE-SORT', 5.6, 7.2, SAGE), ('RANK', 7.2, 9.0, BRIGHT), ('', 9.0, 9.5, STONE)]
    for nm, a, b, col in ph:
        f.R(tx + a * sc, 304, (b - a) * sc - 2, 30, col)
        if nm:
            f.T(tx + a * sc + 8, 324, nm, 'mono5', 11.5, NAVY if col in (BRIGHT, BLUE) else PAPER, ls=.08)
    f.T(tx + 9.0 * sc + 4, 352, 'EXIT', 'mono', 10, P3, op=.6)
    for s_ in range(10):
        f.L(tx + s_ * sc, 340, tx + s_ * sc, 346, BLUE3)
        f.T(tx + s_ * sc, 364, f'{s_}', 'mono', 10.5, P3, op=.6, anchor='middle')
    f.css.append('@keyframes p1{0%,26%{opacity:1}27%,100%{opacity:0}}@keyframes p2{0%,29%{opacity:0}30%,46%{opacity:1}47%,100%{opacity:0}}@keyframes p3{0%,46%{opacity:0}47%,82%{opacity:1}83%,100%{opacity:0}}')
    for j, (a, b) in enumerate([(2.8, 5.5), (5.6, 7.2), (7.2, 9.0)]):
        f.R(tx + a * sc - 3, 301, (b - a) * sc + 4, 36, 'none', PAPER, 2, cls='am', extra=f' style="animation:p{j + 1} 10s linear infinite"')
    rules = [('01 BUILD', 'Bars rise with a slight overshoot, 0.12 s apart, and the values count up.'),
             ('02 INSIGHT', 'The average line draws, the leader stays lit, the rest dim to half, and a callout names the gap.'),
             ('03 RE-SORT', 'Bars glide into rank order: a 1.3 s ease in and out, 0.09 s apart.'),
             ('04 RANK', 'Rank labels arrive, the chart holds, then it exits on the beat.')]
    y = 412
    for a, b in rules:
        f.T(tx, y, a, 'mono5', 13, BRIGHT, ls=.1)
        y = f.lines(tx, y + 24, b, 'sans', 15.5, P3, maxw=tw_, lh=21, op=.85) + 48
    f.L(tx, y - 8.5, 1528, y - 8.5, BLUE3)
    f.T(tx, y + 18, 'SAME STORY, THEME-NATIVE DEVICES', 'mono5', 12, BLUE, ls=.14)
    f.lines(tx, y + 42, 'Gap brackets (TX-04, TX-11) · limit lines (TX-08) · a log-to-linear scale morph (TX-12) · a share fold (TX-09) · predicted against actual (TX-20)', 'sans', 15, P3, maxw=tw_, lh=21, op=.85)
    return f


# ── STC-08 ───────────────────────────────────────────────────────────────
def fig08():
    v = S['bars']; avg = sum(v) / len(v); lead = v.index(max(v))
    f = Fig(8, 'twenty-skins', '08 · DATA SKINS', 'One dataset. Twenty skins.',
            f"The same six sample values in every theme's palette and display face. N4 leads at {max(v)}; the average is {fmt(avg)}.",
            'Small multiples of the Stagehand sample dataset (62, 84, 48, 91, 70, 56) drawn in each of the twenty themes: theme ground, accent bars with the leader N4 in the second accent, a dashed average line, and the codename set in the theme display face.')
    f.css.append('@keyframes pl{0%,100%{opacity:0}45%{opacity:.55}}')
    for k, t in enumerate(TH):
        c, r = k % 5, k // 5
        x, y, w, h = 72 + c * 294, 252 + r * 146, 280, 132
        tk = t['tok']; dk = theme_font(*t['fonts'][0])
        f.R(x, y, w, h, tk['bg'], BLUE3)
        fit_text(f, x + 14, y + 30, t['name'], dk, 17, 200, tk['ink'])
        f.T(x + w - 12, y + 28, t['id'], 'mono5', 10.5, tk['ink'], ls=.08, op=.6, anchor='end')
        base = y + h - 14
        for i, val in enumerate(v):
            bx = x + 22 + i * 36; bh = val / 100 * 72
            f.R(bx, base - bh, 24, bh, tk['a2'] if i == lead else tk['a1'])
        f.R(x + 22 + lead * 36, base - v[lead] / 100 * 72, 24, v[lead] / 100 * 72, '#FFFFFF', cls='am', extra=f' style="animation:pl 4.5s ease-in-out infinite;animation-delay:{fmt((c + r) * .22)}s"')
        f.T(x + 22 + lead * 36 + 12, base - v[lead] / 100 * 72 - 6, str(v[lead]), 'mono5', 10.5, tk['a2'], anchor='middle')
        ay = base - avg / 100 * 72
        f.L(x + 14, ay, x + 232, ay, tk['ink'], 1, dash='4 3', op=.55)
        f.L(x + 14, base + .5, x + 232, base + .5, tk['ink'], 1, op=.35)
        f.T(x + 240, ay + 4, 'AVG', 'mono', 9.5, tk['ink'], ls=.08, op=.6)
    return f


# ── STC-09 ───────────────────────────────────────────────────────────────
def fig09():
    f = Fig(9, 'homage-rule', '09 · THE HOMAGE RULE', 'Evoke the genre. Never the property.',
            "Themes borrow a genre's grammar and nothing a studio owns. A style can't be owned; logos, characters and specific expression can.",
            'The Stagehand Homage Rule. Borrow the grammar: light, palette mood, type feel, camera language, edit rhythm and sound texture. Never ship franchise names or logos, characters, named places or terms, quotes, scores, stills, or the franchise typefaces. Below: the naming rule (codename only), the swap test, and the commentary exception.')
    f.T(72, 276, 'BORROW THE GRAMMAR', 'mono5', 13, BLUE, ls=.14)
    f.L(72, 288.5, 760, 288.5, BLUE3)
    bor = [('Light', 'Neon, haze, gold, phosphor, daylight.'), ('Palette mood', 'Night, dusk, archive, broadcast.'), ('Type feel', 'Open-license faces with the right temperament.'),
           ('Camera language', 'Push-ins, crawls, tracking shots, crash zooms.'), ('Edit rhythm', 'On the beat, on twos, held pauses.'), ('Sound texture', 'Hum, hiss, tape, room tone. Never a melody.')]
    for i, (a, b) in enumerate(bor):
        x, y = 72 + (i % 2) * 352, 304 + (i // 2) * 102
        f.R(x, y, 336, 88, 'none', BLUE3)
        f.R(x, y, 4, 88, BLUE)
        f.T(x + 20, y + 36, a, 'serif', 25, PAPER)
        fit_text(f, x + 20, y + 64, b, 'sans', 15, 300, P3, op=.82)
    f.T(800, 276, 'NEVER SHIP, AT ANY THEME OR INTENSITY', 'mono5', 13, COPPER, ls=.14)
    f.L(800, 288.5, 1528, 288.5, BLUE3)
    nev = ['Franchise names, logos, wordmarks or title lockups, including look-alikes.', 'Characters, creatures, likenesses, costumes or telling silhouettes.',
           'Named places, organizations, ships, products or invented terms.', 'Quotes, catchphrases or recognizable dialogue.',
           'Scores, sound-alikes of a theme melody, signature sound effects.', 'Stills, frames, posters or traced compositions of specific shots.',
           "The franchise's own typefaces. Use the open fonts on each card."]
    st = f.stepper(7, 11.2)
    for i, s_ in enumerate(nev):
        y = 304 + i * 43
        f.R(800, y, 728, 38, COPPER, cls='am', extra=st(i) + ' fill-opacity=".14"')
        f.xmark(820, y + 19, 10, COPPER, 2)
        fit_text(f, 844, y + 25, s_, 'sans', 16, 670, P3, op=.88)
    cw = (1456 - 2 * 24) / 3
    cards = [('NAMING', 'Public pages, meta tags, alt text and client work use the codename only. Internal briefs may name the inspiration.'),
             ('THE SWAP TEST', 'Picture the theme swapped for its nearest genre neighbor. Anything that only makes sense as one property gets cut or redesigned.'),
             ('COMMENTARY EXCEPTION', 'A story about a film may name it as factual reference, with no logos or studio assets. A licensed look escalates to Barry.')]
    for k, (a, b) in enumerate(cards):
        x = 72 + k * (cw + 24)
        f.R(x, 618, cw, 204, INK, BLUE3)
        f.T(x + 20, 648, a, 'mono5', 12.5, BLUE, ls=.14)
        e = f.lines(x + 20, 676, b, 'sans', 15, P3, maxw=cw - 40, lh=21, op=.85)
        if k == 0:
            f.tick(x + 28, 772, 12); f.T(x + 46, 778, 'TX-07 NIGHT DRIVE', 'mono5', 16, BRIGHT, ls=.06)
            f.xmark(x + 28, 802, 10); w = f.T(x + 46, 808, '<franchise>-style', 'mono5', 16, COPPER, ls=.02)
            f.L(x + 44, 802.5, x + 48 + w, 802.5, COPPER, 1.5)
        elif k == 1:
            f.T(x + 20, 790, 'homage-check: PASS', 'mono5', 16, BRIGHT)
            f.T(x + 20, 812, 'LOGGED AT THE T STAGE', 'mono', 11, P3, ls=.12, op=.6)
        else:
            f.T(x + 20, 790, 'escalate: licensed look', 'mono5', 16, COPPER)
            f.T(x + 20, 812, 'NEVER SOLVED INSIDE A THEME', 'mono', 11, P3, ls=.12, op=.6)
    return f


# ── STC-10 ───────────────────────────────────────────────────────────────
def fig10():
    f = Fig(10, 'brief-to-manifest', '10 · HOW AGENTS USE THE CODEX', 'From brief to manifest in eight moves.',
            'How a site, reel or deck agent picks, tunes, checks and records a theme.',
            'The eight-step Stagehand workflow for agents: U1 essence, fit test, U2 triptych, U3 ledger check, R intensity dial, E slot fills, T swap test, and the manifest line. Right: the precedence order when rules collide, from hard gates down to the theme card. Below: an example manifest line and the three intake values.')
    steps = [('U1', 'ESSENCE', 'Write five essence words and the dominant data shape first.'),
             ('U1', 'FIT TEST', 'Shortlist themes matching two or more essence words and the data shape.'),
             ('U2', 'TRIPTYCH', 'Three concepts. At most one is theme-led, so the comparison stays honest.'),
             ('U3', 'LEDGER', 'No theme repeats in consecutive builds.'),
             ('R', 'DIAL', 'Set intensity from the register: Full, Tempered or Boardroom.'),
             ('E', 'SLOTS', "Fill S1 to S5 from the card's web slot map."),
             ('T', 'SWAP TEST', 'Run the Homage Rule swap test. Log PASS or FAIL.'),
             ('M', 'MANIFEST', 'Record the theme line in the build manifest.')]
    cw, g = 248, 16
    st = f.stepper(8, 12)
    for i, (stg, nm, body) in enumerate(steps):
        x, y = 72 + (i % 4) * (cw + g), 262 + (i // 4) * 162
        f.R(x, y, cw, 146, 'none', BLUE3)
        f.T(x + 16, y + 40, str(i + 1), 'serif', 34, BRIGHT)
        f.T(x + 50, y + 34, f'STAGE {stg}' if stg != 'M' else 'BUILD-MANIFEST', 'mono', 11, BLUE, ls=.12)
        f.T(x + 16, y + 68, nm, 'mono5', 15, PAPER, ls=.1)
        f.lines(x + 16, y + 94, body, 'sans', 14.5, P3, maxw=cw - 32, lh=20, op=.82)
        if i % 4 < 3:
            f.chevron(x + cw + 4, y + 73, 9, BLUE)
        f.R(x - 3, y - 3, cw + 6, 152, 'none', BRIGHT, 2, cls='am', extra=st(i))
    f.R(72, 600, 1040, 84, INK, BLUE3)
    f.T(96, 626, 'EXAMPLE MANIFEST LINE', 'mono5', 11, BLUE, ls=.14)
    f.T(96, 662, 'theme: TX-03 GLASS HUD · BOARDROOM · fit 4/5 · homage-check PASS', 'mono5', 18, BRIGHT)
    f.T(72, 724, 'INTAKE VALUES', 'mono5', 12, BLUE, ls=.14)
    f.L(72, 736.5, 1112, 736.5, BLUE3)
    intake = [('theme: auto', 'The agent may propose one theme inside the triptych.'), ('theme: none', 'Switches the codex off.'),
              ('theme: TX-##', 'Forces a theme. The fit test still runs; a failed fit is flagged.')]
    for k, (a, b) in enumerate(intake):
        x = 72 + k * 352
        f.T(x, 764, a, 'mono5', 15, BRIGHT)
        f.lines(x, 788, b, 'sans', 14, P3, maxw=328, lh=19, op=.82)
    rx = 1152
    f.T(rx, 272, 'WHEN RULES COLLIDE', 'mono5', 12, COPPER, ls=.14)
    f.L(rx, 284.5, 1528, 284.5, BLUE3)
    prec = [('Hard gates', 'Budgets, reduced motion, accessibility, honesty, licensing.'), ('Client brand', 'Client tokens replace ground, ink and type; the theme lends motion.'),
            ('The Homage Rule', 'Evoke the genre, never the property.'), ('Register', 'Set through the intensity dial.'), ('The theme card', 'The last word, never the first.')]
    for k, (a, b) in enumerate(prec):
        y = 298 + k * 104; inset = k * 10
        f.R(rx + inset, y, 376 - inset, 92, 'none', BLUE3)
        f.R(rx + inset, y, 4, 92, COPPER if k == 0 else BLUE, op=None if k == 0 else 1 - k * .15)
        f.T(rx + inset + 18, y + 38, str(k + 1), 'serif', 30, BRIGHT)
        f.T(rx + inset + 48, y + 34, a, 'sans5', 16, PAPER)
        f.lines(rx + inset + 48, y + 58, b, 'sans', 13.5, P3, maxw=376 - inset - 64, lh=18, op=.8)
    f.T(rx, 830, 'HIGHER NUMBER YIELDS TO LOWER', 'mono', 11, P3, ls=.12, op=.6)
    return f


FIGS = [fig01, fig02, fig03, fig04, fig05, fig06, fig07, fig08, fig09, fig10]

if __name__ == '__main__':
    only = {int(a) for a in sys.argv[1:]}
    for i, fn in enumerate(FIGS, 1):
        if only and i not in only:
            continue
        fig = fn(); p = fig.save()
        miss = {k: missing(''.join(v), k) for k, v in fig.used.items()}
        miss = {k: m for k, m in miss.items() if m}
        print(f'{p.name}: {p.stat().st_size // 1024} KB', ('MISSING GLYPHS ' + str(miss)) if miss else '')
    if not only:
        (OUTDIR.parent / 'INPUTS.sha256').write_text(inputs_digest())
