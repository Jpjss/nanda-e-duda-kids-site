import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isAdmin: boolean
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name: string
    isAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean
  }
}