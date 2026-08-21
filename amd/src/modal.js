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
 * The modal the score editor is hosted in.
 *
 * All the Moodle chrome around the editing surface lives here, because the surface itself owns
 * none: `local_sheetmusic/editor` renders into a container it is handed and has no buttons,
 * no title and no idea it is in a dialogue (RELATIONS.md section B1).
 *
 * @module      tiny_sheetmusic/modal
 * @copyright   2026 Adam Jenkins <adam@wisecat.net>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ModalSaveCancel from 'core/modal_save_cancel';

/**
 * The modal the score editor is hosted in.
 */
export default class SheetmusicModal extends ModalSaveCancel {
    /** @type {string} The modal type name Moodle registers this class under. */
    static TYPE = 'tiny_sheetmusic/modal';

    /** @type {string} The core save/cancel shell; the body is this plugin's own template. */
    static TEMPLATE = 'core/modal_save_cancel';

    /**
     * Make it large and self-removing.
     *
     * A score editor is two panes side by side plus a preview, so the default modal width is
     * unusable; `scrollable` is switched off because the surface scrolls its own preview and a
     * scrollable body would put a second scrollbar around the whole thing.
     *
     * @param {object} modalConfig The configuration Modal.create() was given.
     * @returns {void}
     */
    configure(modalConfig) {
        modalConfig.large = true;
        modalConfig.scrollable = false;
        modalConfig.removeOnClose = true;

        super.configure(modalConfig);
    }
}

SheetmusicModal.registerModalType();
