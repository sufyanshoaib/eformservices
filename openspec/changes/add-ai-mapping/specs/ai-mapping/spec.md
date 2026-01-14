## ADDED Requirements

### Requirement: AI Field Mapping
The system SHALL allow authenticated users to trigger an automatic detection of form fields within an uploaded PDF.

#### Scenario: Successful AI detection
- **WHEN** the user clicks "AI Mapping" for a valid PDF
- **THEN** the system analyzes the PDF content
- **AND** returns a list of suggested field names, types, and coordinates
- **AND** displays them as draft fields on the PDF canvas

### Requirement: Manual Review of AI Suggestions
The system SHALL provide a way for users to approve, modify, or reject fields suggested by the AI.

#### Scenario: Accepting AI suggestions
- **WHEN** the user reviews suggested fields
- **THEN** they can click "Approve All" to convert all suggestions into permanent form fields
- **OR** click "Remove" on individual suggestions

### Requirement: Usage Limitations
The system SHALL restrict the use of AI Field Mapping to subscribed users, except for a trial period.

#### Scenario: Free trial usage
- **WHEN** a non-subscribed user uses AI mapping for the first time
- **THEN** the mapping is allowed to proceed

#### Scenario: Trial limit exceeded
- **WHEN** a non-subscribed user attempts to use AI mapping a second time
- **THEN** the system prevents the operation
- **AND** prompts the user to upgrade to a Pro subscription
