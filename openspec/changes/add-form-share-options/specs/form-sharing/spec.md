## ADDED Requirements

### Requirement: Form Sharing Options
The system SHALL provide functionality to share a published form link directly to popular social and communication platforms.

#### Scenario: Share to Email
- **WHEN** the user selects the "Email" option from the share menu
- **THEN** the system SHALL open the user's default email client with a pre-filled subject and body containing the form link

#### Scenario: Share to WhatsApp
- **WHEN** the user selects the "WhatsApp" option
- **THEN** the system SHALL open a WhatsApp chat window with the form link in the message field

#### Scenario: Web Share API Integration
- **WHEN** sharing on a device that supports the Web Share API
- **THEN** the system SHOULD prefer using the native sharing dialog if available

#### Scenario: Published State Guard
- **WHEN** a form is not published
- **THEN** the sharing options SHALL NOT be displayed for that form
