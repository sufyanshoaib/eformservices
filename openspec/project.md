# Project Context

## Purpose

**eFormServices** is a SaaS platform that enables users to create fillable web forms from PDF templates. Users can:

1. **Upload PDF documents** with blank fields
2. **Map PDF fields to form inputs** using a visual editor (drag-and-drop interface with PDF preview on right, form field selector on left)
3. **Create custom forms** with various input types: text, number, dropdown, textarea, checkbox, and signature
4. **Share forms** via unique links for anonymous filling
5. **Generate filled PDFs** automatically when forms are submitted

**Target Users:**
- Form creators: Authenticated users who upload PDFs and design forms
- Form fillers: Anonymous users who receive shared links and fill out forms

**Value Proposition:** Simplify the process of collecting structured data through PDF forms without requiring recipients to have PDF editing software.

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Rendering**: `react-pdf` or `@react-pdf-viewer/core`
- **PDF Manipulation**: `pdf-lib` (for filling PDFs)
- **Form Management**: React Hook Form + Zod validation
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Signature Capture**: `react-signature-canvas` (ephemeral - rendered directly to PDF without storage)

### Backend
- **Runtime**: Node.js (Next.js API Routes or standalone Express if needed)
- **API Style**: REST
- **Authentication**: NextAuth.js v5
  - Email/password (credential provider)
  - OAuth providers: Google, Facebook
- **File Upload**: Multipart form handling with `formidable` or Next.js built-in
- **PDF Processing**: `pdf-lib` for server-side PDF generation

### Database
- **Primary DB**: PostgreSQL via **Supabase**
- **ORM**: Prisma
- **Schema**:
  - Users (id, email, password_hash, oauth_provider, created_at)
  - Forms (id, user_id, name, pdf_url, field_mappings_json, created_at)
  - Submissions (id, form_id, data_json, filled_pdf_url, submitted_at)
  - **Note**: Signature data is NOT stored in database for security

### Storage
- **PDF Storage**: **Vercel Blob Storage**
  - Original PDF templates uploaded by form creators
  - Generated filled PDFs after form submission
- **File Size Limit**: 10MB per PDF (adjustable)
- **Signature Handling**: Signatures are captured client-side and rendered directly into the PDF during generation. No signature data is stored separately for security and privacy.

### Deployment
- **Platform**: Vercel (frontend + serverless API)
- **Environments**: Development, Staging (preview deployments), Production

## Project Conventions

### Code Style
- **Linting**: ESLint with Next.js recommended config
- **Formatting**: Prettier with 2-space indentation
- **Type Safety**: Strict TypeScript mode enabled
- **Naming Conventions**:
  - **Files**: kebab-case for components (`pdf-viewer.tsx`), camelCase for utilities (`pdfUtils.ts`)
  - **Components**: PascalCase (`PdfViewer`, `FormBuilder`)
  - **Functions/Variables**: camelCase (`getUserForms`, `formData`)
  - **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `API_BASE_URL`)
  - **Database Tables**: snake_case (`user_forms`, `form_submissions`)

### Architecture Patterns

**Monorepo Structure** (Next.js App Router):
```
/app
  /(auth)         # Authentication pages
  /(dashboard)    # Protected routes for form creators
  /f/[formId]     # Public form filling pages
  /api            # API routes
/components
  /ui             # shadcn/ui components
  /forms          # Form-related components
  /pdf            # PDF viewer/editor components
/lib
  /db             # Database client and queries
  /pdf            # PDF processing utilities
  /auth           # Auth configuration
/prisma           # Database schema
```

**Key Patterns**:
- **Server Components** by default, Client Components only when needed (interactivity, hooks)
- **API Routes** for backend logic (form CRUD, PDF generation)
- **Server Actions** for form submissions where appropriate
- **Separation of Concerns**: UI components separate from business logic
- **Repository Pattern**: Database queries abstracted into service functions

### Testing Strategy

- **Framework**: Jest + React Testing Library
- **Coverage**: Aim for >70% on critical paths
- **Test Types**:
  - **Unit Tests**: Utility functions (PDF processing, validation)
  - **Integration Tests**: API routes, database operations
  - **Component Tests**: Form builder, PDF viewer interactions
  - **E2E Tests** (optional, future): Playwright for critical user flows

**Testing Commands**:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Git Workflow

- **Branching Strategy**: Feature branch workflow
  - `main` - production-ready code
  - `develop` - integration branch (optional)
  - `feature/[name]` - new features
  - `fix/[name]` - bug fixes
  - `refactor/[name]` - code improvements

- **Commit Convention**: Conventional Commits
  ```
  feat: add signature field support
  fix: resolve PDF rendering issue on Safari
  docs: update API documentation
  refactor: simplify form field mapping logic
  test: add tests for PDF generation
  chore: update dependencies
  ```

- **Pull Request Process**:
  1. Create feature branch from `main`
  2. Implement changes with tests
  3. Open PR with description
  4. Code review required
  5. Merge to `main` after approval

## Domain Context

### PDF Form Terminology
- **PDF Template**: Original uploaded PDF with blank fields
- **Form Schema**: JSON structure defining form fields and their mappings to PDF coordinates
- **Field Mapping**: Association between a web form input and a specific location in the PDF
- **Form Instance**: A unique shareable form created from a PDF template
- **Submission**: Completed form data submitted by a filler
- **Filled PDF**: Generated PDF with form data populated into the template

### Field Types
1. **Text Input**: Single-line text (name, email, etc.)
2. **Number Input**: Numeric values with validation
3. **Textarea**: Multi-line text
4. **Dropdown**: Select from predefined options
5. **Checkbox**: Boolean yes/no values
6. **Signature**: Canvas-based signature capture
   - User draws signature during form filling
   - Signature is converted to image data (base64/PNG)
   - Rendered directly into PDF at specified coordinates
   - **Not stored** in database or separate files for security
   - Exists only in-memory during PDF generation process

### User Roles
- **Form Creator** (authenticated): Can upload PDFs, create forms, view submissions
- **Form Filler** (anonymous): Can access shared forms via link, submit data

## Important Constraints

### Technical Constraints
- **PDF File Size**: Maximum 10MB per upload
- **Supported PDF Versions**: PDF 1.4 - 1.7 (standard compatibility)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- **Mobile Responsive**: Forms must be fillable on mobile devices
- **PDF Field Detection**: Manual mapping required (no automatic field detection in MVP)

### Performance Targets
- **Page Load**: < 3 seconds for form pages
- **PDF Generation**: < 5 seconds for typical forms
- **Upload Time**: < 10 seconds for 10MB PDF

### Security Constraints
- **Authentication**: Required for form creation, optional for filling
- **Data Privacy**: Form submissions stored securely, no public access without link
- **File Validation**: Strict PDF MIME type checking, malware scanning (future)
- **Rate Limiting**: API endpoints protected against abuse

### Business Constraints
- **Free Tier**: Initial launch as free service
- **Storage Limits**: Monitor storage costs, may implement per-user limits later
- **Scalability**: Design for 100-1000 users initially

## External Dependencies

### Third-Party Services
- **Authentication Providers**:
  - Google OAuth 2.0 (Google Cloud Console)
  - Facebook Login (Meta for Developers)
  
- **Database Hosting**:
  - **Supabase** (PostgreSQL + Auth + Storage)
  
- **File Storage**:
  - **Vercel Blob Storage** (PDF templates and filled PDFs)
  
- **Email Service** (future):
  - SendGrid / Resend for transactional emails (form sharing notifications)

### Libraries & SDKs
- **PDF Processing**: `pdf-lib` (MIT license)
- **PDF Rendering**: `react-pdf` (MIT license)
- **Authentication**: NextAuth.js (ISC license)
- **ORM**: Prisma (Apache 2.0)
- **Validation**: Zod (MIT license)

### API Integrations (Future)
- **Payment Gateway**: Stripe (for premium features)
- **Analytics**: Vercel Analytics or Google Analytics
- **Monitoring**: Sentry for error tracking

## Development Workflow

### Local Setup
```bash
npm install
npm run db:migrate    # Run Prisma migrations
npm run dev           # Start dev server
```

### Environment Variables
```
DATABASE_URL=          # PostgreSQL connection string
NEXTAUTH_SECRET=       # Auth secret
NEXTAUTH_URL=          # App URL
GOOGLE_CLIENT_ID=      # Google OAuth
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=    # Facebook OAuth
FACEBOOK_CLIENT_SECRET=
BLOB_READ_WRITE_TOKEN= # Vercel Blob (or AWS credentials)
```

### Deployment
- **Vercel**: Auto-deploy on push to `main`
- **Preview Deployments**: Auto-created for PRs
- **Database Migrations**: Run via Prisma migrate in CI/CD

## Future Considerations
- **Automatic field detection** using OCR/ML
- **Template marketplace** for common forms
- **Team collaboration** features
- **Advanced analytics** for form creators
- **Webhook integrations** for submissions
- **Premium tier** with increased limits
