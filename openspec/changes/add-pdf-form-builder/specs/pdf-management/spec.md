## ADDED Requirements

### Requirement: PDF Upload
Authenticated users SHALL be able to upload PDF files to create form templates.

#### Scenario: Successful PDF upload
- **WHEN** an authenticated user selects a valid PDF file (≤10MB)
- **THEN** the system uploads the file to Vercel Blob storage
- **AND** creates a PDF record in the database with metadata
- **AND** returns the PDF ID and URL

#### Scenario: Upload file size exceeded
- **WHEN** an authenticated user attempts to upload a PDF file >10MB
- **THEN** the system rejects the upload
- **AND** displays an error message "File size exceeds 10MB limit"

#### Scenario: Upload invalid file type
- **WHEN** an authenticated user attempts to upload a non-PDF file
- **THEN** the system rejects the upload
- **AND** displays an error message "Only PDF files are supported"

#### Scenario: Unauthenticated upload attempt
- **WHEN** an unauthenticated user attempts to upload a PDF
- **THEN** the system returns a 401 Unauthorized response
- **AND** redirects to the login page

### Requirement: PDF Library Listing
Authenticated users SHALL be able to view a list of their uploaded PDF templates.

#### Scenario: View PDF library
- **WHEN** an authenticated user navigates to the PDF library page
- **THEN** the system displays all PDFs uploaded by that user
- **AND** shows PDF name, upload date, and file size for each PDF
- **AND** orders PDFs by upload date (newest first)

#### Scenario: Empty PDF library
- **WHEN** an authenticated user with no uploaded PDFs views the library
- **THEN** the system displays an empty state message
- **AND** provides a button to upload the first PDF

#### Scenario: PDF library pagination
- **WHEN** an authenticated user has more than 20 uploaded PDFs
- **THEN** the system displays PDFs in pages of 20 items
- **AND** provides pagination controls

### Requirement: PDF Selection
Authenticated users SHALL be able to select a PDF to create or edit a form.

#### Scenario: Select PDF for new form
- **WHEN** an authenticated user clicks on a PDF in the library
- **THEN** the system navigates to the form builder page
- **AND** loads the selected PDF in the viewer
- **AND** initializes an empty form schema

#### Scenario: Select PDF for existing form
- **WHEN** an authenticated user selects a PDF that has an existing form
- **THEN** the system displays options to "Edit Form" or "Create New Form"
- **AND** loads the appropriate form schema when selected

### Requirement: PDF Deletion
Authenticated users SHALL be able to delete their uploaded PDF templates.

#### Scenario: Delete PDF without forms
- **WHEN** an authenticated user deletes a PDF with no associated forms
- **THEN** the system removes the PDF file from Vercel Blob storage
- **AND** deletes the PDF record from the database
- **AND** removes the PDF from the library view

#### Scenario: Delete PDF with forms
- **WHEN** an authenticated user attempts to delete a PDF with associated forms
- **THEN** the system displays a warning message
- **AND** requires confirmation that all associated forms will also be deleted
- **AND** cascades deletion to all forms and submissions when confirmed

### Requirement: PDF Metadata Display
The system SHALL display comprehensive metadata for each uploaded PDF.

#### Scenario: View PDF metadata
- **WHEN** a user views a PDF in the library
- **THEN** the system displays the PDF name, file size, upload date, and number of associated forms
- **AND** provides a thumbnail preview (optional for MVP)

### Requirement: User-Scoped Access
Users SHALL only be able to access their own uploaded PDFs.

#### Scenario: Access own PDFs
- **WHEN** an authenticated user requests their PDF library
- **THEN** the system returns only PDFs uploaded by that user

#### Scenario: Attempt to access another user's PDF
- **WHEN** an authenticated user attempts to access a PDF ID belonging to another user
- **THEN** the system returns a 403 Forbidden response
- **AND** does not expose the PDF URL or metadata
