# Social Authentication Setup Guide

This guide will walk you through setting up Google and Facebook login for your eFormServices application.

## Overview

Your application already has the code infrastructure in place for social authentication:
- ✅ NextAuth.js v5 configured with Google and Facebook providers
- ✅ UI components (`SocialButtons`) integrated into signin/signup pages
- ✅ Server actions (`signInWithGoogle`, `signInWithFacebook`) ready to use
- ✅ Database schema configured for OAuth accounts

You just need to:
1. Set up OAuth applications with Google and Facebook
2. Configure environment variables
3. Test the integration

---

## Step 1: Set Up Google OAuth

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** → **"New Project"**
3. Enter a project name (e.g., "eFormServices")
4. Click **"Create"**

### 1.2 Configure OAuth Consent Screen

1. In your project, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have a Google Workspace account)
3. Click **Create**
4. Fill in the required fields:
   - **App name**: eFormServices (or your app name)
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **Save and Continue**
6. On the **Scopes** page, click **Save and Continue** (default scopes are fine)
7. On the **Test users** page (if in testing mode), add test emails, then **Save and Continue**
8. Review and **Back to Dashboard**

### 1.3 Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the consent screen (you already did this)
4. Select **Application type**: **Web application**
5. Give it a name (e.g., "eFormServices Web Client")
6. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
   (Add your production URL when deploying, e.g., `https://yourdomain.com`)
7. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (Add production URL: `https://yourdomain.com/api/auth/callback/google`)
8. Click **Create**
9. **Copy the Client ID and Client Secret** - you'll need these for your `.env` file

---

## Step 2: Set Up Facebook OAuth

### 2.1 Create Facebook App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select **"Consumer"** as the app type
4. Fill in:
   - **App name**: eFormServices (or your app name)
   - **App contact email**: Your email
5. Click **Create App**

### 2.2 Add Facebook Login Product

1. In your app dashboard, find **"Add Products to Your App"**
2. Click **"Set Up"** on **Facebook Login**
3. Select **"Web"** as the platform
4. Enter your site URL: `http://localhost:3000` (or your production URL)
5. Click **Save**

### 2.3 Configure Facebook Login Settings

1. In the left sidebar, go to **Facebook Login** → **Settings**
2. Under **Valid OAuth Redirect URIs**, add:
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```
   (Add production URL: `https://yourdomain.com/api/auth/callback/facebook`)
3. Click **Save Changes**

### 2.4 Get App Credentials

1. Go to **Settings** → **Basic**
2. Copy the **App ID** and **App Secret**
   - If you don't see the App Secret, click **"Show"** next to it
   - You may need to enter your password

### 2.5 Configure App Domains (Optional but Recommended)

1. Still in **Settings** → **Basic**
2. Under **App Domains**, add:
   ```
   localhost
   yourdomain.com
   ```
3. Click **Save Changes**

---

## Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and update the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id-here"
AUTH_GOOGLE_SECRET="your-google-client-secret-here"

# Facebook OAuth
AUTH_FACEBOOK_ID="your-facebook-app-id-here"
AUTH_FACEBOOK_SECRET="your-facebook-app-secret-here"
```

### Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

---

## Step 4: Verify Database Schema

Your Prisma schema already includes the necessary tables for OAuth:
- `User` - stores user information
- `Account` - stores OAuth provider accounts (Google, Facebook)
- `Session` - manages user sessions

Make sure your database is up to date:
```bash
npm run db:push
# or
npm run db:migrate
```

---

## Step 5: Test the Integration

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to the sign-in page**:
   ```
   http://localhost:3000/auth/signin
   ```

3. **Test Google Login**:
   - Click the "Google" button
   - You should be redirected to Google's consent screen
   - After authorizing, you'll be redirected back to your app
   - You should be logged in and redirected to `/dashboard/pdfs`

4. **Test Facebook Login**:
   - Click the "Facebook" button
   - You should be redirected to Facebook's login screen
   - After logging in and authorizing, you'll be redirected back
   - You should be logged in and redirected to `/dashboard/pdfs`

---

## Troubleshooting

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Check for trailing slashes or protocol mismatches (http vs https)

**Error: "access_denied"**
- Make sure your OAuth consent screen is published (or add test users if in testing mode)
- Check that your app is not in restricted mode

### Facebook OAuth Issues

**Error: "Invalid OAuth access token"**
- Verify your App ID and App Secret are correct
- Make sure Facebook Login product is enabled
- Check that redirect URI is added in Facebook Login settings

**Error: "App Not Setup"**
- Make sure you've added the Facebook Login product to your app
- Verify the app is not in development mode restrictions (or add test users)

### General Issues

**Social buttons don't appear**
- Check browser console for errors
- Verify environment variables are loaded (restart dev server after changing `.env`)
- Check that `SocialButtons` component is imported correctly

**Redirect loops**
- Verify `NEXTAUTH_URL` matches your actual URL
- Check that callback URLs are correctly configured in both providers
- Ensure database tables exist (run migrations)

**Session not persisting**
- Check that `NEXTAUTH_SECRET` is set
- Verify database connection is working
- Check Prisma adapter is working correctly

---

## Production Deployment

When deploying to production:

1. **Update OAuth Redirect URIs**:
   - Google: Add `https://yourdomain.com/api/auth/callback/google`
   - Facebook: Add `https://yourdomain.com/api/auth/callback/facebook`

2. **Update Environment Variables**:
   ```bash
   NEXTAUTH_URL="https://yourdomain.com"
   ```

3. **Update Authorized JavaScript Origins** (Google):
   - Add `https://yourdomain.com`

4. **Facebook App Settings**:
   - Add your production domain to App Domains
   - Update Site URL to your production URL

5. **Security**:
   - Never commit `.env` file to version control
   - Use environment variables in your hosting platform (Vercel, etc.)
   - Ensure `NEXTAUTH_SECRET` is a strong, random value

---

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/web)

---

## Quick Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Google OAuth credentials created
- [ ] Redirect URI added to Google Console
- [ ] Facebook app created
- [ ] Facebook Login product added
- [ ] Redirect URI added to Facebook settings
- [ ] Environment variables configured in `.env`
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] Database migrations run
- [ ] Tested Google login
- [ ] Tested Facebook login
- [ ] Production URLs configured (when deploying)
