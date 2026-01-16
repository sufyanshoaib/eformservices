# Proposal: Add Legal Foundation Pages

Add professional Terms of Service and Privacy Policy pages to the platform to ensure legal compliance and build user trust as we move toward a production launch.

## Problem
The application currently lacks legal documentation. Users uploading sensitive documents (PDFs) and providing personal information (Signatures) need clear disclosure on how their data is handled, stored, and protected. This is also a prerequisite for many payment providers and ad platforms.

## Proposed Solution
- Create static legal pages at `/terms` and `/privacy`.
- **Implement Strict Liability Exclusion**: Draft Terms of Service that explicitly waive all liability for eformly regarding data loss, user content, or service failures.
- Implement a reusable `LegalLayout` to ensure consistent formatting across all legal documents.
- Update the global footer to link to these live pages instead of placeholders.
- Add a contact email specifically for legal inquiries.

## Content Management
Initially, legal content will be stored as static TSX components for simplicity and performance.
- **Emphasis on Liability**: The ToS content will specifically prioritize a rigorous "Limitation of Liability" and "Disclaimer of Warranties" section to meet the core business requirement of zero liability.

## Capabilities
- **Static Content Hosting**: Ability to render rich markdown-based legal text in the application.
- **Global Compliance Access**: Ensuring legal links are present and accessible from every page via the footer.
