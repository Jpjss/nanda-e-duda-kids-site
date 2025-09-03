"use client"

import { useState } from 'react'
import { useEmail } from '@/hooks/use-email'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function EmailTestPanel() {
  const { sendEmail, loading, error } = useEmail()
  const [result, setResult] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    type: 'order_confirmation',
    customerName: 'João Silva',
    customerEmail: 'joao.silva@teste.com',
    orderId: 'test-order-123',
    total: 89.90,
    paymentMethod: 'PIX'
  })

  const handleSendTest = async () => {
    setResult(null)

    const orderData = {
      id: formData.orderId,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      total: formData.total,
      paymentMethod: formData.paymentMethod,
      shippingStreet: 'Rua das Flores, 123',
      shippingNeighborhood: 'Centro',
      shippingCity: 'São Paulo',
      shippingState: 'SP',
      shippingZipCode: '01234567',
      items: [
        {
          name: 'Camiseta Super Herói',
          price: 29.90,
          quantity: 2,
          size: 'M',
          color: 'Azul',
          image: '/camiseta-super-heroi.png'
        },
        {
          name: 'Vestido Verão Encantado',
          price: 30.00,
          quantity: 1,
          size: 'P',
          color: 'Rosa',
          image: '/vestido-verao-encantado.png'
        }
      ]
    }

    const emailData: any = {
      type: formData.type as any,
      orderData
    }

    if (formData.type === 'status_update') {
      emailData.oldStatus = 'PENDING'
      emailData.newStatus = 'CONFIRMED'
    }

    if (formData.type === 'pix_pending') {
      emailData.pixData = {
        pixKey: 'test@pix.com',
        qrCode: '/qr-code-example.png'
      }
    }

    const response = await sendEmail(emailData)
    
    if (response.success) {
      setResult('Email enviado com sucesso! ✅')
    } else {
      setResult(`Erro: ${response.error} ❌`)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Painel de Teste de Emails
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Tipo de Email */}
        <div className="space-y-2">
          <Label htmlFor="emailType">Tipo de Email</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => setFormData({...formData, type: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order_confirmation">Confirmação de Pedido</SelectItem>
              <SelectItem value="pix_pending">PIX Pendente</SelectItem>
              <SelectItem value="status_update">Atualização de Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dados do Cliente */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nome do Cliente</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              placeholder="Nome completo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email do Cliente</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
              placeholder="email@exemplo.com"
            />
          </div>
        </div>

        {/* Dados do Pedido */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">ID do Pedido</Label>
            <Input
              id="orderId"
              value={formData.orderId}
              onChange={(e) => setFormData({...formData, orderId: e.target.value})}
              placeholder="order-123"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="total">Total (R$)</Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              value={formData.total}
              onChange={(e) => setFormData({...formData, total: parseFloat(e.target.value)})}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método</Label>
            <Select 
              value={formData.paymentMethod} 
              onValueChange={(value) => setFormData({...formData, paymentMethod: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Descrição do Template */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Preview do Template:</h4>
          {formData.type === 'order_confirmation' && (
            <p className="text-sm text-gray-600">
              Email de confirmação com resumo do pedido, itens comprados e dados de entrega.
            </p>
          )}
          {formData.type === 'pix_pending' && (
            <p className="text-sm text-gray-600">
              Email com instruções de pagamento PIX, QR Code e prazo para pagamento.
            </p>
          )}
          {formData.type === 'status_update' && (
            <p className="text-sm text-gray-600">
              Email de atualização quando status muda de "PENDING" para "CONFIRMED".
            </p>
          )}
        </div>

        {/* Botão de Envio */}
        <Button 
          onClick={handleSendTest}
          disabled={loading || !formData.customerEmail}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Enviar Email de Teste
            </>
          )}
        </Button>

        {/* Resultado */}
        {result && (
          <Alert className={result.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            {result.includes('✅') ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.includes('✅') ? 'text-green-800' : 'text-red-800'}>
              {result}
            </AlertDescription>
          </Alert>
        )}

        {/* Erro */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Informações sobre Configuração */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium mb-2 text-blue-900">📋 Configuração Necessária:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Configure RESEND_API_KEY no arquivo .env</li>
            <li>• Verifique EMAIL_FROM e outros domínios</li>
            <li>• Para produção, use domínio verificado no Resend</li>
          </ul>
        </div>

      </CardContent>
    </Card>
  )
}