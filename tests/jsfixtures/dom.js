/**
 * Minimal DOM bootstrap so amd/src modules can be unit tested under node.
 *
 * Importing this module installs document and window as globals, matching what the modules
 * see in a browser. markup.js needs one because half its job is reading a stored score back
 * out of the editor's DOM, and that half is exactly the half worth testing without a browser.
 *
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {JSDOM} from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');

global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;

export default dom;
