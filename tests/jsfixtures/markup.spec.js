/**
 * Unit tests for the stored-content contract.
 *
 * These assertions are the contract, not a paraphrase of it: RELATIONS.md section A1 gives a
 * canonical example, and the first test below compares the produced bytes against that exact
 * string. Everything else in this plugin can be rewritten; what this file asserts is what ends
 * up in customers' databases and has to stay readable by every future version.
 *
 * Run with: node tests/jsfixtures/markup.spec.js
 */

import './dom.js';
import assert from 'node:assert';
import {
    EDITABLE_FORMAT,
    MARKER,
    SCORE_SELECTOR,
    buildScoreHtml,
    escapeSource,
    findScoreElement,
    formatOf,
    normaliseSource,
    readScoreElement,
} from 'tiny_sheetmusic/markup';

/** @type {string[]} What local_sheetmusic\local\formats::STORABLE holds. */
const STORABLE = ['abc', 'musicxml'];

// --- Section A1, byte for byte ---------------------------------------------------------

const canonical = '<pre class="sheetmusic sheetmusic-abc">X:1\nM:4/4\nK:G\n|GABc dedB|</pre>';
assert.strictEqual(
    buildScoreHtml({source: 'X:1\nM:4/4\nK:G\n|GABc dedB|', format: 'abc'}),
    canonical,
    'the canonical form of RELATIONS.md section A1, character for character'
);

// --- Rule 3: the marker comes first, then exactly one format token ----------------------

const tokens = /class="([^"]*)"/.exec(canonical)[1].split(' ');
assert.deepStrictEqual(tokens, ['sheetmusic', 'sheetmusic-abc'], 'marker first, format second');
assert.strictEqual(tokens.filter((token) => token.startsWith('sheetmusic-')).length, 1);

// --- Rule 1: the container is a pre, and nothing else ----------------------------------

assert.ok(canonical.startsWith('<pre '), 'the container is a pre');
assert.ok(canonical.endsWith('</pre>'), 'and it is closed as one');
assert.strictEqual(
    /<pre ([^>]*)>/.exec(canonical)[1].replace(/class="[^"]*"/, '').trim(),
    '',
    'rule 8: class is the only attribute'
);
assert.ok(!/data-/.test(canonical), 'rule 2: no data attributes, HTMLPurifier strips them');

// --- Rule 7: exactly three characters are escaped ---------------------------------------

assert.strictEqual(
    escapeSource('a & b < c > d "e" \'f\' é ♪'),
    'a &amp; b &lt; c &gt; d "e" \'f\' é ♪',
    'quotes, apostrophes and non-ASCII are left alone: HTMLPurifier decodes them anyway'
);
assert.strictEqual(escapeSource('&amp;'), '&amp;amp;', 'ampersand first, so escaping is applied once and not twice');
assert.strictEqual(escapeSource('<>&'), '&lt;&gt;&amp;');

// The MusicXML that section A3 says the filter reads from v1 survives the same escaping.
const xml = '<?xml version="1.0"?>\n<score-partwise version="4.0">M & Co</score-partwise>';
const xmlblock = buildScoreHtml({source: xml, format: 'musicxml'});
assert.ok(xmlblock.startsWith('<pre class="sheetmusic sheetmusic-musicxml">&lt;?xml version="1.0"?&gt;'));
assert.ok(!/&amp;amp;/.test(xmlblock), 'no double encoding');

// --- Rule 6: never a newline straight after the opening tag ------------------------------

// The HTML parser eats it silently and permanently on the first round trip
// (P0-FINDINGS-T1 surprise 3), so a leading newline is a lost line, not untidy markup.
assert.strictEqual(
    buildScoreHtml({source: '\n\nX:1\nK:G\n|GABc|', format: 'abc'}),
    '<pre class="sheetmusic sheetmusic-abc">X:1\nK:G\n|GABc|</pre>'
);
assert.ok(!/<pre[^>]*>\n/.test(buildScoreHtml({source: '\nX:1\nK:C\nC|', format: 'abc'})));

// --- Rule 5: LF in, LF out, and no trimming of anything else -----------------------------

assert.strictEqual(normaliseSource('a\r\nb\rc\nd'), 'a\nb\nc\nd', 'CRLF and lone CR both become LF');
assert.strictEqual(
    buildScoreHtml({source: 'X:1\r\nK:G\r\n\t|GABc|  \r\n  |dedB|\r\n\r\n|]\r\n', format: 'abc'}),
    '<pre class="sheetmusic sheetmusic-abc">X:1\nK:G\n\t|GABc|  \n  |dedB|\n\n|]\n</pre>',
    'tabs, leading spaces, trailing spaces, blank lines and the trailing newline all survive'
);

// --- An empty score is never stored ------------------------------------------------------

assert.throws(() => buildScoreHtml({source: '', format: 'abc'}), /source and a format/);
assert.throws(() => buildScoreHtml({source: 'X:1', format: ''}), /source and a format/);
assert.throws(() => buildScoreHtml({source: 'X:1', format: 'a b'}), /source and a format/);

// --- Reading a score back, by the marker class only (section C2) --------------------------

document.body.innerHTML = `
    <div id="editor">
        <p id="prose">Some prose</p>
        ${canonical.replace('<pre ', '<pre id="score" ')}
        <pre id="plain" class="prettyprint">not a score</pre>
        <pre id="unknown" class="sheetmusic sheetmusic-mei sheetmusic-scale-l">reserved format</pre>
        <pre id="scaled" class="sheetmusic sheetmusic-scale-s sheetmusic-abc">X:1\nK:D\n|DEFG|</pre>
        <div id="notpre" class="sheetmusic sheetmusic-abc">X:1\nK:C\nC|</div>
    </div>
`;

const score = document.getElementById('score');
const read = readScoreElement(score, STORABLE);
assert.strictEqual(read.format, 'abc');
assert.strictEqual(read.source, 'X:1\nM:4/4\nK:G\n|GABc dedB|', 'the browser has already decoded the entities');
assert.strictEqual(read.element, score);

assert.strictEqual(readScoreElement(document.getElementById('plain'), STORABLE), null, 'no marker, no score');
assert.strictEqual(
    formatOf(document.getElementById('unknown'), STORABLE),
    null,
    'section A3: an unrecognised sheetmusic-* token is ignored, not an error'
);
assert.strictEqual(
    formatOf(document.getElementById('scaled'), STORABLE),
    'abc',
    'a scale token alongside the format token does not hide the format token'
);

// The selector is the marker class and nothing else, so a marked element the contract does
// not currently describe is still found rather than silently skipped.
assert.strictEqual(SCORE_SELECTOR, `.${MARKER}`);
assert.strictEqual(EDITABLE_FORMAT, 'abc');
assert.strictEqual(formatOf(document.getElementById('notpre'), STORABLE), 'abc');

// --- Finding the score a caret is inside --------------------------------------------------

assert.strictEqual(findScoreElement(score.firstChild), score, 'from a text node inside it');
assert.strictEqual(findScoreElement(score), score, 'from the element itself');
assert.strictEqual(findScoreElement(document.getElementById('prose')), null, 'from unrelated prose');
assert.strictEqual(findScoreElement(null), null);

// --- The round trip the edit path depends on -----------------------------------------------

const awkward = 'X:1\nM:4/4\nK:G\n%%score (1 2)\n"Gm"G2 & c2 | a < b > c\nw: café it\'s ♪\n|GABc|';
const holder = document.createElement('div');
holder.innerHTML = buildScoreHtml({source: awkward, format: 'abc'});
assert.strictEqual(
    readScoreElement(holder.firstChild, STORABLE).source,
    awkward,
    'escape, park in the DOM, read back: the author gets their own text'
);
assert.strictEqual(
    buildScoreHtml(readScoreElement(holder.firstChild, STORABLE)),
    buildScoreHtml({source: awkward, format: 'abc'}),
    'and a second save produces identical bytes, so no spurious diff'
);

// eslint-disable-next-line no-console
console.log('markup.spec.js: all assertions passed');
