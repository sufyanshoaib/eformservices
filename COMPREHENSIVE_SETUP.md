# Project Setup & Configuration Guide

This guide details the services required to run `eFormServices` and how to obtain the necessary API keys and secrets.

## 1. Database (PostgreSQL)
We use **Supabase** for the PostgreSQL database, but any Postgres provider works.

### **Steps:**
1.  **Create Account**: Sign up at [supabase.com](https://supabase.com).
2.  **New Project**: Create a new project.
3.  **Get Connection String**:
    *   Go to **Project Settings** > **Database**.
    *   Under **Connection string**, select **Node.js**.
    *   Copy the URI. It will look like:
        `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
    *   **Important**: Replace `[YOUR-PASSWORD]` with the database password you set during creation.
4.  **Update .env**:
    ```bash
    DATABASE_URL="postgresql://postgres:password@..."
    ```

## 2. File Storage (Vercel Blob)
We use **Vercel Blob** for storing PDF files.

### **Steps:**
1.  **Create Account**: Sign up at [vercel.com](https://vercel.com).
2.  **Create Store**:
    *   Go to **Storage** tab in your dashboard.
    *   Click **Create Database** -> Select **Blob**.
    *   Give it a name (e.g., `eformservices-storage`).
3.  **Get Token**:
    *   Once created, find the **Environment Variables** section or "How to connect".
    *   Copy the `BLOB_READ_WRITE_TOKEN`.
4.  **Update .env**:
    ```bash
    BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
    ```

## 3. Authentication (NextAuth.js)

### **A. General Setup**
1.  **Generate Secret**: You need a random string to encrypt sessions.
    *   Run in terminal: `openssl rand -base64 32`
    *   Copy the output.
2.  **Update .env**:
    ```bash
    NEXTAUTH_SECRET="[YOUR-GENERATED-STRING]"
    NEXTAUTH_URL="http://localhost:3000" # Change to your domain in production
    ```

### **B. Google Sign-In**
1.  **Console**: Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  **Project**: Create a new project.
3.  **OAuth Consent Screen**:
    *   Go to **APIs & Services** > **OAuth consent screen**.
    *   Select **External** > Create.
    *   Fill in App Name and Support Email.
4.  **Credentials**:
    *   Go to **Credentials** > **Create Credentials** > **OAuth client ID**.
    *   Application type: **Web application**.
    *   **Authorized JavaScript origins**: `http://localhost:3000`
    *   **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
5.  **Get Keys**: Copy "Client ID" and "Client Secret".
6.  **Update .env**:
    ```bash
    AUTH_GOOGLE_ID="[YOUR-CLIENT-ID]"
    AUTH_GOOGLE_SECRET="[YOUR-CLIENT-SECRET]"
    ```

### **C. Facebook Login**
1.  **Console**: Go to [Meta for Developers](https://developers.facebook.com/).
2.  **App**: Create a new app > Select **Authenticate and access data from users with Facebook Login**.
3.  **Settings**:
    *   In the App Dashboard, go to **products** > **Facebook Login** > **Settings**.
    *   **Valid OAuth Redirect URIs**: `http://localhost:3000/api/auth/callback/facebook`
4.  **Get Keys**:
    *   Go to **Settings** > **Basic**.
    *   Copy "App ID" and "App Secret".
5.  **Update .env**:
    ```bash
    AUTH_FACEBOOK_ID="[YOUR-APP-ID]"
    AUTH_FACEBOOK_SECRET="[YOUR-APP-SECRET]"
    ```

## 4. Final Checklist (.env)
Your `.env` file should look like this:

```bash
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="long-random-string"

# Providers
AUTH_GOOGLE_ID="client-id"
AUTH_GOOGLE_SECRET="client-secret"
AUTH_FACEBOOK_ID="app-id"
AUTH_FACEBOOK_SECRET="app-secret"

# Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```
