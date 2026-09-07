# Changelog

All notable changes to `tiny_sheetmusic` are documented here.
This project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.0] - 2026-08-22

### Added

- Initial release. A TinyMCE subplugin adding a sheet music button and **Insert** menu item to
  Moodle's editor, with the `tiny/sheetmusic:use` capability and a per-context `plugininfo`.
- The editing dialogue: a save/cancel modal hosting `local_sheetmusic/editor`, with the engine's
  import, export and MIDI adjust controls inside it. A score that does not engrave cannot be
  inserted — the save is vetoed and the reason is shown in the dialogue.
- The insert path writes the stored-content contract: entity-encoded plain text inside a `<pre>`,
  the `sheetmusic` class token first, then the format token, and minimal escaping only.
- The edit path: clicking a score in the field reopens it with its source parsed back, located by
  the `sheetmusic` marker class alone. A score stored in a format the editor cannot write is
  recognised and left alone, with a reason, rather than silently rewritten.
- The author is warned when `filter_sheetmusic` is not active in the current context, so a score
  is not silently stored as text that will never be engraved. The probe degrades to "assume
  active" and never blocks authoring.

Scores authored here can be played from `local_sheetmusic` 0.2.0 onwards, in the editor's preview
and wherever the filter renders them; this plugin needed no change for that.
