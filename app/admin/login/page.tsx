"use client"

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@nandaedudakids.com')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    console.log('🔐 Iniciando login com:', { email, password: '***' })

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      console.log('📋 Resultado do signIn:', result)

      if (result?.error) {
        console.log('❌ Erro no signIn:', result.error)
        setError('Email ou senha inválidos')
        setIsLoading(false)
        return
      }

      console.log('✅ SignIn sem erro, verificando sessão...')
      // Verificar se o usuário é admin
      const session = await getSession()
      console.log('👤 Sessão obtida:', session)
      
      if (session?.user?.isAdmin) {
        console.log('🚀 Admin confirmado, redirecionando...')
        router.push('/admin')
      } else {
        console.log('⚠️ Usuário não é admin ou sessão inválida')
        setError('Acesso negado. Apenas administradores podem acessar.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('💥 Erro no login:', error)
      setError('Erro interno. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Nanda e Duda Kids</p>
        </div>

        {/* Formulário de Login */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Login de Administrador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Campo Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nandaedudakids.com"
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <div className="text-red-800 text-sm">{error}</div>
                </Alert>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar no Painel'
                )}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* Links */}
        <div className="text-center mt-6">
          <a 
            href="/" 
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Voltar ao site
          </a>
        </div>

        {/* Info de Desenvolvimento */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 text-center">
            <strong>Desenvolvimento:</strong> Use qualquer email de admin cadastrado no banco de dados
          </p>
        </div>

      </div>
    </div>
  )
}