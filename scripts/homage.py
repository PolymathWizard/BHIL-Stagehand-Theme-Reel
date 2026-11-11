"""Hashed homage deny list (ADR-002). Stdlib only.

The public edition must never name the works its themes are inspired by. The names live in an
internal file that is never committed (internal/ is gitignored); only salted SHA-256 hashes of
each normalized phrase ship in canon/homage-denylist.json, so the check is enforceable in public
CI without publishing the list it checks against.

    python3 scripts/homage.py hash internal/homage-denylist.json   # refresh the hashes
    python3 scripts/homage.py scan <file>...                        # scan files, print hits
"""
import hashlib, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANON = ROOT / 'canon' / 'homage-denylist.json'
SALT = 'stagehand-stc-v1'
DATA_URI = re.compile(r'data:[a-z]+/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+')


def norm(text):
    return re.sub(r'[^a-z0-9]+', ' ', text.lower()).split()


def digest(phrase):
    return hashlib.sha256(f'{SALT}:{" ".join(norm(phrase))}'.encode()).hexdigest()


def grams(text, n=3):
    t = norm(DATA_URI.sub(' ', text))
    for k in range(1, n + 1):
        for i in range(len(t) - k + 1):
            yield ' '.join(t[i:i + k])


def load(path=CANON):
    d = json.loads(Path(path).read_text(encoding='utf-8'))
    return set(d['hashes']), d['max_words']


def hits(text, hashes, n):
    return sorted({g for g in grams(text, n) if digest(g) in hashes})


def main(argv):
    if argv[:1] == ['hash']:
        phrases = json.loads(Path(argv[1]).read_text(encoding='utf-8'))['phrases']
        n = max(len(norm(p)) for p in phrases)
        CANON.write_text(json.dumps({'note': 'Salted SHA-256 of each normalized deny-list phrase. The phrases themselves are internal and never ship (ADR-002).',
                                     'salt': SALT, 'max_words': n, 'count': len(phrases), 'hashes': sorted(digest(p) for p in phrases)}, indent=2) + '\n')
        print(f'wrote {CANON.relative_to(ROOT)}: {len(phrases)} phrases, up to {n} words')
    elif argv[:1] == ['scan']:
        hs, n = load(); bad = 0
        for f in argv[1:]:
            h = hits(Path(f).read_text(encoding='utf-8', errors='ignore'), hs, n)
            if h:
                bad += 1; print(f'{f}: {len(h)} deny-list hit(s)')
        sys.exit(1 if bad else 0)
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main(sys.argv[1:])
