@editor @editor_tiny @tiny @tiny_sheetmusic @javascript
Feature: Sheet music is authored in the text editor
  In order to put notation into course content
  As a teacher
  I need a button that opens a score editor and stores what I write in the form the filter reads

  # The stored form is RELATIONS.md section A and is asserted here as literal markup rather
  # than as "a score is present": what these scenarios protect is the bytes in the database.
  # Newlines are written as the numeric character reference &#10;, because a Gherkin table
  # cell cannot hold a literal line break, and bar lines are escaped as \| because an
  # unescaped pipe would end the cell.
  #
  # The engraved notation is asserted with an xpath_element rather than a "svg" css_element:
  # Mink converts CSS to XPath and XPath 1.0 name tests are namespace aware, so a bare `svg`
  # step never matches an <svg> element. local-name() is namespace blind and does match.
  Background:
    Given the following "courses" exist:
      | fullname | shortname | format |
      | Music 1  | MUS1      | topics |
    And the following "users" exist:
      | username | firstname | lastname | email                |
      | teacher1 | Terry     | Teacher  | teacher1@example.com |
    And the following "course enrolments" exist:
      | user     | course | role           |
      | teacher1 | MUS1   | editingteacher |
    And the "sheetmusic" filter is "on"

  Scenario: A teacher writes a score, stores it, and it is engraved on the page
    Given the following "activities" exist:
      | activity | course | name           | content        | contentformat |
      | page     | MUS1   | Authored score | <p>Notes:</p>  | 1             |
    And I am on the "Authored score" "page activity editing" page logged in as "teacher1"
    And I expand all toolbars for the "Page content" TinyMCE editor
    When I click on the "Sheet music" button for the "Page content" TinyMCE editor
    Then I should see "Insert sheet music"
    And I set the field "ABC source" to multiline:
      """
      X:1
      M:4/4
      L:1/8
      K:G
      |GABc dedB|
      """
    And I wait until "//div[contains(@class, 'sheetmusic-editor-preview')]/*[local-name() = 'svg']" "xpath_element" exists
    And I click on "Insert score" "button" in the "Insert sheet music" "dialogue"
    And I wait until "Insert sheet music" "dialogue" does not exist
    And I press "Save and display"
    Then I wait until "//div[contains(concat(' ', normalize-space(@class), ' '), ' sheetmusic-render ')]/*[local-name() = 'svg']" "xpath_element" exists

  Scenario: A stored score reopens in the editor with its source parsed back
    Given the following "activities" exist:
      | activity | course | name        | content                                                                                       | contentformat |
      | page     | MUS1   | Scale study | <pre class="sheetmusic sheetmusic-abc">X:1&#10;M:4/4&#10;L:1/8&#10;K:G&#10;\|GABc dedB\|</pre> | 1             |
    And I am on the "Scale study" "page activity editing" page logged in as "teacher1"
    And I expand all toolbars for the "Page content" TinyMCE editor
    When I select the "pre.sheetmusic" "css_element" in the "Page content" TinyMCE editor
    Then the "Sheet music" button of the "Page content" TinyMCE editor has state "true"
    When I click on the "Sheet music" button for the "Page content" TinyMCE editor
    Then I should see "Edit sheet music"
    And the field "ABC source" matches multiline:
      """
      X:1
      M:4/4
      L:1/8
      K:G
      |GABc dedB|
      """

  Scenario: The limits of MIDI import are stated in the dialogue
    Given the following "activities" exist:
      | activity | course | name           | content       | contentformat |
      | page     | MUS1   | Authored score | <p>Notes:</p> | 1             |
    And I am on the "Authored score" "page activity editing" page logged in as "teacher1"
    And I expand all toolbars for the "Page content" TinyMCE editor
    When I click on the "Sheet music" button for the "Page content" TinyMCE editor
    And I click on "About MIDI import: what it can and cannot do" "text" in the "Insert sheet music" "dialogue"
    Then I should see "It does not contain sheet music"
    And I should see "Triplets and other tuplets are not detected"
    And I should see "Notes shorter than the grid you choose are lost"

  Scenario: The author is warned where the filter will not render the score
    Given the "sheetmusic" filter is "off"
    And the following "activities" exist:
      | activity | course | name           | content       | contentformat |
      | page     | MUS1   | Authored score | <p>Notes:</p> | 1             |
    And I am on the "Authored score" "page activity editing" page logged in as "teacher1"
    And I expand all toolbars for the "Page content" TinyMCE editor
    When I click on the "Sheet music" button for the "Page content" TinyMCE editor
    Then I should see "The sheet music filter is not active here"
