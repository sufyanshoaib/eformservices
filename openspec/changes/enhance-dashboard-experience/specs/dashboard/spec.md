# Dashboard Enhancements Specification

## ADDED Requirements

### Requirement: Session-Aware Landing Page
The landing page SHALL detect if a user is authenticated and display appropriate calls-to-action.

#### Scenario: Authenticated user visits landing page
**Given** a user is logged in
**When** they visit the home page
**Then** the primary CTA button SHALL show "Go to Dashboard"
**And** clicking it SHALL navigate to `/dashboard/pdfs`

#### Scenario: Guest user visits landing page
**Given** a user is not logged in
**When** they visit the home page
**Then** the primary CTA button SHALL show "Get Started Free"
**And** clicking it SHALL navigate to `/auth/signup`

---

### Requirement: Dashboard Card Layout
The dashboard PDF library SHALL use a card-based layout to display PDF items.

#### Scenario: User views PDF library
**Given** a user has uploaded PDFs
**When** they visit `/dashboard/pdfs`
**Then** each PDF SHALL be displayed in a card component
**And** the card SHALL show the PDF name, file size, upload date, and analytics stats

---

### Requirement: Form Analytics Tracking
The system SHALL track the number of times a public form is viewed.

#### Scenario: User views public form
**Given** a public form exists
**When** a user (or guest) visits the form URL
**Then** the system SHALL increment the `views` counter for that form in the database

---

### Requirement: Analytics Visualization
The dashboard SHALL display analytics metrics for each form.

#### Scenario: User checks form stats
**Given** a form has tracked views and submissions
**When** the user views the form card on the dashboard
**Then** they SHALL see the total "Views" count
**And** they SHALL see the total "Submissions" count
**And** they SHALL see a "Conversion Rate" percentage calculated from submissions/views
