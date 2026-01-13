## ADDED Requirements

### Requirement: Form Field Creation
Authenticated users SHALL be able to create form fields with various input types.

#### Scenario: Add text field
- **WHEN** a user selects "Text Input" from the field selector
- **THEN** the system creates a new text field definition
- **AND** allows the user to configure label, placeholder, and validation rules
- **AND** adds the field to the form schema

#### Scenario: Add number field
- **WHEN** a user selects "Number Input" from the field selector
- **THEN** the system creates a new number field definition
- **AND** allows the user to configure min/max values and decimal places
- **AND** adds the field to the form schema

#### Scenario: Add dropdown field
- **WHEN** a user selects "Dropdown" from the field selector
- **THEN** the system creates a new dropdown field definition
- **AND** allows the user to configure options (label-value pairs)
- **AND** adds the field to the form schema

#### Scenario: Add textarea field
- **WHEN** a user selects "Textarea" from the field selector
- **THEN** the system creates a new textarea field definition
- **AND** allows the user to configure rows and character limits
- **AND** adds the field to the form schema

#### Scenario: Add checkbox field
- **WHEN** a user selects "Checkbox" from the field selector
- **THEN** the system creates a new checkbox field definition
- **AND** allows the user to configure the checkbox label
- **AND** adds the field to the form schema

#### Scenario: Add signature field
- **WHEN** a user selects "Signature" from the field selector
- **THEN** the system creates a new signature field definition
- **AND** configures it for canvas-based signature capture
- **AND** adds the field to the form schema

### Requirement: PDF Field Mapping
Users SHALL be able to map form fields to specific coordinates on the PDF.

#### Scenario: Map field to PDF location
- **WHEN** a user drags a form field onto the PDF viewer
- **THEN** the system captures the X, Y coordinates and dimensions
- **AND** stores the mapping in the form schema
- **AND** displays a visual indicator at the mapped location

#### Scenario: Click-to-place field mapping
- **WHEN** a user selects a field and clicks on the PDF
- **THEN** the system places the field at the clicked coordinates
- **AND** stores the mapping with default dimensions
- **AND** displays the field boundary box

#### Scenario: Reposition mapped field
- **WHEN** a user drags an already-mapped field to a new location
- **THEN** the system updates the field coordinates in the form schema
- **AND** moves the visual indicator to the new position

#### Scenario: Resize mapped field
- **WHEN** a user resizes a mapped field boundary box
- **THEN** the system updates the field dimensions in the form schema
- **AND** adjusts the visual indicator accordingly

### Requirement: Form Field Configuration
Users SHALL be able to configure properties for each form field.

#### Scenario: Set field as required
- **WHEN** a user marks a field as "required"
- **THEN** the system adds validation to the field schema
- **AND** displays a required indicator on the form

#### Scenario: Configure field validation
- **WHEN** a user adds validation rules (e.g., email format, min length)
- **THEN** the system stores the validation rules in the field schema
- **AND** applies validation when the form is filled

#### Scenario: Set field default value
- **WHEN** a user sets a default value for a field
- **THEN** the system stores the default value in the field schema
- **AND** pre-fills the field when the form is displayed

### Requirement: Form Schema Persistence
The system SHALL save form schemas with field mappings to the database.

#### Scenario: Auto-save form changes
- **WHEN** a user makes changes to the form (add/edit/delete fields)
- **THEN** the system automatically saves the form schema after 2 seconds of inactivity
- **AND** displays a "Saved" indicator

#### Scenario: Manual save form
- **WHEN** a user clicks the "Save" button
- **THEN** the system immediately persists the form schema to the database
- **AND** displays a success notification

#### Scenario: Save form with validation errors
- **WHEN** a user attempts to save a form with unmapped fields
- **THEN** the system displays a warning about unmapped fields
- **AND** allows saving as draft but prevents publishing

### Requirement: Form Builder Interface
The system SHALL provide a split-pane interface for form building.

#### Scenario: Display form builder layout
- **WHEN** a user opens the form builder
- **THEN** the system displays a left pane with field selector and field list
- **AND** displays a right pane with the PDF viewer and mapping canvas
- **AND** provides a toolbar with save, preview, and publish actions

#### Scenario: Adjust pane sizes
- **WHEN** a user drags the divider between panes
- **THEN** the system resizes the panes accordingly
- **AND** maintains the aspect ratio of the PDF viewer

### Requirement: Field List Management
Users SHALL be able to manage the list of form fields.

#### Scenario: View field list
- **WHEN** a user opens the form builder
- **THEN** the system displays all created fields in a list
- **AND** shows field type, label, and mapping status for each field

#### Scenario: Reorder fields
- **WHEN** a user drags a field to a new position in the list
- **THEN** the system updates the field order in the form schema
- **AND** reflects the new order when the form is displayed to fillers

#### Scenario: Delete field
- **WHEN** a user deletes a field from the list
- **THEN** the system removes the field from the form schema
- **AND** removes the visual indicator from the PDF viewer
- **AND** prompts for confirmation if the field is mapped

#### Scenario: Edit field properties
- **WHEN** a user clicks on a field in the list
- **THEN** the system displays the field configuration panel
- **AND** allows editing of all field properties
- **AND** highlights the field's location on the PDF

### Requirement: PDF Viewer Interaction
The system SHALL provide an interactive PDF viewer for field mapping.

#### Scenario: Zoom PDF
- **WHEN** a user zooms in or out on the PDF
- **THEN** the system scales the PDF and all mapped field indicators
- **AND** maintains accurate coordinate mapping

#### Scenario: Pan PDF
- **WHEN** a user pans across a large PDF
- **THEN** the system scrolls the PDF view
- **AND** keeps mapped field indicators in correct positions

#### Scenario: Multi-page PDF navigation
- **WHEN** a user navigates between pages of a multi-page PDF
- **THEN** the system displays the selected page
- **AND** shows only field mappings for the current page
- **AND** allows mapping fields to any page

### Requirement: Form Publishing
Users SHALL be able to publish forms to make them shareable.

#### Scenario: Publish form
- **WHEN** a user clicks "Publish" on a completed form
- **THEN** the system validates that all fields are mapped
- **AND** generates a unique shareable link
- **AND** sets the form status to "published"

#### Scenario: Publish form with unmapped fields
- **WHEN** a user attempts to publish a form with unmapped fields
- **THEN** the system displays an error message listing unmapped fields
- **AND** prevents publishing until all fields are mapped

#### Scenario: Unpublish form
- **WHEN** a user unpublishes a form
- **THEN** the system sets the form status to "draft"
- **AND** disables the shareable link (returns 404 when accessed)

### Requirement: Form Preview
Users SHALL be able to preview how the form will appear to fillers.

#### Scenario: Preview form
- **WHEN** a user clicks "Preview" in the form builder
- **THEN** the system displays the form in filler view (without PDF)
- **AND** shows all fields in the configured order
- **AND** allows test filling to verify field behavior
