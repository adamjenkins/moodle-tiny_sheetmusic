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
 * Sheet music plugin for TinyMCE.
 *
 * @package    tiny_sheetmusic
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_sheetmusic;

use context;
use editor_tiny\editor;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_configuration;
use editor_tiny\plugin_with_menuitems;
use local_sheetmusic\local\formats;

/**
 * Sheet music plugin for TinyMCE.
 *
 * Being a tiny subplugin rather than an editor plugin is what makes per-context availability
 * possible at all: both is_enabled() and get_plugin_configuration_for_context() are handed the
 * live context the editor is being rendered in. See DESIGN.md section 6.1.
 *
 * @package    tiny_sheetmusic
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugininfo extends plugin implements
    plugin_with_buttons,
    plugin_with_configuration,
    plugin_with_menuitems {
    /** @var string The name of the button and menu item this plugin registers with TinyMCE. */
    private const BUTTON = 'tiny_sheetmusic/sheetmusic';

    /**
     * The buttons this plugin makes available to the toolbar.
     *
     * @return string[]
     */
    public static function get_available_buttons(): array {
        return [
            self::BUTTON,
        ];
    }

    /**
     * The menu items this plugin makes available to the menu bar and context menu.
     *
     * @return string[]
     */
    public static function get_available_menuitems(): array {
        return [
            self::BUTTON,
        ];
    }

    /**
     * Whether score authoring is available in this context.
     *
     * @param context $context The context the editor is being used in.
     * @param array $options The options passed in when requesting the editor.
     * @param array $fpoptions The file picker options passed in when requesting the editor.
     * @param editor|null $editor The editor instance the plugin is initialised in.
     * @return bool
     */
    public static function is_enabled(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): bool {
        // The capability is context-aware, which is the whole point: a site can hand score
        // authoring to its music courses and to nowhere else.
        return has_capability('tiny/sheetmusic:use', $context);
    }

    /**
     * The configuration handed to the JavaScript plugin for this context.
     *
     * @param context $context The context the editor is being used in.
     * @param array $options The options passed in when requesting the editor.
     * @param array $fpoptions The file picker options passed in when requesting the editor.
     * @param editor|null $editor The editor instance the plugin is initialised in.
     * @return array
     */
    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): array {
        return [
            'contextid' => $context->id,
            'filteractive' => self::is_filter_active($context),
            'storableformats' => formats::STORABLE,
        ];
    }

    /**
     * Whether filter_sheetmusic will render a score authored in this context.
     *
     * This is the tiny_equation probe: format a known score block with the context's active
     * filter set and see whether anything changed. It is one-way and read-only, and a failure
     * to answer is reported as "active" so that a broken probe never blocks authoring.
     * See RELATIONS.md section C4.
     *
     * @param context $context The context the editor is being used in.
     * @return bool
     */
    private static function is_filter_active(context $context): bool {
        $probe = '<pre class="sheetmusic sheetmusic-abc">X:1' . "\n" . 'K:C' . "\n" . 'C4|</pre>';

        try {
            $rendered = format_text($probe, FORMAT_HTML, [
                'context' => $context,
                'noclean' => true,
                'para' => false,
            ]);
        } catch (\Throwable $e) {
            return true;
        }

        return $rendered !== $probe;
    }
}
