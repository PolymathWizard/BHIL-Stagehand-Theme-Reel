"""Quality gate for BHIL-Stagehand-Theme-Reel. Stdlib only.

Checks canon integrity, contrast, the hashed homage deny list, the repo-wide dash gate, agent tool
isolation, the prompt pack, ADRs, docs navigation, the figure kit and the built reel. Prints one
line per failure and exits non-zero on any. Absence of failures is reported as PASS for these
checks only; it is never a verdict on a build that uses the codex.
"""
import hashlib, json, re, sys
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_derived import ROOT, beats_from_scenes, contrast
import homage

TEXT = {'.md', '.json', '.js', '.py', '.css', '.html', '.svg', '.yml', '.yaml', '.txt', '.cff', '.toml', '.sha256', ''}
SKIP = {'.git', 'node_modules', 'site', 'internal', '__pycache__', 'dist-pkg'}
HEX = re.compile(r'^#[0-9A-F]{6}$')
FIELDS = ['id', 'name', 'slug', 'family', 'feel', 'best_for', 'data_shapes', 'home_register', 'b2b', 'tokens', 'fonts', 'ease', 'dur', 'essence',
          'look', 'motion', 'slots', 'video', 'data_skin', 'boardroom', 'guardrails', 'collision', 'seed']
fails, checks = [], 0


def check(ok, msg):
    global checks
    checks += 1
    if not ok:
        fails.append(msg)


def C(n):
    return json.loads((ROOT / 'canon' / n).read_text(encoding='utf-8'))


def files():
    for p in sorted(ROOT.rglob('*')):
        if p.is_file() and not (set(p.relative_to(ROOT).parts) & SKIP) and (p.suffix in TEXT or p.name in ('LICENSE', '.gitignore')):
            yield p


def canon():
    th = C('themes.json')['themes']; fams = C('families.json')['families']; fonts = {f['family']: f for f in C('fonts.json')['fonts']}
    b2b = C('dial.json')['b2b_fit']
    check(len(th) == 20, f'canon: expected 20 themes, found {len(th)}')
    check([t['id'] for t in th] == [f'TX-{i:02d}' for i in range(1, len(th) + 1)], 'canon: theme ids must run TX-01 upward in order')
    check(len({t['slug'] for t in th}) == len(th), 'canon: slugs must be unique')
    for t in th:
        for f in FIELDS:
            check(t.get(f) not in (None, '', [], {}), f'canon: {t["id"]} missing {f}')
        check(re.fullmatch(r'tx-\d\d-[a-z0-9-]+', t['slug']) is not None, f'canon: {t["id"]} bad slug {t["slug"]}')
        check(set(t['slots']) == {'S1', 'S2', 'S3', 'S4', 'S5'}, f'canon: {t["id"]} slots must be S1 to S5')
        check(t['b2b'] in b2b, f'canon: {t["id"]} unknown b2b {t["b2b"]}')
        check(t['family'] in {f['id'] for f in fams}, f'canon: {t["id"]} unknown family')
        check(len(t['essence']) >= 5, f'canon: {t["id"]} needs at least five essence words')
        for r in ('bg', 'ink', 'a1', 'a2', 'a3'):
            check(bool(HEX.match(t['tokens'][r])), f'canon: {t["id"]} {r} must be #RRGGBB uppercase')
        ink = contrast(t['tokens']['ink'], t['tokens']['bg'])
        check(ink >= 11, f'contrast: {t["id"]} ink on ground is {ink:.2f}:1, needs 11:1')
        for r in ('display', 'body', 'mono'):
            fam, w = t['fonts'][r]
            check(fam in fonts and fonts[fam]['license'] in ('OFL-1.1', 'Apache-2.0'), f'fonts: {t["id"]} {fam} missing or not OFL/Apache')
            check(fam in fonts and w in fonts[fam]['weights'], f'fonts: {t["id"]} {fam} {w} not recorded')
        check(t['seed'].startswith(f'{t["id"]} {t["name"]}:'), f'canon: {t["id"]} prompt seed must open with the id and codename')
    for f in fams:
        check(f['themes'] == [t['id'] for t in th if t['family'] == f['id']], f'canon: family {f["id"]} theme list out of step')
    for c in C('claims.json')['claims']:
        check(c['tier'] in C('claims.json')['tiers'], f'claims: {c["id"]} unknown tier {c["tier"]}')


def text_gates():
    hs, n = homage.load()
    for p in files():
        raw = p.read_bytes(); rel = p.relative_to(ROOT).as_posix()
        check(b'\xe2\x80\x94' not in raw and b'\xe2\x80\x93' not in raw, f'dash gate: em or en dash in {rel}')
        if rel == 'canon/homage-denylist.json':
            continue
        h = homage.hits(raw.decode('utf-8', errors='ignore'), hs, n)
        check(not h, f'homage: {rel} contains {len(h)} deny-listed phrase(s); run python3 scripts/homage.py scan {rel}')


def frontmatter(p):
    m = re.match(r'---\n(.*?)\n---\n', p.read_text(encoding='utf-8'), re.S)
    return dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M)) if m else {}


def agents():
    a = C('agents.json'); write = set(a['write_tools'])
    names = {x['name'] for x in a['agents']}
    found = {p.stem for p in (ROOT / '.claude' / 'agents').glob('*.md')}
    check(found == names, f'agents: files {sorted(found ^ names)} out of step with canon/agents.json')
    for x in a['agents']:
        p = ROOT / '.claude' / 'agents' / f'{x["name"]}.md'
        if not p.exists():
            continue
        fm = frontmatter(p); tools = [t.strip() for t in fm.get('tools', '').split(',') if t.strip()]
        check(fm.get('name') == x['name'], f'agents: {x["name"]} frontmatter name')
        check(fm.get('model') == x['model'], f'agents: {x["name"]} model must be {x["model"]}')
        check(sorted(tools) == sorted(x['tools']), f'agents: {x["name"]} tools {tools} differ from canon {x["tools"]}')
        if x['name'] in a['read_only']:
            check(not (set(tools) & write), f'agents: {x["name"]} is read-only but has write tools')
        check(len(p.read_text(encoding='utf-8').splitlines()) >= 40, f'agents: {x["name"]} brief is under 40 lines')


def prompts():
    for pid, fn, title, agent, stage in C('prompts.json')['prompts']:
        p = ROOT / 'prompts' / fn
        check(p.exists(), f'prompts: missing {fn}')
        if p.exists():
            s = p.read_text(encoding='utf-8')
            check(s.startswith(f'# {pid} · '), f'prompts: {fn} must open with "# {pid} · "')
            check(agent in s, f'prompts: {fn} must name its agent {agent}')
            check(len(s.splitlines()) >= 60, f'prompts: {fn} is under 60 lines')


def adrs():
    adr = sorted((ROOT / 'docs' / 'adr').glob('adr-*.md'))
    check(len(adr) >= 8, f'adr: expected at least 8 ADRs, found {len(adr)}')
    idx = (ROOT / 'docs' / 'adr' / 'index.md').read_text(encoding='utf-8') if (ROOT / 'docs' / 'adr' / 'index.md').exists() else ''
    for p in adr:
        s = p.read_text(encoding='utf-8')
        check(re.search(r'^\*\*Status:\*\* (Accepted|Proposed|Superseded)', s, re.M) is not None, f'adr: {p.name} needs a Status line')
        check(p.name in idx, f'adr: {p.name} missing from docs/adr/index.md')


def docs_nav():
    nav = (ROOT / 'mkdocs.yml').read_text(encoding='utf-8')
    for p in (ROOT / 'docs').rglob('*.md'):
        rel = p.relative_to(ROOT / 'docs').as_posix()
        check(rel in nav, f'docs: {rel} is not in mkdocs.yml nav')


def figures():
    sys.path.insert(0, str(ROOT / 'scripts'))
    F = ROOT / 'docs' / 'assets' / 'figures'; figs = C('figures.json')['figures']
    svgs = sorted((F / 'svg').glob('stc-*.svg'))
    check([p.stem for p in svgs] == [f[1] for f in figs], 'figures: svg set out of step with canon/figures.json')
    sums = dict(l.split('  ')[::-1] for l in (F / 'png' / 'SOURCES.sha256').read_text().splitlines() if l) if (F / 'png' / 'SOURCES.sha256').exists() else {}
    ins = F / 'INPUTS.sha256'
    if ins.exists():
        for line in ins.read_text().splitlines():
            h, rel = line.split('  ')
            check((ROOT / rel).exists() and hashlib.sha256((ROOT / rel).read_bytes()).hexdigest() == h, f'figures: stale against {rel}; run scripts/figures.py then scripts/render_figures.py')
    else:
        check(False, 'figures: INPUTS.sha256 missing')
    for p in svgs:
        raw = p.read_bytes(); s = raw.decode('utf-8')
        try:
            r = ET.fromstring(raw)
        except ET.ParseError as e:
            check(False, f'figures: {p.name} XML {e}'); continue
        ns = '{http://www.w3.org/2000/svg}'
        check(r.get('viewBox') == '0 0 1600 900', f'figures: {p.name} viewBox')
        check(r.get('role') == 'img' and r.get('aria-labelledby') == 't d', f'figures: {p.name} role and aria')
        d = r.find(ns + 'desc')
        check(r.find(ns + 'title') is not None and d is not None and len(d.text or '') >= 80, f'figures: {p.name} needs title and a long desc')
        check('prefers-reduced-motion: reduce' in s, f'figures: {p.name} reduced-motion stop')
        check(len(raw) <= 120 * 1024, f'figures: {p.name} over 120 KB')
        check(not re.search(r'<(script|foreignObject|image)\b', s) and 'url(http' not in s and not re.search(r'(href|src)="https?:', s), f'figures: {p.name} external or scripted content')
        png = F / 'png' / f'{p.stem}.png'
        check(png.exists() and png.read_bytes()[16:24] == (1600).to_bytes(4, 'big') + (900).to_bytes(4, 'big'), f'figures: {png.name} missing or not 1600x900')
        check(sums.get(f'svg/{p.name}') == hashlib.sha256(raw).hexdigest(), f'figures: {png.name} stale; run scripts/render_figures.py')


def reel():
    d = ROOT / 'reel' / 'dist'; html = d / 'stagehand-theme-reel.html'
    check(html.exists(), 'reel: dist/stagehand-theme-reel.html missing; run reel/build_reel.py')
    if not html.exists():
        return
    for line in (d / 'SOURCES.sha256').read_text().splitlines():
        h, rel = line.split('  ')
        check((ROOT / rel).exists() and hashlib.sha256((ROOT / rel).read_bytes()).hexdigest() == h, f'reel: build stale against {rel}; run python3 reel/build_reel.py')
    s = html.read_text(encoding='utf-8')
    check(not re.search(r'(src|srcset)=["\']https?:', s) and not re.search(r'url\(["\']?https?:', s) and not re.search(r'<link[^>]+href=["\']https?:', s), 'reel: dist requests something from the network')
    check(s.count('<canvas') == 20, 'reel: expected 20 canvases')
    check('{{' not in s, 'reel: unfilled template marker in dist')
    b = beats_from_scenes(ROOT)
    for t in C('themes.json')['themes']:
        bt = b.get(t['id'])
        check(bt is not None, f'reel: no scene for {t["id"]}')
        if bt:
            check([x for x in bt if x[0] == 'S4'] and all(x[2] == 9.5 for x in bt if x[0] == 'S4'), f'reel: {t["id"]} S4 beat must run 9.5 s')
            check(all(x[0] in ('S1', 'S2', 'S3', 'S4', 'S5') for x in bt), f'reel: {t["id"]} beat with unknown slot')


def repo():
    for f in ('README.md', 'LICENSE', 'LICENSE-CONTENT.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CITATION.cff', 'CLAUDE.md', 'mkdocs.yml', '.gitignore', 'MANIFEST.sha256'):
        check((ROOT / f).exists(), f'repo: missing {f}')
    rd = (ROOT / 'README.md').read_text(encoding='utf-8') if (ROOT / 'README.md').exists() else ''
    for k in ('roster', 'figures', 'counts'):
        check(f'<!-- BEGIN:{k} -->' in rd and f'<!-- END:{k} -->' in rd, f'readme: missing {k} markers')
    check(C('stagehand.json')['repo'] in rd, 'readme: must link the canonical repo URL')
    gi = (ROOT / '.gitignore').read_text() if (ROOT / '.gitignore').exists() else ''
    check('internal/' in gi, '.gitignore must exclude internal/ (the deny-list source)')


def main():
    for fn in (canon, text_gates, agents, prompts, adrs, docs_nav, figures, reel, repo):
        try:
            fn()
        except Exception as e:  # a crashed check is a failure, never a pass
            fails.append(f'{fn.__name__}: crashed: {e!r}')
    if fails:
        print(f'VALIDATE FAIL · {len(fails)} of {checks} checks\n  ' + '\n  '.join(fails))
        sys.exit(1)
    print(f'VALIDATE PASS · {checks} checks')


if __name__ == '__main__':
    main()
