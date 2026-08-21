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
 * Capabilities for tiny_sheetmusic.
 *
 * The capability name is not a free choice: editor_tiny's default plugin::is_enabled()
 * builds the string "tiny/<pluginname>:use" and emits a developer-debug warning when it
 * does not resolve. See DESIGN.md section 6.3.
 *
 * @package    tiny_sheetmusic
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$capabilities = [
    // Authoring a score is an ordinary content-authoring act, so every authenticated user
    // gets it: students answer notation exercises with the same editor teachers set them in.
    'tiny/sheetmusic:use' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_MODULE,
        'archetypes' => [
            'user' => CAP_ALLOW,
        ],
    ],
];
