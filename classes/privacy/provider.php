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
 * Privacy Subsystem implementation for tiny_sheetmusic.
 *
 * @package    tiny_sheetmusic
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_sheetmusic\privacy;

use core_privacy\local\metadata\null_provider;

/**
 * Privacy Subsystem implementation for tiny_sheetmusic.
 *
 * The plugin is an authoring surface only. Scores live in the host field's text, which the
 * hosting component is responsible for, so this plugin itself stores nothing.
 *
 * @package    tiny_sheetmusic
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class provider implements null_provider {
    /**
     * The language string explaining why this plugin stores no personal data.
     *
     * @return string
     */
    public static function get_reason(): string {
        return 'privacy:metadata';
    }
}
