# Design: Event Tracking

Utilize a Client-Side Provider pattern to initialize PostHog, ensuring compatibility with Next.js Server Components.

## Provider Pattern
We will create a specific client component `PostHogProvider` that handles the initialization singleton. This component will be mounted in the Root Layout.

```tsx
'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }) {
  // Init logic with privacy options
}
```

## Privacy & Security
- **Data Masking**: `maskAllInputs: true` will be strictly enforced to prevent form values (like PDF content fields) from being recorded.
- **Environment Separation**: Distinct project API keys for Development and Production to prevent data pollution.

## Performance
- **Lazy Loading**: PostHog scripts are loaded asynchronously and should not block the First Contentful Paint.
