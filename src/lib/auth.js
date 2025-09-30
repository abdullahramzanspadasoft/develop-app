import NextAuth from 'next-auth'

// Build-safe auth configuration - minimal configuration for build
export const authOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: typeof process !== 'undefined' ? (process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build') : 'fallback-secret-for-build',
}

// Only add providers at runtime, not during build
if (typeof process !== 'undefined' && typeof window === 'undefined') {
  try {
    const { GoogleProvider } = require('next-auth/providers/google')
    const { FacebookProvider } = require('next-auth/providers/facebook')
    
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      authOptions.providers.push(
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
      )
    }
    
    if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
      authOptions.providers.push(
        FacebookProvider({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        })
      )
    }
  } catch (error) {
    console.warn('Could not load OAuth providers:', error.message)
  }
}

export default NextAuth(authOptions)
