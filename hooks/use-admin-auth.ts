"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAdminAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Ainda carregando

    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (session && !session.user?.isAdmin) {
      router.push('/admin/login')
      return
    }
  }, [session, status, router])

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated' && session?.user?.isAdmin === true
  }
}