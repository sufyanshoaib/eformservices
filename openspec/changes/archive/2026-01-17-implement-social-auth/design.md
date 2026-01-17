# Design: Social Authentication UI

## Architecture
We will use the existing NextAuth.js v5 setup. Since NextAuth v5 integrates closely with Server Actions, the login page will be a Server Component that renders a client-side form (or uses server actions directly) for the buttons.

### Page Structure
-   **Sign In**: `/app/(auth)/auth/signin/page.tsx`
-   **Sign Up**: `/app/(auth)/auth/signup/page.tsx`
-   Both pages will use a shared layout for a centered card.

### UI Components
We will use a "Card" based layout for the auth box.
-   **Sign In**:
    -   Email & Password input fields.
    -   "Forgot password?" link (placeholder for now).
    -   Divider: "Or continue with".
    -   Social Buttons (Google, Facebook).
    -   "Don't have an account? Sign up" link.
-   **Sign Up**:
    -   Name, Email, and Password input fields.
    -   "Already have an account? Sign in" link.

### Auth Logic
-   **Credentials Provider**: We will add a `Credentials` provider to `auth.ts` to handle email/password validation using `bcryptjs`.
-   **Server Actions**:
    -   `signInWithCredentials`: Validate email/password and call NextAuth `signIn`.
    -   `signUpWithCredentials`: Create user in Prisma with hashed password.

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
