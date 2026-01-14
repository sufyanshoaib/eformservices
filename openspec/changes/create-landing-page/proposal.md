# Proposal: Create Marketing Landing Page with Pricing Tiers

## Context

The current landing page (`src/app/page.tsx`) is minimal with just a title, tagline, and two buttons linking to the dashboard. It doesn't communicate the product's value proposition, showcase features, or explain the pricing model. As the project evolves toward a SaaS business model with free and pro tiers, we need a proper marketing landing page that:

1. Clearly explains what eFormServices does and its benefits
2. Showcases key features with visual examples
3. Presents pricing tiers (Free vs Pro) with clear limitations and benefits
4. Includes social proof elements (testimonials, use cases)
5. Has clear calls-to-action for sign-up and getting started

## Goal

Create a modern, conversion-optimized landing page that effectively communicates the product's value proposition and pricing structure to potential users. The page should follow current web design best practices with:

- Hero section with compelling headline and CTA
- Features section highlighting key capabilities
- Pricing comparison table (Free vs Pro tiers)
- Use cases / benefits section
- FAQ section addressing common questions
- Footer with links and information

## Scope

### In Scope
- **Hero Section**: Compelling headline, subheadline, primary CTA (Sign Up), secondary CTA (See Demo/Learn More)
- **Features Section**: 4-6 key features with icons and descriptions
- **Pricing Section**: 
  - Free tier: Limited to 3 PDFs, 10 forms, 100 submissions/month
  - Pro tier: Unlimited PDFs, forms, submissions, priority support, custom branding
  - Clear comparison table with feature checkmarks
- **How It Works**: 3-step process visualization
- **Use Cases**: 2-3 example scenarios (HR forms, contracts, applications)
- **FAQ Section**: 5-7 common questions
- **Footer**: Links to dashboard, docs, privacy policy, terms of service

### Out of Scope
- Payment integration (Stripe) - will be separate change
- User testimonials (no real users yet)
- Blog or content marketing pages
- Multi-language support
- A/B testing infrastructure
- Analytics integration beyond basic Vercel Analytics

## Pricing Tier Limitations

### Free Tier
- Maximum 3 PDF templates
- Maximum 10 forms total
- Maximum 100 form submissions per month
- eFormServices branding on forms
- Community support only
- Standard PDF processing

### Pro Tier (Future - Pricing TBD)
- Unlimited PDF templates
- Unlimited forms
- Unlimited submissions
- Remove branding / white-label option
- Priority email support
- Advanced analytics
- Custom domain support (future)
- API access (future)

## Dependencies

- Existing authentication system (already implemented)
- ShadCN UI components (already available)
- Lucide React icons (already installed)
- Current routing structure

## Design Considerations

1. **Responsive Design**: Mobile-first approach, looks great on all devices
2. **Performance**: Optimized images, minimal JavaScript, fast load times
3. **Accessibility**: Proper semantic HTML, ARIA labels, keyboard navigation
4. **SEO**: Proper meta tags, structured data, descriptive content
5. **Brand Consistency**: Use existing color scheme and typography from dashboard
6. **Conversion Focus**: Clear CTAs, benefit-driven copy, minimal friction

## Technical Approach

- Replace `src/app/page.tsx` with new landing page component
- Create reusable landing page components in `src/components/landing/`
- Use Tailwind CSS for styling (consistent with existing app)
- Implement smooth scroll for anchor links
- Add proper metadata for SEO
- Ensure all CTAs link to `/auth/signup` or `/auth/signin`

## Success Criteria

- Landing page loads in < 2 seconds
- Mobile responsive (tested on 320px to 1920px widths)
- All links and CTAs functional
- Pricing tiers clearly differentiated
- Passes accessibility audit (WCAG 2.1 AA)
- Proper SEO metadata in place
