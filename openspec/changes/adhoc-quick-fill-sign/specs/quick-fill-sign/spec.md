## ADDED Requirements
### Requirement: Adhoc PDF Filling
The system SHALL allow users to fill and sign a PDF document without creating a pre-defined form.

#### Scenario: Upload PDF for quick fill
- **WHEN** a user visits `/quick-fill` and uploads a PDF
- **THEN** the system displays the PDF in an interactive viewer
- **AND** allows the user to immediately place text and signatures

#### Scenario: Place text on PDF
- **WHEN** a user clicks on a specific location in the PDF viewer
- **AND** types text
- **THEN** the text is displayed at that location in the preview

#### Scenario: Place signature on PDF
- **WHEN** a user chooses the signature tool and clicks on a location
- **AND** signs using the signature pad
- **THEN** the signature image is displayed at that location

#### Scenario: Download filled PDF
- **WHEN** a user clicks "Download" after placing elements
- **THEN** the system generates a new PDF file containing only the original PDF and the added elements
- **AND** prompts the user to save the file
