# Changelog

All notable changes to `tiny_sheetmusic` are documented here.
The full history is in [`changelog.md`](changelog.md).

## [Unreleased]

- README: playback is available in the editor's preview and on saved scores (it comes from
  local_sheetmusic); only MIDI-keyboard input and Braille output are still to come.

## [0.1.1] - 2026-10-04

- Declare Moodle 5.3 support.
- Add `composer.json`, so the plugin can be installed with Composer as
  `adamjenkins/moodle-tiny_sheetmusic`. It requires `adamjenkins/moodle-local_sheetmusic` 0.1 or
  later (below 1.0).
- The headings in the MIDI import help now start at level 3 below the dialogue title, as Moodle 5.3
  asks of modal content; they look the same as before.
