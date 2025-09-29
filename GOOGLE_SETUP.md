# Google OAuth Setup Guide

## 🚀 Google OAuth Configuration

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Select **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)

### Step 3: Get Credentials

1. Copy **Client ID** and **Client Secret**
2. Update your `.env.local` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Step 4: Test Google Authentication

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3001/auth/signin`
3. Click "Continue with Google"
4. Complete Google OAuth flow

## 🔧 Environment Variables

Add these to your `.env.local` file:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Database Configuration
DATABASE_URL="file:./dev.db"

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

## 🎯 Features

- ✅ **Google OAuth Integration**
- ✅ **Automatic User Creation**
- ✅ **localStorage Integration**
- ✅ **Session Management**
- ✅ **Database Storage**

## 🚨 Important Notes

1. **Development**: Use `http://localhost:3000` in redirect URIs
2. **Production**: Update redirect URIs to your production domain
3. **Security**: Keep your client secret secure
4. **Testing**: Test with different Google accounts

## 🔍 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch"**

   - Check redirect URIs in Google Console
   - Ensure exact match with your domain

2. **"invalid_client"**

   - Verify Client ID and Secret
   - Check environment variables

3. **"access_denied"**
   - User cancelled OAuth flow
   - Check Google Console settings

## 📱 User Flow

1. User clicks "Continue with Google"
2. Redirected to Google OAuth
3. User authorizes application
4. Redirected back to dashboard
5. User data stored in database and localStorage

## 🎉 Success!

Once configured, users can:

- Sign in with Google account
- Automatic account creation
- Seamless authentication
- Data stored in localStorage
