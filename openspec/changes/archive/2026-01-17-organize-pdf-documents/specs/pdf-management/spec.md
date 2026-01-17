## ADDED Requirements
### Requirement: Folder Management
Authenticated users SHALL be able to manage folders to organize their PDFs.

#### Scenario: Create new folder
- **WHEN** an authenticated user requests to create a folder with a valid name
- **THEN** the system creates a new folder associated with the user

#### Scenario: List folders
- **WHEN** an authenticated user views their PDF library
- **THEN** the system displays a list of their folders alongside un-filed PDFs

#### Scenario: Delete folder
- **WHEN** an authenticated user deletes a folder
- **THEN** the folder is removed
- **AND** any PDFs inside the folder are moved to the root level (or user is prompted - *Decision: Move to root to prevent accidental data loss*)

### Requirement: Organize PDFs
Authenticated users SHALL be able to move PDFs into and out of folders.

#### Scenario: Move PDF to folder
- **WHEN** an authenticated user moves a PDF to a specific folder
- **THEN** the PDF is associated with that folder

#### Scenario: Remove PDF from folder
- **WHEN** an authenticated user removes a PDF from a folder
- **THEN** the PDF is moved to the root library


### Requirement: PDF Library Listing
Authenticated users SHALL be able to view a list of their uploaded PDF templates, organized by folder.

#### Scenario: View PDF library
- **WHEN** an authenticated user navigates to the PDF library page
- **THEN** the system displays folders and root-level PDFs
- **AND** shows PDF name, upload date, and file size for each PDF
- **AND** orders items by creation/upload date

#### Scenario: View Folder Contents
- **WHEN** an authenticated user clicks on a folder
- **THEN** the system displays only the PDFs contained in that folder
- **AND** provides navigation back to the root library
