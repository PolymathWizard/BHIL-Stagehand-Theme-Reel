"""Regression tests. Each test names the bug it prevents. Stdlib only: python3 -m unittest discover -s tests"""
import json, re, shutil, subprocess, sys, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
import build_derived as bd
import homage


def C(n):
    return json.loads((ROOT / 'canon' / n).read_text(encoding='utf-8'))


class ContrastTests(unittest.TestCase):
    def test_luminance_formula_extremes(self):
        """Bug: a typo in the sRGB linearization threshold (0.03928) would skew every ratio and let a low-contrast ink pass."""
        self.assertAlmostEqual(bd.contrast('#FFFFFF', '#000000'), 21.0, places=2)
        self.assertAlmostEqual(bd.contrast('#777777', '#FFFFFF'), 4.48, places=2)

    def test_every_ink_reaches_eleven_to_one(self):
        """Bug: STC v1.0 claimed 11:1 for every ink, but TX-19 measured 10.97:1 until its ink was darkened to #3C2B2D in v1.0.0 of this repo."""
        for t in C('themes.json')['themes']:
            self.assertGreaterEqual(bd.contrast(t['tokens']['ink'], t['tokens']['bg']), 11, t['id'])


class ReelTests(unittest.TestCase):
    def test_every_data_beat_runs_nine_and_a_half_seconds(self):
        """Bug: reel v5 stretched every S4 beat to 9.5 s for build, insight, re-sort and rank; a theme left at 6 s cuts the re-sort off mid-move."""
        beats = bd.beats_from_scenes(ROOT)
        self.assertEqual(len(beats), 20)
        for tid, b in beats.items():
            s4 = [x for x in b if x[0] == 'S4']
            self.assertEqual(len(s4), 1, tid)
            self.assertEqual(s4[0][2], 9.5, tid)

    def test_back_out_ease_never_goes_negative(self):
        """Bug: backOutS(0) returned -8e-16, a negative arc radius, and the TX-06 data beat threw on its first frame."""
        src = (ROOT / 'reel' / 'src' / 'dataviz.js').read_text(encoding='utf-8')
        self.assertRegex(src, r'const backOutS = p => \(p <= 0 \? 0 : p >= 1 \? 1 : Math\.max\(0,')

    def test_data_js_is_generated_from_canon(self):
        """Bug: a hand edit to reel/src/data.js let the reel drift from the codex tokens it claims to demonstrate."""
        self.assertEqual((ROOT / 'reel' / 'src' / 'data.js').read_text(encoding='utf-8'), bd.generate()['reel/src/data.js'])

    def test_public_reel_carries_no_inspiration_field(self):
        """Bug: reels v1 to v5 shipped an inspo field and a Hide inspirations toggle; the public edition must not carry the names at all."""
        for p in [ROOT / 'reel' / 'src' / 'data.js', ROOT / 'reel' / 'src' / 'shell.html', ROOT / 'reel' / 'src' / 'engine.js', ROOT / 'canon' / 'themes.json']:
            s = p.read_text(encoding='utf-8')
            self.assertNotIn('inspo', s, p.name)
            self.assertNotIn('public-safe', s, p.name)

    @unittest.skipUnless(shutil.which('node') and (ROOT / 'reel' / 'dist' / 'stagehand-theme-reel.html').exists(), 'needs node and a built reel')
    def test_stub_sweep_one_loop(self):
        """Bug: scene code that only fails at one level or late in a loop (a Boardroom freeze modulo, an unclamped ease) slipped past spot checks."""
        r = subprocess.run(['node', str(ROOT / 'tests' / 'reel_stub_sweep.js'), str(ROOT / 'reel' / 'dist' / 'stagehand-theme-reel.html'), '1'], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout[-2000:] + r.stderr[-2000:])


class HomageTests(unittest.TestCase):
    def test_normalization_catches_punctuation_and_case(self):
        """Bug: a deny list that only matched space-separated lowercase words let 'Word-Word' or 'WORD' variants through."""
        hs = {homage.digest('alpha beta')}
        self.assertEqual(homage.hits('ALPHA-Beta returns', hs, 2), ['alpha beta'])
        self.assertEqual(homage.hits('alphabeta', hs, 2), [])

    def test_data_uris_are_not_scanned(self):
        """Bug: base64 font data inside SVG and HTML can spell short words by chance and raise false homage failures."""
        hs = {homage.digest('xyz')}
        self.assertEqual(homage.hits('url(data:font/woff2;base64,AAxyz+xyz/xyz=)', hs, 1), [])

    def test_validator_ships_no_names(self):
        """Bug: the first figure-kit validator kept franchise names in a plain-text regex, publishing the very list it enforced."""
        hs, n = homage.load()
        for p in (ROOT / 'scripts').glob('*.py'):
            self.assertEqual(homage.hits(p.read_text(encoding='utf-8'), hs, n), [], p.name)

    def test_adr_numbers_are_not_flagged(self):
        """Bug: a three-digit agent number on the deny list matched 'ADR-007' links and failed the safety page."""
        hs, n = homage.load()
        self.assertEqual(homage.hits('See ADR-007 and ADR-001.', hs, n), [])


class CanonTests(unittest.TestCase):
    def test_slugs_drop_curly_apostrophes(self):
        """Bug: the curly apostrophe in OTHERSIDE ’83 could become a stray hyphen and break every link to its page."""
        t = next(t for t in C('themes.json')['themes'] if t['id'] == 'TX-06')
        self.assertEqual(t['slug'], 'tx-06-otherside-83')
        self.assertTrue(t['seed'].startswith('TX-06 OTHERSIDE ’83:'))

    def test_no_dashes_in_canon(self):
        """Bug: the internal codex wrote ranges with en dashes; the BHIL dash gate forbids them in every derived file."""
        for p in (ROOT / 'canon').glob('*.json'):
            raw = p.read_bytes()
            self.assertNotIn(b'\xe2\x80\x94', raw, p.name)
            self.assertNotIn(b'\xe2\x80\x93', raw, p.name)

    def test_family_size_fits_figure_layout(self):
        """Bug: STC-01 and STC-02 assumed four themes per family, and family E's fifth theme ran off the canvas."""
        sizes = [len(f['themes']) for f in C('families.json')['families']]
        self.assertLessEqual(max(sizes), 5)

    def test_read_only_agents_have_no_write_tools(self):
        """Bug: an auditor with Bash can rewrite the build it is grading; blind review needs runtime-enforced isolation."""
        a = C('agents.json')
        for x in a['agents']:
            if x['name'] in a['read_only']:
                self.assertFalse(set(x['tools']) & set(a['write_tools']), x['name'])


class DerivedTests(unittest.TestCase):
    def test_generate_is_deterministic(self):
        """Bug: dict ordering or a timestamp in a generator makes the drift gate flap between runs."""
        self.assertEqual(bd.generate(), bd.generate())

    def test_readme_markers_stay_balanced(self):
        """Bug: a greedy marker regex swallowed the prose between two generated README blocks."""
        s = bd.generate().get('README.md', '')
        for k in ('nav', 'roster', 'figures', 'counts'):
            self.assertEqual(s.count(f'<!-- BEGIN:{k} -->'), 1, k)
            self.assertEqual(s.count(f'<!-- END:{k} -->'), 1, k)
        self.assertIn('## ', s.split('<!-- END:roster -->')[1])

    def test_visual_roster_shows_every_theme(self):
        """Bug: a theme added to canon without a still left a hole in the README grid and a broken image on its card."""
        out = bd.generate(); th = C('themes.json')['themes']
        self.assertEqual(set(C('screens.json')['stills']), {t['id'] for t in th})
        roster = out['README.md'].split('<!-- BEGIN:roster -->')[1].split('<!-- END:roster -->')[0]
        self.assertEqual(roster.count('<img '), len(th))
        for t in th:
            self.assertIn(f'<img src="docs/assets/screens/{t["slug"]}.jpg"', roster)
            self.assertIn(f'](../assets/screens/{t["slug"]}.jpg)', out[f'docs/themes/{t["slug"]}.md'])

    def test_readme_grid_escapes_codenames(self):
        """Bug: an ampersand in a codename went into the README grid unescaped, which GitHub's sanitizer can drop."""
        s = bd.generate()['README.md'].split('<!-- BEGIN:roster -->')[1].split('<details>')[0]
        self.assertNotRegex(s, r'&(?!amp;|lt;|gt;|quot;|#x27;)')

    def test_staging_matches_the_beats(self):
        """Bug: a staging entry out of step with a scene's beats would rack focus across a data beat and blur its chart."""
        import subprocess, pathlib
        src = (ROOT / 'reel' / 'src' / 'helpers.js').read_text() + (ROOT / 'reel' / 'src' / 'stage.js').read_text() + ';JSON.stringify(STAGE)'
        out = subprocess.run(['node', '-e', "const vm=require('vm');let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(vm.runInNewContext(s,{Math,JSON})))"], input=src, capture_output=True, text=True, check=True).stdout
        stage = json.loads(out); beats = bd.beats_from_scenes(pathlib.Path(ROOT))
        self.assertEqual(set(stage), set(beats))
        for tid, S in stage.items():
            self.assertEqual(len(S['beats']), len(beats[tid]), tid)
            for b, beat in zip(S['beats'], beats[tid]):
                if beat[0] == 'S4':
                    self.assertIsNone(b, f'{tid} stages a data beat')
                if b:
                    ps = [k[0] for k in b['k']]
                    self.assertEqual(ps, sorted(ps), tid); self.assertEqual(ps[0], 0, tid)
                    for _, x, y, r in b['k']:
                        self.assertTrue(0 <= x <= 960 and 0 <= y <= 540 and r >= 0, tid)
                    self.assertLessEqual(b.get('zt', 1.3), 1.35, tid)
            self.assertIn((S.get('lens') or {'type': 'barrel'})['type'], ('barrel', 'shimmer', 'ripple', 'boil', 'drops'), tid)
            self.assertIn(S.get('s1', 'reveal'), ('reveal', 'tour', 'push'), tid)

    def test_manifest_lists_every_derived_file(self):
        """Bug: a new generator output was written but never hashed, so its drift went unseen."""
        out = bd.generate(); man = out['MANIFEST.sha256']
        for p in out:
            if p not in ('README.md', 'MANIFEST.sha256'):
                self.assertIn(f'  {p}\n', man)


if __name__ == '__main__':
    unittest.main()
