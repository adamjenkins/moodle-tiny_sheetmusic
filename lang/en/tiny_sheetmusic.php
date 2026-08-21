<?php
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
 * Language strings for tiny_sheetmusic.
 *
 * The midihelp* strings are the copy approved in P0-FINDINGS-T3 section B5. They are the
 * plugin's side of RELATIONS.md section B3 rule 2, which forbids presenting a quantised MIDI
 * import as a faithful transcription, so they describe measured behaviour of the quantiser and
 * should not be softened without re-measuring it.
 *
 * @package    tiny_sheetmusic
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['buttontitle'] = 'Sheet music';
$string['filterinactive'] = 'The sheet music filter is not active here, so scores inserted in this context will be shown as plain notation text instead of engraved music.';
$string['menuitem'] = 'Sheet music';
$string['midihelpfix'] = 'What you will need to fix by hand';
$string['midihelpfix1'] = 'Triplets and other tuplets are not detected. A triplet is turned into the nearest ordinary notes, which means the beat containing it will have the wrong rhythm - not just a missing bracket. If your music has triplets, expect to re-enter those beats.';
$string['midihelpfix2'] = 'Sharps versus flats is a guess. MIDI cannot tell F sharp from G flat. We spell the music using the key signature in the file, or our best guess from the notes if there is none. Set the key below if the spelling looks wrong; you can also fix individual notes afterwards in the editor.';
$string['midihelpfix3'] = 'Only one line of music is produced. Notes that sound together become a chord. If your file has a melody and an independent accompaniment, the two will be merged into one line and the inner part will lose its own rhythm. Import each part separately if you need them kept apart.';
$string['midihelpfix4'] = 'Slurs, staccato, accents, dynamics and pedal are not imported. They are either absent from the file or too unreliable to guess.';
$string['midihelpfix5'] = 'Notes shorter than the grid you choose are lost. Two notes that fall on the same grid point are merged into a chord. If your music has thirty-second notes, choose a finer grid.';
$string['midihelpgrid'] = 'The grid setting';
$string['midihelpgridbody'] = 'The grid is the shortest note we will round to. 1/16 is right for most exercises. Choose a coarser grid (1/8) if the playing was free or rubato - it is more forgiving of uneven timing. Choose a finer grid (1/32) only if the music genuinely contains notes that fast; a finer grid preserves more of the unevenness in live playing, not less.';
$string['midihelpintro'] = 'A MIDI file records which keys were pressed and when. It does not contain sheet music - there are no barlines in it, no note values, no sharps or flats, and no marking of which notes belong to which voice. Importing one means guessing the notation from the timing, and this dialogue is where you check and correct that guess before it becomes a score. Nothing is added to your page until you accept it.';
$string['midihelpnometre'] = 'If the file has no time signature';
$string['midihelpnometrebody'] = 'Files recorded from a keyboard usually carry no time signature. When that happens we assume 4/4, and we say so on the time signature control. The note values will still be right, but the barlines will be in the wrong places - a piece in 3/4 will come out with bars of four beats running across the phrasing. Set the correct time signature before you accept the import; it is much quicker than re-barring afterwards.';
$string['midihelpreliable'] = 'What comes through reliably';
$string['midihelpreliable1'] = 'The notes themselves - every pitch, in the right order, at the right octave.';
$string['midihelpreliable2'] = 'The rhythm, when the playing is close to a steady beat. A file exported from notation software (MuseScore, Sibelius, Finale, Dorico: File, then Export, then MIDI) comes through exactly. A file played live on a keyboard also comes through exactly, as long as each note is within roughly a sixteenth of the beat - about a tenth of a second at a moderate tempo. Beyond that, notes start landing on the wrong beat.';
$string['midihelpreliable3'] = 'Time signature, key signature and tempo, if the file contains them. Files exported from notation software normally do. Files recorded from a keyboard often do not - see below.';
$string['midihelpsummary'] = 'About MIDI import: what it can and cannot do';
$string['modaltitleedit'] = 'Edit sheet music';
$string['modaltitleinsert'] = 'Insert sheet music';
$string['noteditable'] = 'This score is stored as {$a}. Only ABC scores can be edited here, so this one has been left exactly as it is.';
$string['noteditabletitle'] = 'This score cannot be edited here';
$string['pluginname'] = 'Sheet music';
$string['privacy:metadata'] = 'The Sheet music plugin for TinyMCE does not store any personal data.';
$string['savebuttonedit'] = 'Update score';
$string['savebuttoninsert'] = 'Insert score';
$string['sheetmusic:use'] = 'Insert and edit sheet music in the text editor';
