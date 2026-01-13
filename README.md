# eFormServices - PDF Form Builder

A Next.js application for creating fillable web forms from PDF templates.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Environment:**
    *   See [COMPREHENSIVE_SETUP.md](./COMPREHENSIVE_SETUP.md) for detailed instructions on getting API keys.
    *   Copy `.env.example` to `.env` (or use the one created for you).
    *   Update `.env` with your credentials.

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Features

*   **PDF Management**: Upload and organize PDF templates.
*   **Form Builder**: Drag-and-drop interface to map form fields to PDF coordinates.
*   **Authentication**: Secure access via Google and Facebook (NextAuth.js).
*   **Storage**: PDF file storage using Vercel Blob.
*   **Database**: PostgreSQL with Prisma ORM.
