# legal-pages Specification

## Purpose
TBD - created by archiving change add-legal-pages. Update Purpose after archive.
## Requirements
### Requirement: Dedicated Legal Routes
The system MUST provide dedicated, publicly accessible routes for the Terms of Service and Privacy Policy.

#### Scenario: Navigating from footer
- **WHEN** user clicks "Terms of Service" in the footer
- **THEN** user is navigated to `/terms` and the document is displayed

#### Scenario: Direct URL access
- **WHEN** user visits `/privacy` directly
- **THEN** the Privacy Policy document is displayed without authentication

### Requirement: Optimized Legal Content Layout
Legal documents MUST be presented in a layout that prioritizes readability for long-form text.

#### Scenario: Mobile readability
- **WHEN** viewing `/privacy` on a mobile device
- **THEN** text is contained within clear margins and headings are distinct

### Requirement: Global Legal Discoverability
Active links to all legal documents MUST be present in the platform's global footer.

#### Scenario: Finding links on dashboard
- **WHEN** a logged-in user scrolls to the bottom of any dashboard page
- **THEN** "Terms of Service" and "Privacy Policy" links are visible and functional

### Requirement: Comprehensive Liability Exclusion
The Terms of Service MUST include a robust, all-caps limitation of liability clause that excludes eformly from any legal responsibility for user-generated content, PDF data loss, or service interruptions.

#### Scenario: Verify liability language
- **WHEN** reviewing the `/terms` page
- **THEN** a clearly visible section titled "LIMITATION OF LIABILITY" (or similar) MUST be present, stating the platform is provided "as-is" without any warranties.

