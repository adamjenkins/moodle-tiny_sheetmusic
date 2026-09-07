# Changelog

All notable changes to `tiny_sheetmusic` are documented here.
The full history is in [`changelog.md`](changelog.md).

## [0.1.0] - 2026-08-22

Initial release. A TinyMCE subplugin adding a sheet music button to Moodle's editor: it opens the
`local_sheetmusic` editing surface in a modal and writes the score back into the content as the
stored `<pre class="sheetmusic sheetmusic-abc">` form.

Scores authored here can be played from `local_sheetmusic` 0.2.0 onwards, in the editor's preview
and wherever the filter renders them; this plugin needs no change for that and is unaffected by
it.
