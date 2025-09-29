# Real Google OAuth Setup - Step by Step

## 🚨 CURRENT PROBLEM:

You're getting 400 error because Google credentials are FAKE!

## ✅ SOLUTION:

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### Step 2: Create Project

1. Click "Select a project" dropdown
2. Click "New Project"
3. Name: "Ecommerce Watch Auth"
4. Click "Create"

### Step 3: Enable Google+ API

1. Go to "APIs & Services" > "Library"
2. Search "Google+ API"
3. Click on it and "Enable"

### Step 4: Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Application type: "Web application"
4. Name: "Ecommerce Watch Authentication"
5. **Authorized redirect URIs**: `http://localhost:3001/api/auth/callback/google`
6. Click "Create"

### Step 5: Copy Credentials

After creation, you'll get:

- **Client ID**: Something like `123456789-abc123.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-abc123def456`

### Step 6: Update .env.local

Replace the fake values with real ones:

```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-super-secret-key-12345-very-long-and-secure
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
NEXT_PUBLIC_GOOGLE_ENABLED=true
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

### Step 7: Restart Server

```bash
npm run dev -- -p 3001
```

### Step 8: Test

1. Go to: http://localhost:3001/auth/signin
2. Click "Continue with Google"
3. Should redirect to Google OAuth (no more 400 error!)

## 🎯 WHY 400 ERROR HAPPENS:

- Google receives fake credentials
- Google says "Invalid credentials"
- Returns 400 error
- User sees error message

## ✅ AFTER REAL CREDENTIALS:

- Google accepts credentials
- Redirects to Google OAuth page
- User can sign in with Google
- No more 400 error!

