# Vercel Deployment Guide

## 🚀 Deploy to Vercel

### Step 1: Environment Variables

Add these environment variables in your Vercel dashboard:

#### Required:

```env
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
```

#### Optional (for Gmail verification):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Optional (for Google OAuth):

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 2: Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Update Google OAuth (if using)

1. Go to Google Cloud Console
2. Update OAuth redirect URI to:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

### Step 4: Test Deployment

1. Visit your Vercel URL
2. Test Gmail verification
3. Test Google OAuth (if configured)

## ✅ Build Issues Fixed

- ✅ Removed invalid env config from next.config.js
- ✅ Added proper Vercel configuration
- ✅ Fixed dynamic rendering for API routes
- ✅ Added fallback values for missing dependencies

## 🔧 Troubleshooting

### If build still fails:

1. **Check environment variables** in Vercel dashboard
2. **Update NEXTAUTH_URL** to your actual Vercel domain
3. **Generate new NEXTAUTH_SECRET** if needed
4. **Redeploy** after adding environment variables

### Common Issues:

- **Missing NEXTAUTH_SECRET**: Generate a random string
- **Wrong NEXTAUTH_URL**: Use your actual Vercel domain
- **Google OAuth errors**: Update redirect URI in Google Console

## 🎉 Success!

Once deployed, your app will be available at:
`https://your-app-name.vercel.app`

All features should work:

- ✅ Gmail verification
- ✅ Google OAuth
- ✅ Watch store functionality
- ✅ Responsive design

