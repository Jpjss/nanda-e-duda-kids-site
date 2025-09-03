"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestLogin() {
  const [email, setEmail] = useState('admin@nandaedudakids.com')
  const [password, setPassword] = useState('123456')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/test-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Teste de Login Direto</CardTitle>
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
          
          <Button onClick={testLogin} disabled={loading} className="w-full">
            {loading ? 'Testando...' : 'Testar Login'}
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