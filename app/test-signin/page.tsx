"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestLogin() {
  const [email, setEmail] = useState('admin@nandaedudakids.com')
  const [password, setPassword] = useState('123456')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testSignIn = async () => {
    setLoading(true)
    setResult('')
    
    console.log('🔐 Iniciando teste de login com NextAuth...')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      console.log('📋 Resultado completo:', result)
      setResult(JSON.stringify(result, null, 2))
      
    } catch (error) {
      console.error('💥 Erro no signIn:', error)
      setResult(`Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Teste NextAuth SignIn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button onClick={testSignIn} disabled={loading} className="w-full">
            {loading ? 'Testando...' : 'Testar SignIn'}
          </Button>
          
          {result && (
            <div className="mt-4">
              <Label>Resultado:</Label>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
                {result}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}