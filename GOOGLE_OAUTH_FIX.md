# Fix: Google OAuth redirect_uri_mismatch Error

## The Problem
You're seeing: `Error 400: redirect_uri_mismatch`

This happens when the redirect URI in Google Cloud Console doesn't exactly match what NextAuth.js is sending.

## The Solution

NextAuth.js automatically constructs the callback URL as:
```
{NEXTAUTH_URL}/api/auth/callback/google
```

### Step 1: Check Your Environment Variable

First, verify your `.env` file has the correct `NEXTAUTH_URL`:

```bash
NEXTAUTH_URL="http://localhost:3000"
```

**Important checks:**
- ✅ Must be `http://` (not `https://`) for local development
- ✅ Must include the port number (`:3000`)
- ✅ No trailing slash
- ✅ Must match exactly what you're using in your browser

### Step 2: Fix Google Cloud Console Settings

1. **Go to Google Cloud Console**:
   - Navigate to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Go to **APIs & Services** → **Credentials**

2. **Edit Your OAuth 2.0 Client**:
   - Find your OAuth 2.0 Client ID
   - Click the **pencil icon** (Edit) or click on the client name

3. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
   - Must be exactly this (no trailing slash)
   - Protocol: `http://` (not `https://`)
   - Include port: `:3000`

4. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   - Must be exactly this (no trailing slash)
   - Full path: `/api/auth/callback/google`
   - Protocol: `http://` (not `https://`)
   - Include port: `:3000`

5. **Click Save**

### Step 3: Common Mistakes to Avoid

❌ **Wrong:**
```
https://localhost:3000/api/auth/callback/google  (using https)
http://localhost/api/auth/callback/google        (missing port)
http://localhost:3000/api/auth/callback/google/  (trailing slash)
http://localhost:3000/auth/callback/google      (wrong path)
```

✅ **Correct:**
```
http://localhost:3000/api/auth/callback/google
```

### Step 4: Verify Your Setup

1. **Check your `.env` file**:
   ```bash
   NEXTAUTH_URL="http://localhost:3000"
   AUTH_GOOGLE_ID="your-client-id"
   AUTH_GOOGLE_SECRET="your-client-secret"
   ```

2. **Restart your dev server**:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```
   Environment variables are only loaded when the server starts!

3. **Clear browser cache** (optional but recommended):
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

4. **Test again**:
   - Go to `http://localhost:3000/auth/signin`
   - Click the Google button
   - It should work now!

### Step 5: If It Still Doesn't Work

#### Check What URL NextAuth is Actually Using

Add this temporary debug code to see what's being sent:

1. Check your browser's Network tab:
   - Open DevTools (F12)
   - Go to Network tab
   - Click the Google login button
   - Look for the request to `accounts.google.com`
   - Check the `redirect_uri` parameter in the URL

2. The redirect_uri should be:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

#### Verify Your Server is Running on Port 3000

If your Next.js app is running on a different port (like 3001), update both:
- Your `.env` file: `NEXTAUTH_URL="http://localhost:3001"`
- Google Console redirect URI: `http://localhost:3001/api/auth/callback/google`

#### Check for Multiple OAuth Clients

Make sure you're editing the correct OAuth client in Google Console. If you have multiple clients, verify you're using the correct Client ID in your `.env` file.

### Step 6: Production Setup (When Deploying)

When you deploy to production, you'll need to add additional redirect URIs:

**In Google Cloud Console:**
- Add to **Authorized JavaScript origins**: `https://yourdomain.com`
- Add to **Authorized redirect URIs**: `https://yourdomain.com/api/auth/callback/google`

**In your production `.env`:**
```bash
NEXTAUTH_URL="https://yourdomain.com"
```

## Quick Checklist

- [ ] `.env` has `NEXTAUTH_URL="http://localhost:3000"` (no trailing slash)
- [ ] Google Console has `http://localhost:3000` in JavaScript origins
- [ ] Google Console has `http://localhost:3000/api/auth/callback/google` in redirect URIs
- [ ] No trailing slashes anywhere
- [ ] Using `http://` not `https://` for localhost
- [ ] Port number matches (3000)
- [ ] Restarted dev server after changing `.env`
- [ ] Cleared browser cache

## Still Having Issues?

If you've checked everything above and it's still not working:

1. **Double-check the exact error message** - Google sometimes shows the expected vs received URIs
2. **Check the browser console** for any additional errors
3. **Verify your OAuth consent screen** is configured (even in testing mode)
4. **Make sure you're testing with a Google account** that's added as a test user (if your app is in testing mode)

The redirect URI must match **exactly** - Google is very strict about this!
