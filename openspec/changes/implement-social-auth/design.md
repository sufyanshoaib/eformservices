# Design: Social Authentication UI

## Architecture
We will use the existing NextAuth.js v5 setup. Since NextAuth v5 integrates closely with Server Actions, the login page will be a Server Component that renders a client-side form (or uses server actions directly) for the buttons.

### Page Structure
-   **Route**: `/app/(auth)/auth/signin/page.tsx`
    - NOTE: The `auth.ts` config points to `/auth/signin`. The folder structure should match.
    - We will place it in a `(auth)` group to potentially share layout (like a centered card layout).

### UI Components
We will use a "Card" based layout for the login box.
-   **Title**: "Welcome back"
-   **Description**: "Sign in to your account to continue"
-   **Social Buttons**:
    -   [G] Sign in with Google (Client Action: `signIn('google')`)
    -   [f] Sign in with Facebook (Client Action: `signIn('facebook')`)
-   **Divider**: "Or continue with" (if we add email later, but for now just social) -> Actually `auth.ts` implies pure social for now, though typical SaaS needs email. The user request specifically mentioned Google/Facebook. We will stick to those for the MVP but structure the card to allow Email addition easily.

### Component Composition
```tsx
// app/(auth)/auth/signin/page.tsx
export default function SignInPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
       <Card>
          <CardHeader>...</CardHeader>
          <CardContent>
             <SocialButtons />
          </CardContent>
       </Card>
    </div>
  )
}
```

## Security
-   CSRF protection is handled by NextAuth.
-   Callback URLs will be handled automatically by NextAuth (redirect to previous page or dashboard).
