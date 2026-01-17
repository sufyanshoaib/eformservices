# Design: Legal Foundation

Implementing `/terms` and `/privacy` using standard Next.js page routing and a shared content layout.

## User Interface
- **Legal Layout**: A clean, centered, single-column layout optimized for long-form reading. 
- **Typography**: Enhanced line heights and clear heading hierarchies to make legal text digestible.
- **Global Footer**: Integration of footer navigation to point to live routes.

## Content Management
Initially, legal content will be stored as static TSX components for simplicity and performance. 
- **Liability Exclusion**: The Terms of Service will prioritize a "Limitation of Liability" clause that explicitly disclaims any operational or data-related responsibility to the maximum extent permitted by law.

## Proposed Components
1. `src/components/legal/legal-content.tsx`: A wrapper component providing consistent styling (Prose-like) for legal text.
2. `src/app/terms/page.tsx`: Route for Terms of Service.
3. `src/app/privacy/page.tsx`: Route for Privacy Policy.
4. `src/components/landing/footer.tsx`: (Modification) Update navigation array.

## Trade-offs
- **Static vs CMS**: Static components are faster to build and perform better, but require a code change to update content. Given this is an early-stage SaaS, static is sufficient.
