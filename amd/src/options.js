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
 * Per-context options for the Tiny sheet music plugin.
 *
 * These are the values plugininfo::get_plugin_configuration_for_context() computed for the
 * context this editor instance is running in.
 *
 * @module      tiny_sheetmusic/options
 * @copyright   2026 Adam Jenkins <adam@wisecat.net>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getPluginOptionName} from 'editor_tiny/options';
import {pluginName} from 'tiny_sheetmusic/common';

const contextIdName = getPluginOptionName(pluginName, 'contextid');
const filterActiveName = getPluginOptionName(pluginName, 'filteractive');
const storableFormatsName = getPluginOptionName(pluginName, 'storableformats');

/**
 * Register the options for the Tiny sheet music plugin.
 *
 * @param {TinyMCE} editor
 */
export const register = (editor) => {
    const registerOption = editor.options.register;

    registerOption(contextIdName, {
        processor: 'number',
        "default": 0,
    });

    registerOption(filterActiveName, {
        processor: 'boolean',
        "default": true,
    });

    registerOption(storableFormatsName, {
        processor: 'array',
        "default": [],
    });
};

/**
 * The id of the context this editor instance is running in.
 *
 * @param {TinyMCE} editor
 * @returns {number}
 */
export const getContextId = (editor) => editor.options.get(contextIdName);

/**
 * Whether filter_sheetmusic will render scores authored in this context.
 *
 * @param {TinyMCE} editor
 * @returns {boolean}
 */
export const isFilterActive = (editor) => editor.options.get(filterActiveName);

/**
 * The score formats that may be stored inline in Moodle content.
 *
 * @param {TinyMCE} editor
 * @returns {string[]}
 */
export const getStorableFormats = (editor) => editor.options.get(storableFormatsName);
