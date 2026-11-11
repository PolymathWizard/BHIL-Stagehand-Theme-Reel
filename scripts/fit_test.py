"""Theme fit test (U1 to U3), stdlib only.

A theme is shortlisted when its essence words match two or more U1 words and its data shapes include
the U1 data shape. The register then sets the intensity and removes themes that cannot serve it, and
the ledger removes themes used in the last two builds.

    python3 scripts/fit_test.py --words "monitoring, precision, systems, warning, compliance" \\
        --shape score --register b2b --ledger TX-03
"""
import argparse, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEVEL = {'creative': 'full', 'editorial': 'tempered', 'b2b': 'boardroom'}


def matches(words, essence):
    hit = []
    for w in words:
        w = w.strip().lower()
        if any(w == e.lower() or re.search(rf'\b{re.escape(w)}\b', e.lower()) for e in essence):
            hit.append(w)
    return hit


def fit(themes, words, shape, register, ledger=()):
    rows = []
    for t in themes:
        hit = matches(words, t['essence']); shape_ok = shape in t['data_shapes']
        notes = []
        level = LEVEL[register]
        if register == 'b2b':
            if t['b2b'] == 'avoid':
                notes.append('never pitched for B2B')
            elif t['b2b'] == 'temp':
                level = 'tempered'; notes.append('Tempered is the ceiling, so it cannot serve a B2B register')
            elif t['b2b'] == 'news':
                notes.append('Boardroom is news-desk only')
        if t['id'] in ledger:
            notes.append('used in the last two builds (ledger)')
        passes = len(hit) >= 2 and shape_ok
        eligible = passes and not any(n.startswith(('never', 'Tempered', 'used')) for n in notes)
        rows.append({'id': t['id'], 'name': t['name'], 'hits': hit, 'score': f'{len(hit)}/{len(words)}', 'shape': shape_ok, 'passes': passes,
                     'level': level, 'eligible': eligible, 'notes': notes})
    return rows


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--words', required=True); ap.add_argument('--shape', required=True)
    ap.add_argument('--register', choices=sorted(LEVEL), required=True); ap.add_argument('--ledger', default='')
    a = ap.parse_args()
    themes = json.loads((ROOT / 'canon' / 'themes.json').read_text(encoding='utf-8'))['themes']
    words = [w for w in a.words.split(',') if w.strip()]
    rows = [r for r in fit(themes, words, a.shape, a.register, [x.strip() for x in a.ledger.split(',') if x.strip()]) if r['hits']]
    for r in sorted(rows, key=lambda r: (-r['passes'], -len(r['hits']), r['id'])):
        mark = 'ELIGIBLE' if r['eligible'] else ('passes fit, blocked' if r['passes'] else 'fails fit')
        print(f"{r['id']} {r['name']:<20} fit {r['score']}  shape {'yes' if r['shape'] else 'no ':<3}  {mark:<20} {'; '.join(r['notes'])}")


if __name__ == '__main__':
    main()
