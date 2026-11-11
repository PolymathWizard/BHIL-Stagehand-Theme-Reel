"""Generate every derived artifact from canon/*.json and the reel scene sources. Stdlib only.

    python3 scripts/build_derived.py          # write
    python3 scripts/verify_drift.py           # check, never write

Derived artifacts are never hand-edited (ADR-001). Edit canon, then rebuild.
"""
import hashlib, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GEN = 'Generated from canon by scripts/build_derived.py. Do not edit by hand.'


def load(root, name):
    return json.loads((root / 'canon' / name).read_text(encoding='utf-8'))


def beats_from_scenes(root):
    out = {}
    for f in sorted((root / 'reel' / 'src').glob('scenes-*.js')):
        s = f.read_text(encoding='utf-8')
        for m in re.finditer(r"SCENES\['(TX-\d+)'\] = \{\s*beats: (\[.*?\]\]),", s, re.S):
            arr = re.sub(r"'([^']*)'", lambda q: json.dumps(q.group(1)), m.group(2))
            out[m.group(1)] = json.loads(arr)
    return out


def lum(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]


def contrast(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + .05) / (lb + .05)


def table(head, rows):
    esc = lambda v: str(v).replace('|', '\\|').replace('\n', ' ')
    return '\n'.join(['| ' + ' | '.join(head) + ' |', '| ' + ' | '.join('---' for _ in head) + ' |'] + ['| ' + ' | '.join(esc(c) for c in r) + ' |' for r in rows]) + '\n'


def fmt_n(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


STACK = {'display': 'system-ui, sans-serif', 'body': 'system-ui, sans-serif', 'mono': 'ui-monospace, monospace'}


def css_block(t, sel):
    k, f, x = t['tokens'], t['fonts'], t['extra_tokens']
    lines = [f'--tx-id: "{t["id"]}";', f'--tx-bg: {k["bg"]};', f'--tx-ink: {k["ink"]};', f'--tx-a1: {k["a1"]};', f'--tx-a2: {k["a2"]};', f'--tx-a3: {k["a3"]};',
             f'--tx-glow: 0 0 14px color-mix(in srgb, var(--tx-a1) 55%, transparent);', f'--tx-grain: {x.get("grain", "0")};']
    lines += [f'--tx-{r}: "{f[r][0]}", {STACK[r]};' for r in ('display', 'body', 'mono')]
    lines += [f'--tx-{r}-weight: {f[r][1]};' for r in ('display', 'body', 'mono')]
    lines += [f'--tx-ease: {t["ease"]};', f'--tx-dur: {t["dur"]};', f'--tx-step: {x.get("step", "none")};']
    if 'fills' in x:
        lines += [f'--tx-fill-{i + 1}: {v.strip()};' for i, v in enumerate(x['fills'].split(','))]
    return f'/* {t["id"]} {t["name"]} */\n{sel} {{\n' + ''.join(f'  {l}\n' for l in lines) + '}\n'


def data_js(themes, fams):
    out = ['/* ' + GEN + ' */', 'const FAMILIES = {', ',\n'.join(f"  {f['id']}: {json.dumps(f['name'])}" for f in fams) + '\n};', 'const THEMES = [']
    rows = []
    for t in themes:
        x = t['extra_tokens']
        extra = ''.join(f'--tx-{n}:{v};' for n, v in x.items() if n != 'fills')
        o = {'id': t['id'], 'name': t['name'], 'fam': t['family'], 'feel': t['feel'], 'home': t['home_register'], 'b2b': t['b2b'], 'tok': t['tokens'],
             'fonts': [t['fonts'][r] for r in ('display', 'body', 'mono')], 'ease': t['ease'], 'dur': t['dur'], 'extra': extra,
             'essence': t['essence'], 'board': t['boardroom'], 'seed': t['seed']}
        rows.append('  ' + json.dumps(o, ensure_ascii=False))
    out.append(',\n'.join(rows)); out.append('];'); return '\n'.join(out) + '\n'


def swatches(t):
    k = t['tokens']
    cells = ''.join(f'<span class="tx-sw" style="background:{k[r]}" title="--tx-{r} {k[r]}"></span>' for r in ('bg', 'ink', 'a1', 'a2', 'a3'))
    return f'<div class="tx-swatches">{cells}</div>\n'


def theme_page(t, fam, beats, fonts, dial, slots):
    k = t['tokens']; fname = {f['family']: f for f in fonts}
    ink = contrast(k['ink'], k['bg'])
    acc = [(r, contrast(k[r], k['bg'])) for r in ('a1', 'a2', 'a3')]
    b = beats.get(t['id'], []); total = sum(x[2] for x in b)
    sname = {s['id']: s['name'] for s in slots}
    L = [f'# {t["id"]} {t["name"]}\n', f'<!-- {GEN} -->\n', f'*{t["feel"]}*\n', swatches(t),
         table(['Family', 'Home register', 'B2B fit', 'Data shapes', 'Best for'],
               [[f'{fam["id"]} · {fam["name"]}', t['home_register'], dial['b2b_fit'][t['b2b']], ', '.join(t['data_shapes']), t['best_for']]]),
         '## Tokens\n', f'Paste-ready custom properties. Download: [`tokens/themes/{t["slug"]}.css`](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/tokens/themes/{t["slug"]}.css).\n',
         '```css\n' + css_block(t, ':root') + '```\n',
         '## Essence words\n', ', '.join(t['essence']) + '\n',
         '## Look\n', t['look'] + '\n', '## Motion grammar\n', t['motion'] + '\n',
         '## Web slot map\n', table(['Slot', 'Name', 'Fill'], [[s, sname[s], t['slots'][s]] for s in ('S1', 'S2', 'S3', 'S4', 'S5')]),
         '## Data skin\n', t['data_skin'] + '\n', '## Video\n', t['video'] + '\n',
         '## Boardroom translation\n', t['boardroom'] + '\n',
         '## Homage guardrails\n', t['guardrails'] + ' These sit on top of the [Homage Rule](../codex/homage-rule.md).\n',
         '## Collision note\n', t['collision'] + '\n',
         '## Contrast\n', table(['Pair', 'Ratio', 'Use'], [['ink on ground', f'{ink:.1f}:1', 'Body text']] +
                                [[f'{r} on ground', f'{v:.1f}:1', 'Text and data lines' if v >= 4.5 else ('Large text, icons and data lines' if v >= 3 else 'Fill only')] for r, v in acc]),
         '## Type trio\n', table(['Role', 'Face', 'Weight', 'License'], [[r.title(), t['fonts'][r][0], t['fonts'][r][1], fname[t['fonts'][r][0]]['license']] for r in ('display', 'body', 'mono')]),
         '## In the reel\n', f'The live loop runs {fmt_n(total)} s. Open it in the [reel](https://polymathwizard.github.io/BHIL-Stagehand-Theme-Reel/reel/stagehand-theme-reel.html#{t["id"].lower()}).\n',
         table(['Beat', 'Slot', 'Label', 'Seconds'], [[i + 1, x[0], x[1], fmt_n(x[2])] for i, x in enumerate(b)]),
         '## Prompt seed\n', '```text\n' + t['seed'] + '\n```\n']
    return '\n'.join(L)


def generate(root=ROOT):
    themes = load(root, 'themes.json')['themes']; fams = load(root, 'families.json')['families']; meta = load(root, 'stagehand.json')
    dial = load(root, 'dial.json'); slotsc = load(root, 'slots.json'); fonts = load(root, 'fonts.json')['fonts']; homage = load(root, 'homage.json')
    cf = load(root, 'card-fields.json'); wf = load(root, 'workflow.json'); pipe = load(root, 'pipeline.json'); sample = load(root, 'sample.json')
    safety = load(root, 'safety.json'); video = load(root, 'video.json'); bench = load(root, 'bench.json'); picks = load(root, 'quick-picks.json')['picks']
    figs = load(root, 'figures.json')['figures']; claims = load(root, 'claims.json'); agents = load(root, 'agents.json'); prompts = load(root, 'prompts.json')['prompts']
    beats = beats_from_scenes(root); F = {f['id']: f for f in fams}; out = {}

    out['reel/src/data.js'] = data_js(themes, fams)
    out['tokens/stagehand-tokens.css'] = f'/* Stagehand Theme Codex {meta["codex"]} · all twenty themes, scoped by [data-tx]. {GEN} */\n\n' + '\n'.join(css_block(t, f'[data-tx="{t["id"]}"]') for t in themes)
    for t in themes:
        out[f'tokens/themes/{t["slug"]}.css'] = f'/* Stagehand Theme Codex {meta["codex"]}. {GEN} */\n' + css_block(t, ':root')
    out['tokens/stagehand-tokens.json'] = json.dumps({'$description': f'Stagehand Theme Codex {meta["codex"]} tokens. {GEN}', 'themes': {t['id']: {
        'name': t['name'], 'color': {r: {'$value': t['tokens'][r], '$type': 'color'} for r in ('bg', 'ink', 'a1', 'a2', 'a3')},
        'font': {r: {'$value': t['fonts'][r][0], 'weight': t['fonts'][r][1]} for r in ('display', 'body', 'mono')},
        'motion': {'ease': {'$value': t['ease'], '$type': 'cubicBezier' if t['ease'].startswith('cubic') else 'string'}, 'duration': {'$value': t['dur'], '$type': 'duration'}},
        'extra': t['extra_tokens']} for t in themes}}, indent=2, ensure_ascii=False) + '\n'

    # theme pages and roster
    for t in themes:
        out[f'docs/themes/{t["slug"]}.md'] = theme_page(t, F[t['family']], beats, fonts, dial, slotsc['slots'])
    R = ['# Theme roster\n', f'<!-- {GEN} -->\n', f'Twenty themes in five families. *Home register* is where a theme runs at full strength; *B2B fit* says whether it survives the Boardroom dial. Data shapes use the U1 vocabulary: flow, network, comparison, timeline, terrain, score and document.\n']
    for f in fams:
        R.append(f'## {f["id"]} · {f["name"]}\n'); R.append(f['intro'] + '\n')
        R.append(table(['ID', 'Codename', 'Feel in one line', 'Best for', 'Data shapes', 'Home', 'B2B fit'],
                       [[t['id'], f'[{t["name"]}]({t["slug"]}.md)', t['feel'], t['best_for'], ', '.join(t['data_shapes']), t['home_register'], dial['b2b_fit'][t['b2b']]] for t in themes if t['family'] == f['id']]))
    R.append('## Quick picks by story type\n'); R.append(table(['Story type', 'Try first', 'Then', 'Then'], [[p[0]] + [f'[{i}]({next(t["slug"] for t in themes if t["id"] == i)}.md)' for i in p[1]] for p in picks]))
    R.append('## The bench\n'); R.append(bench['intro'] + '\n'); R.append(table(['Codename', 'Feel in one line', 'Swap in for'], bench['alternates']))
    out['docs/themes/index.md'] = '\n'.join(R)

    # codex pages
    out['docs/codex/homage-rule.md'] = '\n'.join([
        '# The Homage Rule\n', f'<!-- {GEN} -->\n', '**Evoke the genre, never the property.**\n', homage['principle'] + '\n',
        '## Borrow the grammar\n', table(['Borrow', 'Examples'], homage['borrow']),
        '## Never ship, at any theme or intensity\n', ''.join(f'- {x}\n' for x in homage['never_ship']),
        '## Naming\n', homage['naming'] + '\n', '## The swap test\n', homage['swap_test'] + '\n', '## Commentary exception\n', homage['commentary'] + '\n',
        '## Theme guardrails\n', 'Each card adds its own off-limits list on top of the rule.\n',
        table(['Theme', 'Guardrails'], [[f'[{t["id"]} {t["name"]}](../themes/{t["slug"]}.md)', t['guardrails']] for t in themes]),
        '## This repository is the public edition\n', homage['public_edition'] + ' See [ADR-002](../adr/adr-002-public-edition.md).\n'])
    lv = dial['levels']
    out['docs/codex/intensity-dial.md'] = '\n'.join([
        '# The intensity dial\n', f'<!-- {GEN} -->\n', dial['intro'] + '\n',
        table(['Level', 'Register', 'What stays', 'What goes', 'Timing'], [[l['name'], l['register'], l['stays'], l['goes'], l['timing']] for l in lv]),
        '## Rules\n', ''.join(f'- {r}\n' for r in dial['rules']),
        '## B2B fit\n', table(['Code', 'Meaning', 'Themes'], [[c, m, ', '.join(f'[{t["id"]}](../themes/{t["slug"]}.md)' for t in themes if t['b2b'] == c)] for c, m in dial['b2b_fit'].items()]),
        '## Boardroom translations\n', table(['Theme', 'Boardroom translation'], [[f'{t["id"]} {t["name"]}', t['boardroom']] for t in themes]),
        '## How the reel engine applies the dial\n', dial['engine']['note'] + '\n', table(['Pass', 'Full', 'Tempered', 'Boardroom'], dial['engine']['rows'])])
    out['docs/codex/card-anatomy.md'] = '\n'.join([
        '# Card anatomy and token schema\n', f'<!-- {GEN} -->\n', 'Every card carries the same eleven fields, so an agent can lift exactly the part its stage needs.\n',
        table(['Field', 'What it gives the agent', 'Stage'], [[f['field'], f['gives'], f['stage']] for f in cf['fields']]),
        '## Shared token schema\n', table(['Property', 'Meaning'], [[f'`{k}`', v] for k, v in cf['token_schema'].items()]),
        'Example, from TX-07:\n', '```css\n' + css_block(next(t for t in themes if t['id'] == 'TX-07'), ':root') + '```\n',
        '## Token rules\n', ''.join(f'- {r}\n' for r in cf['token_rules'])])
    out['docs/codex/web-slots.md'] = '\n'.join([
        '# Web slots and build tiers\n', f'<!-- {GEN} -->\n', slotsc['intro'] + '\n', table(['Slot', 'Name', 'Role'], [[s['id'], s['name'], s['role']] for s in slotsc['slots']]),
        '## Build tiers\n', 'Slot fills name a tier, so an agent knows the cost before it commits.\n', table(['Tier', 'Name', 'Role'], [[s['id'], s['name'], s['role']] for s in slotsc['tiers']]),
        '## Every card, slot by slot\n'] + [f'### {s["id"]} · {s["name"]}\n\n' + table(['Theme', 'Fill'], [[f'[{t["id"]} {t["name"]}](../themes/{t["slug"]}.md)', t['slots'][s['id']]] for t in themes]) for s in slotsc['slots']])
    out['docs/codex/video-kit.md'] = '\n'.join(['# Video and animation direction kit\n', f'<!-- {GEN} -->\n', video['intro'] + '\n', '## Formats and frame rates\n', ''.join(f'- {x}\n' for x in video['formats']),
        '## Length templates\n', table(['Length', 'Structure', 'Use'], video['lengths']), '## Shared rules\n', ''.join(f'- {x}\n' for x in video['rules']),
        '## Every card\'s video grammar\n', table(['Theme', 'Video'], [[f'[{t["id"]} {t["name"]}](../themes/{t["slug"]}.md)', t['video']] for t in themes])])
    out['docs/codex/safety.md'] = '\n'.join(['# Safety and accessibility for themed motion\n', f'<!-- {GEN} -->\n', safety['intro'] + '\n', table(['Risk', 'Themes most exposed', 'Rule'], safety['rows']),
        'The reel itself is covered in [ADR-007](../adr/adr-007-reel-autoplay.md).\n'])
    moves = wf['moves']
    directive = ['THEME DIRECTIVE · Stagehand Theme Codex ' + meta['codex'], '']
    directive += [f'{m["n"]}. {m["stage"]} {m["name"].upper()}. {m["body"]}' for m in moves]
    directive += ['', 'HOMAGE RULE. Codename only in public copy. No logos, wordmarks, characters, named places or terms, quotes, scores or sound-alikes, stills, or franchise typefaces.',
                  'INTENSITY follows register: creative = full, editorial = tempered, B2B = boardroom. Never pitch a theme marked "never pitched for B2B" for B2B work.',
                  'SAFETY. The safety table applies on top of your hard gates.', 'MANIFEST: ' + wf['manifest_format'] + ' · any one-level chapter step-up · flash-test result (video).', 'END DIRECTIVE']
    out['docs/codex/how-agents-use.md'] = '\n'.join([
        '# How agents use the codex\n', f'<!-- {GEN} -->\n',
        'A theme is a costume layer. It sets palette, type, motion grammar, transitions and video language. It never picks the format, never replaces the subject-derived S1 signature, and never overrides a hard gate.\n',
        '## The eight moves\n', table(['#', 'Stage', 'Move', 'What happens'], [[m['n'], m['stage'], m['name'], m['body']] for m in moves]),
        '## Stage letters\n', 'The letters are stage labels from BHIL\'s Stagehand Design Framework, the build process this codex plugs into. You do not need the framework to use the codex; each stage is described by what it does.\n',
        table(['Stage', 'What it does with a theme'], list(wf['stages'].items())),
        '## When rules collide\n', table(['Order', 'Rule', 'Meaning'], [[i + 1, a, b] for i, (a, b) in enumerate(wf['precedence'])]),
        '## Intake values\n', table(['Value', 'Effect'], wf['intake']), '```text\n' + wf['intensity_intake'] + '\n```\n',
        '## Manifest line\n', '```text\n' + wf['manifest_format'] + '\n' + wf['manifest_example'] + '\n```\n',
        '## Paste-ready theme directive\n', '```text\n' + '\n'.join(directive) + '\n```\n',
        '## Signature ledger\n', 'Add a Theme column to your build ledger.\n', table(wf['ledger_columns'], [wf['ledger_example']]), wf['ledger_rule'] + '\n'])

    # reel pages
    rows = []
    for t in themes:
        b = beats[t['id']]; rows.append([f'[{t["id"]} {t["name"]}](../themes/{t["slug"]}.md)', ' · '.join(f'{x[0]} {x[1]} ({fmt_n(x[2])} s)' for x in b), fmt_n(sum(x[2] for x in b))])
    tots = [sum(x[2] for x in beats[t['id']]) for t in themes]
    out['docs/reel/beats.md'] = '\n'.join(['# Beats, theme by theme\n', f'<!-- {GEN} -->\n',
        f'Each reel loop is a sequence of beats, and each beat demonstrates one web slot. Loops run {fmt_n(min(tots))} to {fmt_n(max(tots))} s. Every S4 data beat runs {fmt_n(sample["data_beat"]["duration"])} s and tells the [four-part data story](data-beat.md).\n',
        table(['Theme', 'Beats', 'Loop (s)'], rows)])
    out['docs/reel/engine.md'] = '\n'.join(['# The reel engine\n', f'<!-- {GEN} -->\n',
        'The reel is one HTML file: twenty canvases, one shared engine, and a film pipeline that runs after every scene draw. The engine is plain JavaScript with no dependencies.\n',
        '## Render order\n', table(['#', 'Pass', 'What it does', 'Dial'], [[i + 1, p[0], p[1], p[2] or 'All levels'] for i, p in enumerate(pipe['passes'])]),
        '## Quality governor\n', ''.join(f'- {g}\n' for g in pipe['governor']),
        '## Scene API\n', '```js\n' + '\n'.join(pipe['scene_api']) + '\n```\n', f'- {pipe["beat_object"]}\n- {pipe["stage_object"]}\n',
        'Each scene draws in a logical 960 x 540 space; the engine scales it to the device. See [Building the reel](building.md) for adding a scene.\n'])
    ph = sample['data_beat']['phases']
    out['docs/reel/data-beat.md'] = '\n'.join(['# The data beat\n', f'<!-- {GEN} -->\n',
        f'Every theme has one S4 beat, and every S4 beat tells the same story in {fmt_n(sample["data_beat"]["duration"])} s: the chart builds, the insight lands, the data re-sorts, the ranks arrive.\n',
        '![STC-07 · Build. Insight. Re-sort. Rank.](../assets/figures/svg/stc-07-data-story.svg)\n',
        table(['Phase', 'Starts (s)', 'Ends (s)', 'What happens'], [[p[0], fmt_n(p[1]), fmt_n(p[2]), p[3]] for p in ph]),
        '## The sample dataset\n', sample['note'] + '\n',
        table(['Series', 'Values'], [['Bars (' + ', '.join(sample['cats']) + ')', ', '.join(map(str, sample['bars']))], ['Line, 12 weeks', ', '.join(fmt_n(v) if v >= 1 else str(v) for v in sample['line'])],
                                     ['Share', ', '.join(f'{v}%' for v in sample['share'])], ['KPI', fmt_n(sample['kpi'])]]),
        f'Average of the bars: {fmt_n(sum(sample["bars"]) / len(sample["bars"]))}. Leader: {sample["cats"][sample["bars"].index(max(sample["bars"]))]} at {max(sample["bars"])}.\n',
        '## Data skins, theme by theme\n', table(['Theme', 'Data skin', 'S4 fill'], [[f'[{t["id"]} {t["name"]}](../themes/{t["slug"]}.md)', t['data_skin'], t['slots']['S4']] for t in themes])])

    # reference
    crow = []
    for t in themes:
        k = t['tokens']; vals = [contrast(k[r], k['bg']) for r in ('ink', 'a1', 'a2', 'a3')]
        crow.append([t['id'], t['name'], f'{vals[0]:.1f}:1'] + [f'{v:.1f}:1' + (' (fill only)' if v < 3 else '') for v in vals[1:]])
    out['docs/reference/contrast.md'] = '\n'.join(['# Contrast\n', f'<!-- {GEN} -->\n', 'WCAG 2.x contrast of each token against the theme ground, computed at build time. Ink must reach 11:1; accents under 3:1 are fill only and never carry text or a data line alone.\n',
        table(['ID', 'Codename', 'ink', 'a1', 'a2', 'a3'], crow)])
    out['docs/reference/fonts.md'] = '\n'.join(['# Fonts and licenses\n', f'<!-- {GEN} -->\n', load(root, 'fonts.json')['note'] + '\n',
        table(['Family', 'Package', 'License', 'Weights', 'Used by'], [[f['family'], f'`{f["package"]}`', f['license'], ', '.join(map(str, f['weights'])) or 'interface', ', '.join(f['themes']) or f['use']] for f in fonts])])
    out['docs/reference/claims.md'] = '\n'.join(['# Claims and evidence\n', f'<!-- {GEN} -->\n',
        'Every factual claim this repository makes carries an evidence tier: VERIFIED (checked directly), CORROBORATED (two or more independent sources), STATED (one source says so), UNCORROBORATED, or INFERENCE.\n',
        table(['ID', 'Tier', 'Claim', 'Basis'], [[c['id'], c['tier'], c['claim'], c['basis'] + (f' [Source]({c["source"]})' if c.get('source') else '')] for c in claims['claims']])])
    out['docs/reference/glossary.md'] = '\n'.join(['# Glossary\n', f'<!-- {GEN} -->\n',
        table(['Term', 'Meaning'], [['Theme', 'A costume layer of palette, type, motion grammar, transitions and video language, identified by a TX number and a codename.'],
                                    ['Codename', 'The only public name a theme has. No franchise names, ever.'], ['Card', 'The eleven-field record that defines a theme.'],
                                    ['Register', 'Creative, editorial or B2B: who the property is for. It sets the intensity.'], ['Boardroom translation', 'The one-line B2B version of a theme.'],
                                    ['Swap test', 'The homage check: swap the theme for its genre neighbor and cut anything that only makes sense as one property.'],
                                    ['Data shape', 'The dominant shape of a story\'s data: flow, network, comparison, timeline, terrain, score or document.'],
                                    ['Beat', 'One timed section of a reel loop. Each beat demonstrates one web slot.'], ['Manifest', 'The record that ships with a build, including the theme line.'],
                                    ['Ledger', 'The running list of shipped builds, used to keep themes from repeating.']] +
              [[s['id'], f'{s["name"]}: {s["role"]}'] for s in slotsc['slots']] + [[s['id'], f'{s["name"]}: {s["role"]}'] for s in slotsc['tiers']] + [[k, v] for k, v in wf['stages'].items()])])
    out['docs/reference/tokens.md'] = '\n'.join(['# Token files\n', f'<!-- {GEN} -->\n', 'Three formats, all generated from `canon/themes.json`.\n',
        table(['File', 'Use'], [['`tokens/stagehand-tokens.css`', 'All twenty themes, each scoped to `[data-tx="TX-##"]`. Set the attribute on any element to switch themes.'],
                                ['`tokens/themes/tx-##-codename.css`', 'One theme on `:root`, for a page that wears a single theme.'],
                                ['`tokens/stagehand-tokens.json`', 'Design-token JSON (colors, fonts, motion) for tools and pipelines.']]),
        '```html\n<section data-tx="TX-16">\n  <h2 style="font-family: var(--tx-display); color: var(--tx-a1)">Four moves, measured</h2>\n</section>\n```\n',
        table(['ID', 'Codename', 'bg', 'ink', 'a1', 'a2', 'a3', 'ease', 'dur'], [[t['id'], t['name']] + [f'`{t["tokens"][r]}`' for r in ('bg', 'ink', 'a1', 'a2', 'a3')] + [f'`{t["ease"]}`', t['dur']] for t in themes])])

    # figures, agents
    out['docs/figures.md'] = '\n'.join(['# Figures\n', f'<!-- {GEN} -->\n', load(root, 'figures.json')['note'] + ' Files live in `docs/assets/figures/` (`svg/` and `png/`).\n',
        '## Teaching sequence\n', 'Ten short sessions, one figure each.\n'] +
        [f'### {f[0]} · {f[2]}\n\n![{f[0]} · {f[2]}](assets/figures/svg/{f[1]}.svg)\n\n**Teaches:** {f[4]} **Exercise:** {f[5]} **Use it in:** {f[3]}. PNG: [`{f[1]}.png`](assets/figures/png/{f[1]}.png)\n' for f in figs])
    am = {a['name']: a for a in agents['agents']}
    out['docs/agents.md'] = '\n'.join(['# Agent team\n', f'<!-- {GEN} -->\n', agents['pattern'] + '\n',
        table(['Agent', 'Model', 'Stages', 'Tools', 'Role'], [[f'`{a["name"]}`', a['model'], ', '.join(a['stages']), ', '.join(a['tools']), a['role']] for a in agents['agents']]),
        'Read-only agents: ' + ', '.join(f'`{n}`' for n in agents['read_only']) + '. The homage auditor grades blind: it sees the built output and the card, never the stylist\'s reasoning.\n',
        '## Prompt pack\n', table(['ID', 'Prompt', 'Agent', 'Stage'], [[p[0], f'[{p[2]}](https://github.com/PolymathWizard/BHIL-Stagehand-Theme-Reel/blob/main/prompts/{p[1]})', f'`{p[3]}`', p[4]] for p in prompts])])

    # worked example (fit test computed, never typed)
    import fit_test
    ex = json.loads((root / 'canon' / 'examples' / 'port-delay-index.json').read_text(encoding='utf-8'))
    rows = [r for r in fit_test.fit(themes, ex['u1_words'], ex['shape'], ex['register'], ex['ledger']) if r['hits']]
    rows.sort(key=lambda r: (-r['passes'], -len(r['hits']), r['id']))
    ch = next(t for t in themes if t['id'] == ex['chosen'])
    hits_safety = [r for r in safety['rows'] if ex['chosen'][3:] in r[1] or r[1] == 'All']
    out['docs/worked-example.md'] = '\n'.join([
        f'# Worked example: {ex["title"]}\n', f'<!-- {GEN} -->\n',
        f'A fictional brief taken through the eight moves. The fit test below is computed from canon by `scripts/fit_test.py`, so it changes if a card changes.\n',
        '## The brief\n', f'**{ex["client"]}.** {ex["brief"]}\n',
        '## 1. U1 essence\n', f'Essence words: **{", ".join(ex["u1_words"])}**. Dominant data shape: **{ex["shape"]}**. Register: **{ex["register"].upper() if ex["register"] == "b2b" else ex["register"]}**.\n',
        '## 2. Fit test\n', 'Only themes with at least one essence match are shown. A theme passes with two or more matches and the right data shape.\n',
        table(['Theme', 'Matches', 'Fit', 'Shape', 'Result', 'Notes'], [[f'[{r["id"]} {r["name"]}](themes/{next(t["slug"] for t in themes if t["id"] == r["id"])}.md)', ', '.join(r['hits']), r['score'], 'yes' if r['shape'] else 'no',
            'eligible' if r['eligible'] else ('passes, blocked' if r['passes'] else 'fails'), '; '.join(r['notes']) or ' '] for r in rows]),
        '```text\n' + f'python3 scripts/fit_test.py --words "{", ".join(ex["u1_words"])}" --shape {ex["shape"]} --register {ex["register"]} --ledger {",".join(ex["ledger"])}' + '\n```\n',
        '## 3. Triptych\n', 'At most one concept is theme-led, so the comparison stays honest.\n', table(['Concept', 'Kind', 'Direction'], ex['triptych']),
        '## 4. Ledger\n', ex['ledger_note'] + f' Collision note for the pick: {ch["collision"]}\n',
        '## 5. Dial\n', f'B2B register, so Boardroom. {ch["id"]} {ch["name"]}: {dial["b2b_fit"][ch["b2b"]].lower()}. Boardroom translation: *{ch["boardroom"]}*\n',
        '## 6. Slots\n', f'S1 comes from the subject; the theme dresses it. {ex["s1"]}\n', table(['Slot', 'Card fill', 'At Boardroom'], [[s, ch['slots'][s], 'Keep' if s in ('S1', 'S4') else 'Keep, calm'] for s in ('S1', 'S2', 'S3', 'S4', 'S5')]),
        '## 7. Swap test and safety\n', f'Guardrails for {ch["id"]}: {ch["guardrails"]} Nothing in the plan needs a property to make sense, so homage-check is PASS.\n',
        table(['Safety risk', 'Rule'], [[r[0], r[2]] for r in hits_safety]),
        '## 8. Manifest\n', '```text\n' + '\n'.join([ex['manifest'], f'chapter step-up: {ex["step_up"]}', f'audio: {ex["audio"]}', f'flash test: {ex["flash"]}']) + '\n```\n'])
    cl = root / 'CHANGELOG.md'
    if cl.exists():
        out['docs/changelog.md'] = f'<!-- {GEN} Source: CHANGELOG.md -->\n' + cl.read_text(encoding='utf-8')

    # README markers
    readme = root / 'README.md'
    if readme.exists():
        s = readme.read_text(encoding='utf-8')
        blocks = {'roster': table(['ID', 'Codename', 'Feel', 'Home', 'B2B fit'], [[t['id'], f'[{t["name"]}](docs/themes/{t["slug"]}.md)', t['feel'], t['home_register'], dial['b2b_fit'][t['b2b']]] for t in themes]),
                  'figures': table(['ID', 'Figure', 'Use it in'], [[f[0], f'[{f[2]}](docs/assets/figures/png/{f[1]}.png)', f[3]] for f in figs]),
                  'counts': f'**{len(themes)} themes · {len(fams)} families · {len(dial["levels"])} intensity levels · {len(slotsc["slots"])} web slots · {len(figs)} figures · {len(agents["agents"])} agents · {len(prompts)} prompts · {len(fonts)} open-license font families**\n'}
        for k, v in blocks.items():
            s = re.sub(rf'(<!-- BEGIN:{k} -->\n).*?(<!-- END:{k} -->)', lambda m: m.group(1) + v + m.group(2), s, flags=re.S)
        out['README.md'] = s

    man = ''.join(f'{hashlib.sha256(v.encode("utf-8")).hexdigest()}  {p}\n' for p, v in sorted(out.items()) if p != 'README.md')
    out['MANIFEST.sha256'] = man
    return out


def main():
    out = generate()
    for p, v in out.items():
        f = ROOT / p; f.parent.mkdir(parents=True, exist_ok=True); f.write_text(v, encoding='utf-8')
    print(f'wrote {len(out)} derived artifacts')


if __name__ == '__main__':
    main()
