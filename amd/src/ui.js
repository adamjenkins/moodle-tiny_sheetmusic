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
 * Hosting the shared editing surface, and putting what it produces into the field.
 *
 * The division of labour is RELATIONS.md section B1's: `local_sheetmusic/editor` owns the
 * score and nothing else, this module owns the modal, the insert and edit paths, and the
 * author-facing warnings that only make sense at authoring time.
 *
 * ## Why the save button never closes the modal by itself
 *
 * The surface has no buttons, so the modal tells it that Save was pressed by dispatching
 * `EVENT_SAVE` on the container. That event is cancelable, and the surface cancels it: it has
 * to re-engrave the score before it can say whether the score is savable at all, and
 * `preventDefault()` is synchronous while engraving is not. So the veto goes on first and is
 * lifted, a tick later, by the promise resolving. The consequence for this file is that
 * `ModalEvents.save` must always be default-prevented - the modal is closed further down,
 * after the promise has resolved with a score that is known to engrave. A score that does not
 * engrave leaves the promise pending and the modal open, with the surface's own error showing
 * inside it, which is the whole point.
 *
 * @module      tiny_sheetmusic/ui
 * @copyright   2026 Adam Jenkins <adam@wisecat.net>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import ModalEvents from 'core/modal_events';
import Templates from 'core/templates';
import {alert as displayAlert, exception as displayException} from 'core/notification';
import {getString} from 'core/str';
import {EVENT_CANCEL, EVENT_SAVE, open as openEditor} from 'local_sheetmusic/editor';
import SheetmusicModal from 'tiny_sheetmusic/modal';
import {component} from 'tiny_sheetmusic/common';
import {EDITABLE_FORMAT, buildScoreHtml, findScoreElement, readScoreElement} from 'tiny_sheetmusic/markup';
import {getStorableFormats, isFilterActive} from 'tiny_sheetmusic/options';

/** @type {boolean} Whether a dialogue is already open, so a second click cannot open another. */
let dialogueOpen = false;

/**
 * The score the caret is currently inside, if it is inside one.
 *
 * Located by the marker class and by nothing else, as RELATIONS.md section C2 requires: the
 * filter's rendered shape is its own private business and is not in the editor's document
 * anyway, because what the editor holds is the stored form.
 *
 * @param {TinyMCE} editor The editor instance.
 * @param {Element|null} element A score element the caller already has, if any.
 * @returns {object|null} {element, source, format}, or null.
 */
export const getSelectedScore = (editor, element = null) => readScoreElement(
    element || findScoreElement(editor.selection.getNode()),
    getStorableFormats(editor)
);

/**
 * Whether the caret is inside a stored score, for the toolbar button's pressed state.
 *
 * @param {TinyMCE} editor The editor instance.
 * @returns {boolean} True when a score is selected.
 */
export const isScoreSelected = (editor) => getSelectedScore(editor) !== null;

/**
 * Whether a chosen file is a MIDI file.
 *
 * The magic bytes are consulted as well as the name because a MIDI file arrives named anything
 * at all, and the point of asking is to put the limits of MIDI import in front of the author
 * before they accept the guess it produced.
 *
 * @param {File} file The file the author chose.
 * @returns {Promise<boolean>} True for MIDI.
 */
const looksLikeMidi = async(file) => {
    if (/\.(mid|midi)$/i.test(file.name || '')) {
        return true;
    }
    const head = new Uint8Array(await file.slice(0, 4).arrayBuffer());
    return head.length === 4 && head[0] === 0x4D && head[1] === 0x54 && head[2] === 0x68 && head[3] === 0x64;
};

/**
 * Open the MIDI limits panel as soon as a MIDI file is chosen.
 *
 * RELATIONS.md section B3 rule 2 makes the preview-and-adjust step contractual, and the
 * surface provides it; what this adds is the other half of the same rule, which is that the
 * import has to state its limits rather than let a quantised guess pass for a transcription.
 *
 * The listener is on the container rather than on the file input, so that nothing here depends
 * on how the surface lays its own controls out.
 *
 * @param {Element} container The element the surface was rendered into.
 * @param {Element|null} help The disclosure holding the limits.
 * @returns {void}
 */
const revealMidiLimits = (container, help) => {
    if (!help) {
        return;
    }
    container.addEventListener('change', (event) => {
        const input = event.target;
        if (!input || input.type !== 'file' || !input.files || !input.files.length) {
            return;
        }
        const chosen = input.files[0];
        looksLikeMidi(chosen).then((midi) => {
            if (midi) {
                help.open = true;
                help.scrollIntoView({block: 'nearest'});
            }
            return midi;
        }).catch(() => false);
    });
};

/**
 * Put a score into the field, replacing the one being edited if there is one.
 *
 * @param {TinyMCE} editor The editor instance.
 * @param {object} score {source, format} as the surface resolved it.
 * @param {Element|null} target The score element being replaced, for the edit path.
 * @returns {void}
 */
export const insertScore = (editor, score, target) => {
    const html = buildScoreHtml(score);

    editor.undoManager.transact(() => {
        if (target && target.parentNode) {
            // Replaced rather than emptied and refilled, so that a score whose format token
            // changed still ends up with exactly the class list the contract asks for.
            const holder = editor.dom.create('div');
            holder.innerHTML = html;
            editor.dom.replace(holder.firstChild, target);
        } else {
            editor.insertContent(html);
        }
    });

    editor.setDirty(true);
    editor.nodeChanged();
};

/**
 * Open the editor on a score, or on nothing.
 *
 * @param {TinyMCE} editor The editor instance.
 * @param {object} strings The resolved language strings.
 * @param {object|null} existing The score being edited, or null to insert a new one.
 * @returns {Promise<void>}
 */
const displayDialogue = async(editor, strings, existing) => {
    const {html} = await Templates.renderForPromise('tiny_sheetmusic/editorbody', {
        filteractive: isFilterActive(editor),
    });

    const modal = await SheetmusicModal.create({
        title: existing ? strings.modaltitleedit : strings.modaltitleinsert,
        body: html,
        show: true,
    });
    await modal.setSaveButtonText(existing ? strings.savebuttonedit : strings.savebuttoninsert);

    const root = modal.getRoot();
    const body = modal.getBody()[0];
    const container = body.querySelector('[data-region="editor"]');
    revealMidiLimits(container, body.querySelector('[data-region="midihelp"]'));

    let alive = true;
    root.on(ModalEvents.destroyed, () => {
        alive = false;
    });

    const session = openEditor({
        container,
        source: existing ? existing.source : '',
        format: EDITABLE_FORMAT,
    });

    root.on(ModalEvents.save, (event) => {
        if (!container.dispatchEvent(new CustomEvent(EVENT_SAVE, {cancelable: true}))) {
            event.preventDefault();
        }
    });
    root.on(ModalEvents.hidden, () => {
        container.dispatchEvent(new CustomEvent(EVENT_CANCEL));
    });

    const saved = await session;

    if (alive) {
        modal.destroy();
    }
    if (!saved) {
        return;
    }

    editor.focus();
    insertScore(editor, saved, existing ? existing.element : null);
};

/**
 * Open the score editor for whatever the author is pointing at.
 *
 * @param {TinyMCE} editor The editor instance.
 * @param {object} strings The resolved language strings.
 * @param {Element|null} element A score element the caller already has, if any.
 * @returns {Promise<void>}
 */
export const handleAction = async(editor, strings, element = null) => {
    if (dialogueOpen) {
        return;
    }
    const existing = getSelectedScore(editor, element);

    if (existing && existing.format !== EDITABLE_FORMAT) {
        // A stored MusicXML score is readable by the filter from v1 but is not writable by
        // anything in the suite yet (RELATIONS.md section A3), so offering to edit it would be
        // offering to silently rewrite it as ABC.
        await displayAlert(
            strings.noteditabletitle,
            await getString('noteditable', component, existing.format)
        );
        return;
    }

    dialogueOpen = true;
    try {
        await displayDialogue(editor, strings, existing);
    } finally {
        dialogueOpen = false;
    }
};

/**
 * Open the score editor, reporting anything that goes wrong rather than swallowing it.
 *
 * @param {TinyMCE} editor The editor instance.
 * @param {object} strings The resolved language strings.
 * @param {Element|null} element A score element the caller already has, if any.
 * @returns {void}
 */
export const startAction = (editor, strings, element = null) => {
    handleAction(editor, strings, element).catch(displayException);
};
