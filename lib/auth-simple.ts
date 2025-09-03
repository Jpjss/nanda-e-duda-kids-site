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
        console.log('🔐 TESTE SIMPLES - Credentials:', credentials?.email)
        
        // Teste ultra simples
        if (credentials?.email === 'admin@nandaedudakids.com' && credentials?.password === '123456') {
          console.log('✅ TESTE SIMPLES - Login aceito')
          return {
            id: '1',
            email: credentials.email,
            name: 'Admin',
            isAdmin: true
          }
        }
        
        console.log('❌ TESTE SIMPLES - Login negado')
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
      console.log('🎫 JWT callback - user:', user?.email)
      if (user) {
        token.isAdmin = user.isAdmin
      }
      return token
    },
    async session({ session, token }) {
      console.log('📋 Session callback - token:', token?.email)
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}