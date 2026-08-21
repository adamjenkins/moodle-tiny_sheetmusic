// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Writing and reading the stored-content contract.
 *
 * This module is the whole of `tiny_sheetmusic`'s side of RELATIONS.md section A. It is kept
 * apart from the modal that uses it, and free of every Moodle import, because the contract is
 * the part of this plugin that ends up in customers' databases: it is worth being able to
 * assert its output byte for byte under bare node, which `tests/jsfixtures/markup.spec.js`
 * does.
 *
 * The four rules that are easy to get wrong, and where each is implemented:
 *
 * - **Rule 3, token order.** `sheetmusic` is written first and the format token second, by
 *   `buildScoreHtml()`. The filter tokenises rather than string-matches, so order is not
 *   strictly load-bearing on the read side - but section C1 states the order, and content
 *   written today is read by filters not yet written.
 * - **Rule 6, no newline after `<pre>`.** `normaliseSource()` strips leading newlines.
 *   A newline there is destroyed by the HTML parser on the first editor round trip, silently
 *   and permanently (P0-FINDINGS-T1 surprise 3), so writing one loses a line of the author's
 *   score rather than merely looking untidy.
 * - **Rule 7, minimal escaping.** `escapeSource()` escapes `&`, `<` and `>` and stops.
 *   HTMLPurifier decodes every other entity on save, so `&quot;` becomes a literal quote in
 *   the database and every subsequent save shows a spurious diff.
 * - **Rule 5, LF line endings.** Moodle's form submission rewrites LF to CRLF exactly once,
 *   which is invisible here because the browser's HTML parser normalises it straight back;
 *   `normaliseSource()` nevertheless normalises on both directions of travel so that nothing
 *   downstream has to care which side of that rewrite it is on.
 *
 * @module      tiny_sheetmusic/markup
 * @copyright   2026 Adam Jenkins <adam@wisecat.net>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/** @type {string} The marker class token. Its presence is what makes a `<pre>` a score. */
export const MARKER = 'sheetmusic';

/** @type {string} Locates a stored score by the marker class and by nothing else (section C2). */
export const SCORE_SELECTOR = `.${MARKER}`;

/** @type {string} The only format this plugin writes, and the only one it can reopen, in v1. */
export const EDITABLE_FORMAT = 'abc';

/**
 * Escape a score source for storage as the text content of a `<pre>`.
 *
 * Exactly three characters, ampersand first so that the entities introduced by the other two
 * are not escaped again.
 *
 * @param {string} text The score source.
 * @returns {string} The escaped source.
 */
export const escapeSource = (text) => String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Put a score source into the form the contract stores.
 *
 * Line endings become LF and leading newlines are removed. Nothing else is touched: whitespace
 * inside an ABC body is significant (rule 5), so no trimming, reflowing or tab expansion
 * happens here even though it would make the stored bytes tidier.
 *
 * @param {string} text A score source, from anywhere.
 * @returns {string} The same source, contract-shaped.
 */
export const normaliseSource = (text) => String(text === null || text === undefined ? '' : text)
    .replace(/\r\n?/g, '\n')
    .replace(/^\n+/, '');

/**
 * Build the markup for one stored score.
 *
 * @param {object} score {source, format}.
 * @returns {string} A section A1 conformant `<pre>` element, as HTML.
 * @throws {Error} If there is no source or no format, which is a programming error: an empty
 *                 score must be rejected before it reaches the contract, not stored as one.
 */
export const buildScoreHtml = (score) => {
    const source = normaliseSource(score && score.source);
    const format = String((score && score.format) || '');
    if (source === '' || !/^[a-z][a-z0-9]*$/.test(format)) {
        throw new Error('tiny_sheetmusic: a stored score needs both a source and a format');
    }
    return `<pre class="${MARKER} ${MARKER}-${format}">${escapeSource(source)}</pre>`;
};

/**
 * The format token carried by an element's class list.
 *
 * @param {Element} element A candidate score element.
 * @param {string[]} known The format names that may appear as a stored source.
 * @returns {string|null} The format, or null when the element is not a score at all.
 */
export const formatOf = (element, known) => {
    if (!element || !element.getAttribute) {
        return null;
    }
    const tokens = String(element.getAttribute('class') || '').split(/\s+/).filter(Boolean);
    if (!tokens.includes(MARKER)) {
        return null;
    }
    const prefix = `${MARKER}-`;
    const formats = (known && known.length) ? known : [EDITABLE_FORMAT];
    const found = tokens
        .filter((token) => token.startsWith(prefix))
        .map((token) => token.slice(prefix.length))
        .find((candidate) => formats.includes(candidate));
    return found || null;
};

/**
 * Read a stored score back out of the editor's DOM.
 *
 * `textContent` is used rather than `innerHTML` because by this point the browser has already
 * done the decoding: the entities are characters again and the CRLF the database holds has
 * been normalised to LF by the parser. That is the whole reason the contract stores text in a
 * `<pre>` and not markup anywhere else.
 *
 * @param {Element} element A candidate score element.
 * @param {string[]} known The format names that may appear as a stored source.
 * @returns {object|null} {element, source, format}, or null when this is not a score.
 */
export const readScoreElement = (element, known) => {
    const format = formatOf(element, known);
    if (format === null) {
        return null;
    }
    return {
        element,
        format,
        source: normaliseSource(element.textContent),
    };
};

/**
 * Find the score a node sits inside, if any.
 *
 * @param {Node} node Anywhere in the editor's document.
 * @returns {Element|null} The score element, or null.
 */
export const findScoreElement = (node) => {
    if (!node) {
        return null;
    }
    const element = node.nodeType === 1 ? node : node.parentElement;
    return element && element.closest ? element.closest(SCORE_SELECTOR) : null;
};
