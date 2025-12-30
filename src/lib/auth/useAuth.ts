'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email)
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('🔐 Login result:', { ok: result?.ok, error: result?.error })

      if (result?.error) {
        console.error('❌ Login failed:', result.error)
        throw new Error(result.error)
      }

      if (result?.ok) {
        console.log('✅ Login successful, redirecting to dashboard...')
        
        // Wait a bit for session to be established
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Force navigation
        window.location.href = '/dashboard'
      }

      return result
    } catch (error) {
      console.error('❌ Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
    router.refresh()
  }

  return {
    user: session?.user,
    tallerId: session?.user?.tallerId,
    tallerNombre: session?.user?.tallerNombre,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login,
    logout,
  }
}
