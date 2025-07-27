import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true, // Enable debug mode
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log('🔐 SignIn callback triggered:', { user: user.email, provider: account?.provider })
      
      if (account?.provider === 'google') {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Create new user in database for OAuth users
            const newUser = await prisma.user.create({
              data: {
                name: user.name || 'Google User',
                email: user.email!,
                password: '', // Empty password for OAuth users
                isVerified: true, // Google users are pre-verified
                role: 'admin', // Set all Google users as admin
                otp: null,
                otpExpiry: null
              }
            })
            console.log('✅ New Google user created in database:', user.email, 'ID:', newUser.id)
          } else {
            // Update existing user to ensure they're verified and admin
            const updatedUser = await prisma.user.update({
              where: { email: user.email! },
              data: {
                isVerified: true,
                role: 'admin',
                name: user.name || existingUser.name // Update name if provided
              }
            })
            console.log('✅ Existing user updated for Google auth:', user.email, 'ID:', updatedUser.id)
          }
          
          return true
        } catch (error) {
          console.error('❌ Error handling Google sign-in:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, account }) {
      console.log('🔑 JWT callback triggered:', { email: token.email, hasAccount: !!account })
      
      if (account) {
        token.accessToken = account.access_token
      }
      
      // Always try to get user role from database when we have an email
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email }
          })
          token.role = dbUser?.role || 'admin'
          console.log('🎭 User role set:', token.role)
        } catch (error) {
          console.error('Error fetching user role:', error)
          token.role = 'admin'
        }
      }
      
      return token
    },
    async session({ session, token }) {
      console.log('📋 Session callback triggered:', { email: session.user?.email, role: token.role })
      
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role || 'admin'
        }
      }
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback triggered:', { url, baseUrl })
      
      // Handle OAuth callback redirects
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      
      // If it's a callback URL, redirect to admin
      if (url.includes('/api/auth/callback')) {
        return `${baseUrl}/admin`
      }
      
      // Default redirect to admin after successful login
      return `${baseUrl}/admin`
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})