# tiny_sheetmusic

The sheet-music authoring plugin for Moodle's TinyMCE editor. It adds a toolbar button and an
**Insert** menu item that open the score editor, and writes the resulting score into the HTML
field in the suite's stored-content form.

This is one of three plugins in the **sheetmusic** suite:

| Plugin | Role |
|---|---|
| `local_sheetmusic` | The shared engine: document model, serialisers, engraver |
| `filter_sheetmusic` | Displays scores wherever Moodle renders text |
| `tiny_sheetmusic` | Authors scores in Moodle's editor (this plugin) |

## Why a TinyMCE subplugin

A `tiny_*` subplugin is handed the live context in both of its PHP entry points, so score
authoring can be switched on for music courses and activities without being forced on the whole
site. An `editor_*` plugin has no supported way to do that.

Availability is controlled by the capability **`tiny/sheetmusic:use`**, allowed for all
authenticated users by default — students answer notation exercises with the same editor their
teachers set them in. Remove it from a role, or override it in a context, to take the button
away there.

## Requirements

- Moodle 4.5 or later.
- `local_sheetmusic` 2026082100 or later. This is a hard dependency: the engine is where the
  notation code lives.
- The TinyMCE editor. `editor_tiny` supports `FORMAT_HTML` only, so score authoring is available
  only in HTML-format fields.

`filter_sheetmusic` is not a hard dependency, but without it a score will be stored and never
displayed as notation. The plugin checks whether the filter is active in the current context and
says so when it is not.

## Status

Alpha. The toolbar button and its per-context gating are in place; the score editing surface
itself is still being built.

## Licence

GPL v3 or later.
