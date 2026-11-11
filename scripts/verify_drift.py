"""Drift gate: regenerate every derived artifact in memory and fail on any byte that differs. Stdlib only.

Derived artifacts are never hand-edited (ADR-001). If this fails, edit canon and run
python3 scripts/build_derived.py, or revert the hand edit.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_derived import ROOT, generate

GLOBS = ['docs/worked-example.md', 'docs/changelog.md', 'docs/themes/*.md', 'docs/codex/*.md', 'docs/reel/beats.md', 'docs/reel/engine.md', 'docs/reel/data-beat.md', 'docs/reference/*.md', 'tokens/**/*.css', 'tokens/*.json']


def main():
    out = generate(); bad = []
    for p, v in sorted(out.items()):
        f = ROOT / p
        if not f.exists():
            bad.append(f'missing: {p}')
        elif f.read_bytes() != v.encode('utf-8'):
            bad.append(f'drift: {p}')
    for g in GLOBS:
        for f in ROOT.glob(g):
            rel = f.relative_to(ROOT).as_posix()
            if rel not in out:
                bad.append(f'stray (not generated): {rel}')
    if bad:
        print('DRIFT GATE FAIL\n  ' + '\n  '.join(bad) + '\nEdit canon/*.json, then run: python3 scripts/build_derived.py')
        sys.exit(1)
    print(f'DRIFT GATE PASS · {len(out)} derived artifacts match canon')


if __name__ == '__main__':
    main()
