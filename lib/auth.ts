import type { NextAuthOptions, DefaultUser } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from 'lib/prisma'

export let authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user?.id
        token.role = user?.role
      }
      return token
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token?.id
        session.user.role = token?.role
      }
      return session
    },
  },
  pages: {
    signIn: '/sign-in',
    verifyRequest: `/sign-in`,
    error: "/sign-in",
  },
}

if (process.env.NODE_ENV === 'development') {
  authOptions.providers.push(CredentialsProvider({
    name: "devAuth",
    credentials: {
      username: {
        label: "Username",
        type: "text",
        placeholder: "user",
      }
    },
    async authorize(credentials) {
      console.log('credentials', credentials)
      if (credentials?.username === 'admin') {
        return {
          id: 2,
          name: 'admin',
          email: 'admin@domain.com',
          image: 'https://i.pravatar.cc/150?u=admin@domain.com',
          role: 'ADMIN',
        }
      }
      if (credentials?.username === 'user') {
        return {
          id: 3,
          name: 'user',
          email: 'user@domain.com',
          image: 'https://i.pravatar.cc/150?u=user@domain.com',
          role: 'USER',
        }
      }
      return null
    },
  }))
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: DefaultUser & {
      id: string
      role: string
    }
  }

  interface User extends DefaultUser {
    id: string
    role: string
  }
}

declare module 'next-auth/jwt/types' {
  interface JWT {
    id: string
    role: string
  }
}
