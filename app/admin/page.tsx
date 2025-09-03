"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Button from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Mail, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Calendar,
  DollarSign
} from 'lucide-react'

// Dados mockados para desenvolvimento
const mockStats = {
  totalProducts: 9,
  totalOrders: 23,
  totalCustomers: 156,
  totalRevenue: 5678.90,
  pendingOrders: 5,
  completedOrders: 18,
  emailsSent: 45,
  conversionRate: 3.2
}

const mockRecentOrders = [
  {
    id: 'order_123',
    customer: 'Maria Silva',
    total: 89.90,
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    items: 2
  },
  {
    id: 'order_124',
    customer: 'João Santos',
    total: 45.50,
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    items: 1
  },
  {
    id: 'order_125',
    customer: 'Ana Costa',
    total: 129.80,
    status: 'SHIPPED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    items: 3
  },
  {
    id: 'order_126',
    customer: 'Pedro Lima',
    total: 67.40,
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    items: 2
  }
]

const mockTopProducts = [
  { name: 'Camiseta Super Herói', sales: 23, revenue: 667.70 },
  { name: 'Vestido Verão Encantado', sales: 18, revenue: 826.20 },
  { name: 'Tênis Colorido Infantil', sales: 12, revenue: 958.80 },
  { name: 'Laço de Cabelo Encantado', sales: 31, revenue: 492.90 }
]

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(mockStats)
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders)

  const refreshData = async () => {
    setLoading(true)
    // Simular carregamento de dados
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'SHIPPED': return 'bg-blue-100 text-blue-800'
      case 'DELIVERED': return 'bg-purple-100 text-purple-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60)),
      'hour'
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-1">
            Visão geral da Nanda e Duda Kids
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +2 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +19 novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +8% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full lg:w-[400px] grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Pedidos Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Pedidos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">#{order.id.slice(-6)}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-gray-500">{order.items} item(s)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Produtos Mais Vendidos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Produtos Mais Vendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} vendas</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Métricas Adicionais */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pendentes</p>
                    <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completos</p>
                    <p className="text-2xl font-bold">{stats.completedOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Emails</p>
                    <p className="text-2xl font-bold">{stats.emailsSent}</p>
                  </div>
                  <Mail className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Taxa Conv.</p>
                    <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pedidos */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Interface de gestão de pedidos será implementada aqui.
              </p>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Todos
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Atualizar Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Produtos */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Interface de gestão de produtos será implementada aqui.
              </p>
              <div className="flex gap-2">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Produto
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}