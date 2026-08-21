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
 * Names shared by every module in the Tiny sheet music plugin.
 *
 * Exported as a default object, not as named constants: Moodle's AMD build makes the default
 * export the module's AMD return value, which is what lets the other modules import these as
 * named bindings. This is the shape every core tiny subplugin uses.
 *
 * @module      tiny_sheetmusic/common
 * @copyright   2026 Adam Jenkins <adam@wisecat.net>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export default {
    pluginName: 'tiny_sheetmusic/plugin',
    component: 'tiny_sheetmusic',
    buttonName: 'tiny_sheetmusic',
    icon: 'tiny_sheetmusic',
};
