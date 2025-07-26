import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.role = 'admin' // For this demo, all Google users get admin role
      }
      return token
    },
    async session({ session, token }) {
      // Add custom properties
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          role: token.role || 'admin'
        }
      }
    },
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }