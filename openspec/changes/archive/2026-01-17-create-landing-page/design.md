# Design: Marketing Landing Page

## Architecture Overview

The landing page will be a single-page application with multiple sections that users can scroll through. It will be implemented as a Next.js page component with modular section components for maintainability.

```
src/app/page.tsx (Landing Page)
  ├─ Hero Section
  ├─ Features Section  
  ├─ How It Works Section
  ├─ Pricing Section
  ├─ Use Cases Section
  ├─ FAQ Section
  └─ Footer Section
```

## Component Structure

### Page Component (`src/app/page.tsx`)
- Server component that composes all sections
- Includes proper metadata for SEO
- Handles smooth scroll behavior

### Section Components (`src/components/landing/`)

#### `hero.tsx`
- Full-height hero with gradient background
- Headline: "Transform PDFs into Fillable Web Forms"
- Subheadline explaining the value proposition
- Primary CTA: "Get Started Free"
- Secondary CTA: "See How It Works" (smooth scroll to How It Works section)
- Hero illustration or screenshot

#### `features.tsx`
- Grid layout (2x3 on desktop, 1 column on mobile)
- Feature cards with:
  - Icon (from Lucide React)
  - Title
  - Description
- Features to highlight:
  1. Upload PDF Templates
  2. Visual Form Builder
  3. Share with Anyone
  4. Auto-Generate Filled PDFs
  5. Multiple Field Types
  6. Secure & Private

#### `how-it-works.tsx`
- 3-step process with visual indicators
- Steps:
  1. Upload Your PDF Template
  2. Map Fields & Create Form
  3. Share Link & Collect Responses
- Each step has icon, title, description
- Visual flow indicators (arrows or lines)

#### `pricing.tsx`
- Two-column comparison table
- Free vs Pro tiers
- Feature comparison with checkmarks/crosses
- Pricing details:
  - Free: $0/month
  - Pro: "Coming Soon" (price TBD)
- CTA buttons for each tier
- Highlight Pro tier as "Most Popular" or "Best Value"

#### `use-cases.tsx`
- 3 example use cases with icons
- Use cases:
  1. HR & Onboarding Forms
  2. Contract Signing
  3. Application Forms
- Each with title, description, and relevant icon

#### `faq.tsx`
- Accordion-style FAQ
- Questions:
  1. How does eFormServices work?
  2. What file formats are supported?
  3. Is my data secure?
  4. Can I customize the forms?
  5. What's the difference between Free and Pro?
  6. How do I upgrade to Pro?
  7. Can I cancel anytime?

#### `footer.tsx`
- Multi-column footer
- Columns:
  - Product (Dashboard, Upload PDF, Features, Pricing)
  - Support (FAQ, Contact, Documentation)
  - Legal (Privacy Policy, Terms of Service)
  - Social (Twitter, LinkedIn, GitHub - placeholders)
- Copyright notice
- Logo

## Styling Approach

### Color Scheme
- Primary: Blue (#3B82F6 - blue-600)
- Secondary: Slate (#64748B - slate-500)
- Background: White/Slate-50
- Accent: Blue-500 for hover states
- Success: Green for checkmarks
- Muted: Slate-400 for secondary text

### Typography
- Headings: Font-bold, tracking-tight
- Body: Font-normal, leading-relaxed
- CTAs: Font-semibold

### Spacing
- Sections: py-16 md:py-24 (vertical padding)
- Containers: max-w-7xl mx-auto px-6
- Consistent gap-8 between elements

### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md)
- Desktop: > 1024px (lg)

## User Flows

### New User Journey
1. Land on homepage
2. Read hero headline and value proposition
3. Scroll through features
4. Check pricing (see Free tier is available)
5. Click "Get Started Free"
6. Redirect to `/auth/signup`
7. After signup, redirect to `/dashboard/pdfs`

### Returning User Journey
1. Land on homepage
2. Click "Sign In" in header/footer
3. Redirect to `/auth/signin`
4. After login, redirect to `/dashboard/pdfs`

## SEO Strategy

### Metadata
```typescript
export const metadata = {
  title: 'eFormServices - Transform PDFs into Fillable Web Forms',
  description: 'Create shareable web forms from PDF templates in minutes. No coding required. Free tier available.',
  keywords: 'PDF forms, fillable forms, web forms, form builder, PDF to form',
  openGraph: {
    title: 'eFormServices - PDF to Web Form Converter',
    description: 'Transform your PDF templates into interactive web forms',
    images: ['/og-image.png'],
  },
}
```

### Structured Data
- Add JSON-LD for SoftwareApplication
- Include pricing information
- Add FAQ structured data

## Performance Considerations

- Use Next.js Image component for all images
- Lazy load below-the-fold sections
- Minimize JavaScript bundle (mostly static content)
- Optimize fonts (use next/font)
- Target Lighthouse score > 90

## Accessibility

- Semantic HTML (header, nav, main, section, footer)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible states
- Sufficient color contrast (WCAG AA)

## Future Enhancements (Not in This Change)

- A/B testing different headlines
- Video demo/tutorial
- Customer testimonials
- Live chat widget
- Blog integration
- Multi-language support
- Dark mode toggle
