# Secure Auth - Complete Authentication System

A complete authentication system built with Next.js, NextAuth.js, Prisma, and Tailwind CSS. Features include user registration, login, protected routes, and a beautiful UI.

## Features

- ✅ **Complete Authentication System**

  - User registration with email/password
  - Secure login with credentials
  - Password hashing with bcryptjs
  - Session management with NextAuth.js

- ✅ **Database Integration**

  - SQLite database with Prisma ORM
  - User model with proper relationships
  - Account and session management

- ✅ **Beautiful UI**

  - Modern, responsive design
  - Form validation with react-hook-form and zod
  - Loading states and error handling
  - Smooth animations and transitions

- ✅ **Security Features**
  - Protected routes with middleware
  - Password strength validation
  - Secure session handling
  - CSRF protection

## Tech Stack

- **Frontend**: Next.js 13, React, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: SQLite with Prisma ORM
- **Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file in the root directory:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Database Configuration
DATABASE_URL="file:./dev.db"
```

### 3. Set up the Database

```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view your data
npx prisma studio
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.js    # NextAuth.js API route
│   │   └── signup/route.js           # User registration API
│   ├── auth/
│   │   ├── signin/page.js           # Sign in page
│   │   └── signup/page.js           # Sign up page
│   ├── dashboard/page.js            # Protected dashboard
│   ├── layout.js                    # Root layout with session provider
│   └── page.js                      # Home page
├── components/
│   └── SessionProvider.js           # NextAuth session provider wrapper
├── lib/
│   └── auth.js                      # NextAuth configuration
└── middleware.js                    # Route protection middleware
```

## Usage

### Authentication Flow

1. **Home Page**: Users can choose to sign in or sign up
2. **Sign Up**: Create a new account with name, email, and password
3. **Sign In**: Login with existing credentials
4. **Dashboard**: Protected area accessible only to authenticated users
5. **Sign Out**: Secure logout with session cleanup

### Protected Routes

The middleware automatically protects routes matching:

- `/dashboard/*`
- `/profile/*`
- `/admin/*`

### API Endpoints

- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

## Customization

### Adding New Protected Routes

Update `src/middleware.js`:

```javascript
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/your-new-route/:path*", // Add your new route here
  ],
};
```

### Styling

The application uses Tailwind CSS with custom animations and components. You can customize the design by modifying the CSS classes in the components.

## Security Notes

- Change the `NEXTAUTH_SECRET` in production
- Use a strong database password in production
- Consider using environment-specific database URLs
- Implement rate limiting for authentication endpoints
- Add email verification for user registration

## Deployment

1. Set up your production database
2. Update environment variables
3. Run database migrations
4. Deploy to your preferred platform (Vercel, Netlify, etc.)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
# abdullh
