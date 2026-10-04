# Changelog

All notable changes to `tiny_sheetmusic` are documented here.
The full history is in [`changelog.md`](changelog.md).

## [0.1.2] - 2026-10-04

- The plugin's maturity is now Beta (it was Alpha).
- README: playback is available in the editor's preview and on saved scores (it comes from
  local_sheetmusic); only MIDI-keyboard input and Braille output are still to come.
- composer.json now requires `moodle/moodle` `^4.5 || ^5.0` rather than `>=4.5 <5.4`, so later
  Moodle 5.x releases are no longer excluded.
- Continuous integration now tests against the released Moodle 5.3 (`MOODLE_503_STABLE`) instead
  of Moodle's development branch.
