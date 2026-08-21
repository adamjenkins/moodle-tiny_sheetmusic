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
 * @module      tiny_sheetmusic/commands
 * @copyright   2026 Adam Jenkins <adam@wisecat.net>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {getStrings} from 'core/str';
import Modal from 'core/modal';
import {exception as displayException} from 'core/notification';
import {buttonName, component, icon} from 'tiny_sheetmusic/common';
import {isFilterActive} from 'tiny_sheetmusic/options';

/**
 * Build the placeholder dialogue body.
 *
 * The score editing surface itself is a later task. Until it lands, the dialogue reports the
 * one thing that is worth knowing at author time: whether the display filter is switched on in
 * this context, because a score authored where it is not will never be engraved.
 *
 * @param {TinyMCE} editor
 * @param {object} strings The resolved language strings.
 * @returns {HTMLElement} The dialogue body.
 */
const buildBody = (editor, strings) => {
    const body = document.createElement('div');

    const intro = document.createElement('p');
    intro.textContent = strings.placeholderbody;
    body.appendChild(intro);

    const status = document.createElement('p');
    const active = isFilterActive(editor);
    status.className = active ? 'text-muted' : 'alert alert-warning';
    status.textContent = active ? strings.filterready : strings.filterinactive;
    body.appendChild(status);

    return body;
};

/**
 * Open the placeholder dialogue.
 *
 * @param {TinyMCE} editor
 * @param {object} strings The resolved language strings.
 * @returns {Promise<void>}
 */
const handleAction = async(editor, strings) => {
    const modal = await Modal.create({
        title: strings.pluginname,
        show: true,
        removeOnClose: true,
    });
    modal.setBody(buildBody(editor, strings).outerHTML);
};

/**
 * Resolve everything the setup function needs, then return the setup function itself.
 *
 * TinyMCE's PluginManager.add() callback cannot be asynchronous, so every await has to happen
 * before it is called. Currying is how the core tiny subplugins solve this.
 *
 * @returns {Promise<function>} The setup function, ready to be handed a TinyMCE instance.
 */
export const getSetup = async() => {
    const [
        [buttontitle, filterinactive, filterready, menuitem, placeholderbody, pluginname],
        buttonImage,
    ] = await Promise.all([
        getStrings([
            'buttontitle',
            'filterinactive',
            'filterready',
            'menuitem',
            'placeholderbody',
            'pluginname',
        ].map((key) => ({key, component}))),
        getButtonImage('icon', component),
    ]);

    const strings = {buttontitle, filterinactive, filterready, menuitem, placeholderbody, pluginname};

    return (editor) => {
        editor.ui.registry.addIcon(icon, buttonImage.html);

        editor.ui.registry.addButton(buttonName, {
            icon,
            tooltip: strings.buttontitle,
            onAction: () => {
                handleAction(editor, strings).catch(displayException);
            },
        });

        editor.ui.registry.addMenuItem(buttonName, {
            icon,
            text: strings.menuitem,
            onAction: () => {
                handleAction(editor, strings).catch(displayException);
            },
        });
    };
};
