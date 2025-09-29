# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing project
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Ecommerce Watch Authentication"
   - Authorized redirect URIs: `http://localhost:3001/api/auth/callback/google`

## Step 2: Update Environment Variables

Replace the placeholder values in `.env.local`:

```env
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
NEXT_PUBLIC_GOOGLE_ENABLED=true
```

## Step 3: Test Google OAuth

1. **Restart the development server**:

   ```bash
   npm run dev -- -p 3001
   ```

2. **Go to signin page**: http://localhost:3001/auth/signin
3. **Click "Continue with Google"**
4. **You should be redirected to Google OAuth**

## Step 4: Production Setup

For production, update:

- **Authorized redirect URIs**: `https://yourdomain.com/api/auth/callback/google`
- **NEXTAUTH_URL**: `https://yourdomain.com`

## Troubleshooting

- **400 Error**: Check redirect URI matches exactly
- **403 Error**: Verify Google+ API is enabled
- **Configuration Error**: Ensure environment variables are correct
