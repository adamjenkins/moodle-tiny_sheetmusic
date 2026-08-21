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
 * Toolbar and menu placement for the Tiny sheet music plugin.
 *
 * @module      tiny_sheetmusic/configuration
 * @copyright   2026 Adam Jenkins <adam@wisecat.net>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {buttonName} from 'tiny_sheetmusic/common';
import {
    addMenubarItem,
    addToolbarButton,
    addToolbarSection,
} from 'editor_tiny/utils';

/** @var {string} The toolbar section the button belongs in. */
const section = 'advanced';

/**
 * Put the button in the advanced section, next to the other content-insertion tools.
 *
 * addToolbarSection() inserts a section unconditionally and addToolbarButton() pushes into
 * every section whose name matches, so calling both blindly puts the button on the toolbar
 * once per plugin that has already created an 'advanced' section. Verified on a 5.2 site,
 * where tiny_equation creates it first and the button appeared twice. Create it only when
 * nothing else has.
 *
 * @param {object} toolbar The instance toolbar configuration.
 * @returns {object} The updated toolbar configuration.
 */
const configureToolbar = (toolbar) => {
    if (!toolbar.some((existing) => existing.name === section)) {
        addToolbarSection(toolbar, section, 'lists', true);
    }

    return addToolbarButton(toolbar, section, buttonName);
};

/**
 * Add the sheet music button and menu item to this editor instance.
 *
 * @param {object} instanceConfig The TinyMCE instance configuration.
 * @returns {object} The configuration changes to merge.
 */
export const configure = (instanceConfig) => {
    return {
        menu: addMenubarItem(instanceConfig.menu, 'insert', buttonName),
        toolbar: configureToolbar(instanceConfig.toolbar),
    };
};
