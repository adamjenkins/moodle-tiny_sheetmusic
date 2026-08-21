# Changelog

All notable changes to `tiny_sheetmusic` are documented here.

## [Unreleased]

- Initial plugin skeleton: the `tiny/sheetmusic:use` capability, a per-context `plugininfo`
  supplying `is_enabled()` and `get_plugin_configuration_for_context()`, the
  `filter_sheetmusic` activity probe, a null privacy provider, and a toolbar button and
  **Insert** menu item.
- The real editing dialogue, replacing the placeholder: a large save/cancel modal hosting
  `local_sheetmusic/editor`, with the engine's import, export and MIDI adjust controls inside
  it. A score that does not engrave cannot be inserted — the save is vetoed and the reason is
  shown in the dialogue.
- The insert path writes the stored-content contract (RELATIONS.md section A): entity-encoded
  plain text inside a `<pre>`, `sheetmusic` class token first, then the format token, minimal
  `&`/`<`/`>` escaping only, and never a newline immediately after the opening tag.
- The edit path: clicking a score in the field reopens it in the dialogue with its source
  parsed back, located by the `sheetmusic` marker class alone. The toolbar button is a toggle
  and reports whether the caret is inside a score. A score stored in a format the editor
  cannot write is recognised and left alone, with a reason, rather than silently rewritten.
- The MIDI import limits are stated in the dialogue and open by themselves as soon as a MIDI
  file is chosen, as RELATIONS.md section B3 rule 2 requires.
- The author is warned when `filter_sheetmusic` is not active in the current context, so a
  score authored there is not silently stored as text that will never be engraved. The probe
  degrades to "assume active" and never blocks authoring.
- Nothing released yet.
