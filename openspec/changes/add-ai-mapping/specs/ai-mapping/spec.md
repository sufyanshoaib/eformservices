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

### Requirement: Error Handling
The system SHALL handle failures gracefully during AI analysis.

#### Scenario: AI API failure
- **WHEN** the AI service is unavailable or returns an error
- **THEN** the system displays a user-friendly error message
- **AND** logs the error for debugging
- **AND** does not deduct from the user's AI mapping usage count

#### Scenario: Invalid PDF structure
- **WHEN** the PDF contains no extractable text or fields
- **THEN** the system notifies the user that AI mapping is not available for this PDF
- **AND** suggests manual field mapping

#### Scenario: Coordinate validation failure
- **WHEN** AI-generated coordinates fall outside PDF boundaries
- **THEN** the system filters invalid suggestions
- **AND** only displays valid field mappings

### Requirement: Secure API Integration
The system SHALL protect AI service credentials and validate AI responses.

#### Scenario: API key security
- **WHEN** the AI mapping endpoint is called
- **THEN** API keys are never exposed to the client
- **AND** are stored securely as environment variables

#### Scenario: Response validation
- **WHEN** AI returns field suggestions
- **THEN** coordinates are validated against PDF dimensions
- **AND** field types are validated against allowed types
- **AND** malformed responses are rejected

### Requirement: Performance
The system SHALL complete AI analysis within acceptable time limits.

#### Scenario: Analysis timeout
- **WHEN** AI analysis exceeds 30 seconds
- **THEN** the system cancels the request
- **AND** displays a timeout message to the user
- **AND** suggests trying again or using manual mapping
