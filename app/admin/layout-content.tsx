"use client"

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Button from '@/components/ui/button'
import { LogOut, User, Shield } from 'lucide-react'

export default function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'loading') return

    // Se não está autenticado e não está na página de login
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login')
      return
    }

    // Se está autenticado mas não é admin
    if (session && !session.user?.isAdmin && pathname !== '/admin/login') {
      router.push('/admin/login')
      return
    }

    // Se está na página de login mas já está autenticado como admin
    if (session?.user?.isAdmin && pathname === '/admin/login') {
      router.push('/admin')
      return
    }
  }, [session, status, router, pathname])

  // Página de login não precisa do layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Mostrar loading enquanto verifica autenticação
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não é admin autenticado, não renderizar o layout
  if (!session?.user?.isAdmin) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Administrativo */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-blue-600">
                  Nanda e Duda Kids - Admin
                </h1>
              </div>
            </div>

            {/* Navegação */}
            <nav className="hidden md:flex space-x-6">
              <a 
                href="/admin" 
                className={`transition-colors ${
                  pathname === '/admin' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Dashboard
              </a>
              <a 
                href="/admin/products" 
                className={`transition-colors ${
                  pathname === '/admin/products' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Produtos
              </a>
              <a 
                href="/admin/orders" 
                className={`transition-colors ${
                  pathname === '/admin/orders' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Pedidos
              </a>
              <a 
                href="/admin/emails" 
                className={`transition-colors ${
                  pathname === '/admin/emails' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Emails
              </a>
              <a 
                href="/admin/summary" 
                className={`transition-colors ${
                  pathname === '/admin/summary' 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Resumo
              </a>
              <a 
                href="/" 
                className="text-gray-600 hover:text-blue-600 transition-colors"
                target="_blank"
              >
                Ver Site
              </a>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{session.user.name || session.user.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}