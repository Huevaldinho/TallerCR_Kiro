import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * Get the current user's taller ID from the session
 * This replaces the DEMO_TALLER_ID() function used during development
 * 
 * @throws Error if no session or tallerId is found
 * @returns The taller ID from the current session
 */
export async function getCurrentTallerId(): Promise<string> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.tallerId) {
    throw new Error('No authenticated session found')
  }

  return session.user.tallerId
}

/**
 * Get the current session
 * 
 * @returns The current session or null if not authenticated
 */
export async function getCurrentSession() {
  return await getServerSession(authOptions)
}

/**
 * Get the current user from the session
 * 
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user || null
}
