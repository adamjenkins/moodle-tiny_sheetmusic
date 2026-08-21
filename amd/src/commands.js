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
 * Toolbar button and menu item for the Tiny sheet music plugin.
 *
 * Registration only. Everything the button does is in `tiny_sheetmusic/ui`.
 *
 * @module      tiny_sheetmusic/commands
 * @copyright   2026 Adam Jenkins <adam@wisecat.net>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {getStrings} from 'core/str';
import {buttonName, component, icon} from 'tiny_sheetmusic/common';
import {findScoreElement} from 'tiny_sheetmusic/markup';
import {isScoreSelected, startAction} from 'tiny_sheetmusic/ui';

/** @type {string[]} The strings the button and the modal need, resolved once per editor. */
const KEYS = [
    'buttontitle',
    'menuitem',
    'modaltitleedit',
    'modaltitleinsert',
    'noteditabletitle',
    'savebuttonedit',
    'savebuttoninsert',
];

/**
 * Resolve everything the setup function needs, then return the setup function itself.
 *
 * TinyMCE's PluginManager.add() callback cannot be asynchronous, so every await has to happen
 * before it is called. Currying is how the core tiny subplugins solve this.
 *
 * @returns {Promise<function>} The setup function, ready to be handed a TinyMCE instance.
 */
export const getSetup = async() => {
    const [values, buttonImage] = await Promise.all([
        getStrings(KEYS.map((key) => ({key, component}))),
        getButtonImage('icon', component),
    ]);

    const strings = {};
    KEYS.forEach((key, at) => {
        strings[key] = values[at];
    });

    return (editor) => {
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // A toggle button rather than a plain one: it lights up when the caret is inside a
        // score, which is what tells the author that pressing it will edit that score rather
        // than insert a second one next to it.
        editor.ui.registry.addToggleButton(buttonName, {
            icon,
            tooltip: strings.buttontitle,
            onAction: () => startAction(editor, strings),
            onSetup: (api) => {
                const update = () => api.setActive(isScoreSelected(editor));
                // SelectionChange as well as NodeChange: a selection moved by script rather
                // than by the mouse - which is how Behat drives the editor, and how another
                // plugin's command would do it - raises only the former.
                editor.on('NodeChange SelectionChange', update);
                return () => editor.off('NodeChange SelectionChange', update);
            },
        });

        editor.ui.registry.addMenuItem(buttonName, {
            icon,
            text: strings.menuitem,
            onAction: () => startAction(editor, strings),
        });

        // Clicking a score opens it. The stored form of a score is its source text, which is
        // not something to be edited character by character in the middle of a paragraph, so
        // the block behaves as one object: point at it and the editor that understands it
        // opens.
        editor.on('click', (event) => {
            const element = findScoreElement(event.target);
            if (element) {
                event.preventDefault();
                startAction(editor, strings, element);
            }
        });
    };
};
