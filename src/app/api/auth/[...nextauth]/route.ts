import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma/client'

export const authOptions: NextAuthOptions = {
  debug: true, // Enable debugging to see detailed logs
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 [NextAuth] Authorize called with email:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.error('❌ [NextAuth] Missing credentials')
          throw new Error('Email y contraseña son requeridos')
        }

        // Find user by email
        console.log('🔍 [NextAuth] Looking up user:', credentials.email)
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { taller: true },
        })

        if (!user) {
          console.error('❌ [NextAuth] User not found:', credentials.email)
          throw new Error('Credenciales inválidas')
        }

        console.log('✅ [NextAuth] User found:', {
          id: user.id,
          email: user.email,
          hasPasswordHash: !!user.passwordHash,
          passwordHashLength: user.passwordHash?.length
        })

        // Verify password
        console.log('🔐 [NextAuth] Comparing passwords...')
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        console.log('🔐 [NextAuth] Password valid:', isPasswordValid)

        if (!isPasswordValid) {
          console.error('❌ [NextAuth] Invalid password for user:', credentials.email)
          throw new Error('Credenciales inválidas')
        }

        console.log('✅ [NextAuth] Authentication successful for:', credentials.email)

        // Return user data for session
        return {
          id: user.id,
          email: user.email,
          tallerId: user.tallerId,
          tallerNombre: user.taller.nombre,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add custom fields to token on sign in
      if (user) {
        token.userId = user.id
        token.tallerId = (user as any).tallerId
        token.tallerNombre = (user as any).tallerNombre
      }
      return token
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        session.user.id = token.userId as string
        session.user.tallerId = token.tallerId as string
        session.user.tallerNombre = token.tallerNombre as string
      }
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

