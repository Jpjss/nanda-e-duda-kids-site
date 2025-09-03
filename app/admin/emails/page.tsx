"use client"

import EmailTestPanel from '@/components/email-test-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Settings, TestTube } from 'lucide-react'

export default function AdminEmailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Administração de Emails</h1>
        <p className="text-gray-600">
          Teste e configure o sistema de emails da Nanda e Duda Kids
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistema de Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ativo</div>
            <p className="text-xs text-muted-foreground">
              Resend configurado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Templates disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integração</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Webhook</div>
            <p className="text-xs text-muted-foreground">
              Auto-envio ativo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Painel de Teste */}
      <EmailTestPanel />

      {/* Documentação */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📚 Documentação dos Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-green-700">Confirmação de Pedido</h4>
            <p className="text-sm text-gray-600">
              Enviado automaticamente quando o pagamento é aprovado via webhook.
              Inclui resumo do pedido, itens, dados de entrega e próximos passos.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-yellow-700">PIX Pendente</h4>
            <p className="text-sm text-gray-600">
              Enviado quando um pedido é criado com PIX como método de pagamento.
              Contém instruções, QR Code e prazo para pagamento.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-blue-700">Atualização de Status</h4>
            <p className="text-sm text-gray-600">
              Enviado quando o status do pedido muda (ex: enviado, entregue).
              Inclui código de rastreamento quando aplicável.
            </p>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}