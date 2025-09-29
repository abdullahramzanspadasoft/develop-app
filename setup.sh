#!/bin/bash

echo "🚀 Setting up Secure Auth - Complete Authentication System"
echo "=================================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env.local file
echo "🔧 Creating environment variables file..."
cat > .env.local << EOF
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Database Configuration
DATABASE_URL="file:./dev.db"
EOF

# Generate Prisma client
echo "🗄️ Setting up database..."
npx prisma generate

# Create and run migrations
echo "📊 Creating database migrations..."
npx prisma migrate dev --name init

echo "✅ Setup complete!"
echo ""
echo "🎉 Your authentication system is ready!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Create an account and test the authentication flow"
echo ""
echo "📚 Check the README.md for detailed documentation"
echo "🔒 Remember to change NEXTAUTH_SECRET in production!"
