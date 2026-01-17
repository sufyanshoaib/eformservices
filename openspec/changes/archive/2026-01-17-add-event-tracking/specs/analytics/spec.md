# Capability: Product Analytics

Defines the requirements for tracking user behavior and product usage metrics.

## ADDED Requirements

### Requirement: Automated Behaviour Tracking
The system MUST collect analytical data on user interactions to inform product decisions.

#### Scenario: Page navigation
- **WHEN** a user navigates between routes
- **THEN** a pageview event is recorded with the new path

#### Scenario: Autocapture
- **WHEN** a user clicks a button or link
- **THEN** an event is recorded with the element metadata

### Requirement: Privacy-First Session Recording
Session replays MUST be enabled to debug UX issues but MUST NOT capture sensitive user input.

#### Scenario: Recording form input
- **WHEN** a user types into a form field
- **THEN** the session replay functionality captures the interaction state but masks the actual text content
