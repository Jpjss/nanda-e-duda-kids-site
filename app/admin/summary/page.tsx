"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle2, 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart, 
  Mail,
  Calendar,
  DollarSign
} from 'lucide-react'

export default function AdminSummary() {
  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resumo do Sistema</h1>
        <p className="text-gray-600">Status atual da implementação da Nanda e Duda Kids</p>
      </div>

      {/* Progresso das Fases */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progresso da Implementação - 10 Fases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            {/* Fases Completas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Fase 1 - Sistema de Carrinho</p>
                  <p className="text-sm text-green-600">Context API + localStorage</p>
                </div>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Fase 2 - Páginas de Detalhes</p>
                  <p className="text-sm text-green-600">Routing dinâmico [id]</p>
                </div>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Fase 3 - Sistema de Checkout</p>
                  <p className="text-sm text-green-600">Formulários + Validação</p>
                </div>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Fase 4 - Banco de Dados</p>
                  <p className="text-sm text-green-600">Prisma + SQLite</p>
                </div>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Fase 5 - API Routes</p>
                  <p className="text-sm text-green-600">Next.js App Router</p>
                </div>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Fase 6 - Sistema de Emails</p>
                  <p className="text-sm text-green-600">Resend + Templates</p>
                </div>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Fase 7 - Painel Administrativo</p>
                  <p className="text-sm text-green-600">Dashboard + Gestão</p>
                </div>
                <Badge className="bg-green-100 text-green-800">100%</Badge>
              </div>

            </div>

            {/* Fases Pendentes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Fase 8 - Sistema de Autenticação</p>
                  <p className="text-sm text-yellow-600">Admin login + proteção</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Fase 9 - Testes e Validação</p>
                  <p className="text-sm text-yellow-600">QA + Correções</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Fase 10 - Deploy e Produção</p>
                  <p className="text-sm text-yellow-600">Vercel + Docs</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
              </div>

            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
              <span className="text-sm font-medium text-gray-700">7/10 (70%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              E-commerce Core
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Carrinho de Compras</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Checkout</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pagamentos (PIX/Cartão)</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mercado Pago</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestão de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Catálogo Dinâmico</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Páginas de Produto</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Admin CRUD</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Busca e Filtros</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sistema de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Gestão de Status</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Webhooks MP</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dashboard Admin</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Relatórios</span>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Sistema de Notificações */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sistema de Emails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-800">Confirmação de Pedido</h3>
              <p className="text-sm text-green-600">Template responsivo</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-800">PIX Pendente</h3>
              <p className="text-sm text-green-600">Instruções automáticas</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-800">Status Update</h3>
              <p className="text-sm text-green-600">Mudanças de status</p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-800">Painel de Teste</h3>
              <p className="text-sm text-green-600">Interface admin</p>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-800">Fase 8 - Sistema de Autenticação</h3>
              <p className="text-sm text-gray-600 mt-1">
                Implementar login de administrador com NextAuth.js, proteção de rotas e sessões seguras.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-purple-800">Fase 9 - Testes e Validação</h3>
              <p className="text-sm text-gray-600 mt-1">
                Testar todos os fluxos, validar integrações de pagamento e corrigir possíveis bugs.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-green-800">Fase 10 - Deploy e Produção</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configurar ambiente de produção, fazer deploy na Vercel e documentação final.
              </p>
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  )
}