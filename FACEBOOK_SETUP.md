# Facebook OAuth Setup Guide

## 🚀 Facebook OAuth Configuration

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"Create App"**
3. Select **"Consumer"** app type
4. Fill in app details:
   - **App Name**: Your app name
   - **App Contact Email**: Your email
   - **App Purpose**: Authentication

### Step 2: Configure Facebook Login

1. In your app dashboard, go to **"Facebook Login"** > **"Settings"**
2. Add **Valid OAuth Redirect URIs**:
   - `http://localhost:3000/api/auth/callback/facebook` (for development)
   - `https://yourdomain.com/api/auth/callback/facebook` (for production)

### Step 3: Get App Credentials

1. Go to **"Settings"** > **"Basic"**
2. Copy **App ID** and **App Secret**
3. Update your `.env.local` file:

```env
# Facebook OAuth Configuration
FACEBOOK_CLIENT_ID=your-facebook-app-id-here
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret-here
NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

### Step 4: Configure App Permissions

1. Go to **"Facebook Login"** > **"Settings"**
2. Add these permissions:
   - `email` - User's email address
   - `public_profile` - Basic profile information

### Step 5: Test Facebook Authentication

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signin`
3. Click "Continue with Facebook"
4. Complete Facebook OAuth flow

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
NEXT_PUBLIC_GOOGLE_ENABLED=false

# Facebook OAuth Configuration
FACEBOOK_CLIENT_ID=your-facebook-app-id-here
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret-here
NEXT_PUBLIC_FACEBOOK_ENABLED=true
```

## 🎯 Features

- ✅ **Facebook OAuth Integration**
- ✅ **Automatic User Creation**
- ✅ **localStorage Integration**
- ✅ **Session Management**
- ✅ **Database Storage**

## 🚨 Important Notes

1. **Development**: Use `http://localhost:3000` in redirect URIs
2. **Production**: Update redirect URIs to your production domain
3. **Security**: Keep your app secret secure
4. **Testing**: Test with different Facebook accounts

## 🔍 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch"**

   - Check redirect URIs in Facebook App Settings
   - Ensure exact match with your domain

2. **"invalid_client"**

   - Verify App ID and App Secret
   - Check environment variables

3. **"access_denied"**

   - User cancelled OAuth flow
   - Check Facebook App permissions

4. **"App Not Setup"**
   - Make sure Facebook Login is enabled
   - Check app status in Facebook Developer Console

## 📱 User Flow

1. User clicks "Continue with Facebook"
2. Redirected to Facebook OAuth
3. User authorizes application
4. Redirected back to dashboard
5. User data stored in database and localStorage

## 🎉 Success!

Once configured, users can:

- Sign in with Facebook account
- Automatic account creation
- Seamless authentication
- Data stored in localStorage

## 🔄 Multiple OAuth Providers

Your app now supports:

- ✅ **Email/Password Authentication**
- ✅ **Google OAuth** (when configured)
- ✅ **Facebook OAuth** (when configured)

All providers work together seamlessly!
