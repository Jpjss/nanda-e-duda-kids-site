"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Eye, 
  Edit,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Mail
} from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD'
  paymentStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: Date
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  trackingCode?: string
}

const mockOrders: Order[] = [
  {
    id: 'order_123456',
    customer: {
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 99999-9999'
    },
    items: [
      {
        id: '1',
        name: 'Camiseta Super Herói',
        price: 29.90,
        quantity: 2,
        image: '/camiseta-super-heroi.png'
      }
    ],
    total: 59.80,
    status: 'CONFIRMED',
    paymentMethod: 'PIX',
    paymentStatus: 'APPROVED',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    shippingAddress: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    }
  },
  {
    id: 'order_123457',
    customer: {
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(11) 88888-8888'
    },
    items: [
      {
        id: '2',
        name: 'Vestido Verão Encantado',
        price: 45.90,
        quantity: 1,
        image: '/vestido-verao-encantado.png'
      }
    ],
    total: 45.90,
    status: 'PENDING',
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PENDING',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    shippingAddress: {
      street: 'Av. Paulista, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01311-000'
    }
  },
  {
    id: 'order_123458',
    customer: {
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 77777-7777'
    },
    items: [
      {
        id: '3',
        name: 'Tênis Colorido Infantil',
        price: 79.90,
        quantity: 1,
        image: '/tenis-colorido-infantil.png'
      },
      {
        id: '1',
        name: 'Camiseta Super Herói',
        price: 29.90,
        quantity: 1,
        image: '/camiseta-super-heroi.png'
      }
    ],
    total: 109.80,
    status: 'SHIPPED',
    paymentMethod: 'PIX',
    paymentStatus: 'APPROVED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    shippingAddress: {
      street: 'Rua do Comércio, 789',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20040-020'
    },
    trackingCode: 'BR123456789BR'
  }
]

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  SHIPPED: Truck,
  DELIVERED: Package,
  CANCELLED: XCircle
}

const statusLabels = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado'
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    
    // Fechar detalhes se o pedido selecionado foi atualizado
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({...selectedOrder, status: newStatus})
    }
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusStats = () => {
    const stats = {
      PENDING: 0,
      CONFIRMED: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0
    }
    
    orders.forEach(order => {
      stats[order.status]++
    })
    
    return stats
  }

  const statusStats = getStatusStats()

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Pedidos</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe e gerencie todos os pedidos da loja
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(statusStats).map(([status, count]) => {
          const StatusIcon = statusIcons[status as keyof typeof statusIcons]
          return (
            <Card key={status}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {statusLabels[status as keyof typeof statusLabels]}
                    </p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <StatusIcon className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filtros */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Pedidos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="ID, nome do cliente ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="all">Todos os status</option>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Pedido Modal */}
      {showOrderDetails && selectedOrder && (
        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Detalhes do Pedido #{selectedOrder.id.slice(-6)}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowOrderDetails(false)}
              >
                Fechar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Informações do Cliente */}
              <div>
                <h3 className="font-semibold mb-4">Informações do Cliente</h3>
                <div className="space-y-2">
                  <p><strong>Nome:</strong> {selectedOrder.customer.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                  <p><strong>Telefone:</strong> {selectedOrder.customer.phone}</p>
                </div>

                <h3 className="font-semibold mt-6 mb-4">Endereço de Entrega</h3>
                <div className="space-y-2">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p>CEP: {selectedOrder.shippingAddress.zipCode}</p>
                </div>
              </div>

              {/* Informações do Pedido */}
              <div>
                <h3 className="font-semibold mb-4">Informações do Pedido</h3>
                <div className="space-y-2">
                  <p><strong>Data:</strong> {formatDate(selectedOrder.createdAt)}</p>
                  <p><strong>Pagamento:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Status Pagamento:</strong> 
                    <Badge className={`ml-2 ${selectedOrder.paymentStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {selectedOrder.paymentStatus === 'APPROVED' ? 'Aprovado' : 'Pendente'}
                    </Badge>
                  </p>
                  {selectedOrder.trackingCode && (
                    <p><strong>Código de Rastreio:</strong> {selectedOrder.trackingCode}</p>
                  )}
                </div>

                <h3 className="font-semibold mt-6 mb-4">Itens do Pedido</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity}x {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Ações */}
            <div className="flex gap-2 mt-6 pt-6 border-t">
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as Order['status'])}
                className="px-3 py-2 border rounded-md bg-white"
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = statusIcons[order.status]
              return (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <StatusIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">#{order.id.slice(-6)}</span>
                        <Badge className={statusColors[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}