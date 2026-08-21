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
 * Tests for the tiny_sheetmusic plugin information.
 *
 * @package    tiny_sheetmusic
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_sheetmusic;

/**
 * Tests for the tiny_sheetmusic plugin information.
 *
 * @package    tiny_sheetmusic
 * @copyright  2026 Adam Jenkins <adam@wisecat.net>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @covers     \tiny_sheetmusic\plugininfo
 */
final class plugininfo_test extends \advanced_testcase {
    /**
     * The capability editor_tiny looks up by convention has to exist, or core only warns.
     *
     * @return void
     */
    public function test_the_conventional_capability_exists(): void {
        $this->resetAfterTest();

        $this->assertNotEmpty(get_capability_info('tiny/sheetmusic:use'));
    }

    /**
     * Availability follows the capability, in this context and not another.
     *
     * @return void
     */
    public function test_is_enabled_follows_the_capability(): void {
        $this->resetAfterTest();

        $course = $this->getDataGenerator()->create_course();
        $other = $this->getDataGenerator()->create_course();
        $context = \context_course::instance($course->id);
        $othercontext = \context_course::instance($other->id);
        $user = $this->getDataGenerator()->create_user();
        $this->setUser($user);

        // The archetype default hands the capability to every authenticated user.
        $this->assertTrue(plugininfo::is_enabled($context, ['pluginname' => 'sheetmusic'], []));

        // Taking it away in one context leaves the other alone: this is the per-context
        // availability the subplugin exists to provide.
        $roleid = $this->getDataGenerator()->create_role();
        role_assign($roleid, $user->id, $context->id);
        assign_capability('tiny/sheetmusic:use', CAP_PROHIBIT, $roleid, $context->id, true);
        accesslib_clear_all_caches_for_unit_testing();

        $this->assertFalse(plugininfo::is_enabled($context, ['pluginname' => 'sheetmusic'], []));
        $this->assertTrue(plugininfo::is_enabled($othercontext, ['pluginname' => 'sheetmusic'], []));
    }

    /**
     * The context configuration reports the context, the filter state and the storable formats.
     *
     * @return void
     */
    public function test_configuration_reports_the_filter_state(): void {
        $this->resetAfterTest();

        $course = $this->getDataGenerator()->create_course();
        $context = \context_course::instance($course->id);

        filter_set_global_state('sheetmusic', TEXTFILTER_ON);
        \core_filters\filter_manager::reset_caches();

        $config = plugininfo::get_plugin_configuration_for_context($context, [], []);

        $this->assertSame($context->id, $config['contextid']);
        $this->assertTrue($config['filteractive']);
        $this->assertSame(\local_sheetmusic\local\formats::STORABLE, $config['storableformats']);

        // With the filter off in this context the author has to be warned, so the probe has
        // to actually discriminate rather than always answering yes.
        filter_set_local_state('sheetmusic', $context->id, TEXTFILTER_OFF);
        \core_filters\filter_manager::reset_caches();

        $config = plugininfo::get_plugin_configuration_for_context($context, [], []);
        $this->assertFalse($config['filteractive']);
    }

    /**
     * The button and menu item names are offered to the editor.
     *
     * @return void
     */
    public function test_the_button_and_menu_item_are_declared(): void {
        $this->assertSame(['tiny_sheetmusic/sheetmusic'], plugininfo::get_available_buttons());
        $this->assertSame(['tiny_sheetmusic/sheetmusic'], plugininfo::get_available_menuitems());
    }
}
