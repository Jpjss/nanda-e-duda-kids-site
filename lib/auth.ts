import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 AUTHORIZE CALLED:', {
          email: credentials?.email,
          hasPassword: !!credentials?.password
        })
        
        // TESTE ULTRA SIMPLES - qualquer email/senha funciona
        if (credentials?.email && credentials?.password) {
          console.log('✅ SIMPLE AUTH SUCCESS')
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin',
            isAdmin: true
          }
        }
        
        console.log('❌ SIMPLE AUTH FAILED')
        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎫 JWT CALLBACK:', { 
        tokenEmail: token?.email, 
        userEmail: user?.email 
      })
      
      if (user) {
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      console.log('📋 SESSION CALLBACK:', { 
        sessionEmail: session?.user?.email, 
        tokenEmail: token?.email 
      })
      
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}