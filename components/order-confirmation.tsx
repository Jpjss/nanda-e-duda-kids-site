"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/cart-context'
import { useCheckout } from '@/context/checkout-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Home,
  Download,
  Share2
} from 'lucide-react'

export default function OrderConfirmation() {
  const router = useRouter()
  const { state: cartState, clearCart } = useCart()
  const { state: checkoutState, resetCheckout } = useCheckout()
  const { toast } = useToast()

  const totalPrice = cartState.items.reduce((total, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
    return total + (price * item.quantity)
  }, 0)

  const finalPrice = checkoutState.paymentMethod?.type === 'pix' 
    ? totalPrice * 0.95 
    : totalPrice

  useEffect(() => {
    // Simular envio de e-mail de confirmação
    setTimeout(() => {
      toast({
        title: "E-mail de confirmação enviado!",
        description: `Enviamos os detalhes do pedido para ${checkoutState.customerData.email}`
      })
    }, 2000)
  }, [checkoutState.customerData.email, toast])

  const handleBackToHome = () => {
    clearCart()
    resetCheckout()
    router.push('/')
  }

  const handleShareOrder = async () => {
    const orderText = `🎉 Acabei de fazer um pedido na Nanda e Duda Kids!\n\nPedido: ${checkoutState.orderId}\nItens: ${cartState.items.length}\nTotal: R$ ${finalPrice.toFixed(2).replace('.', ',')}\n\n🛍️ Confira também: ${window.location.origin}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu pedido na Nanda e Duda Kids',
          text: orderText,
          url: window.location.origin
        })
      } catch (err) {
        // Fallback para copiar texto
        navigator.clipboard.writeText(orderText)
        toast({
          title: "Texto copiado!",
          description: "As informações do pedido foram copiadas para compartilhar."
        })
      }
    } else {
      navigator.clipboard.writeText(orderText)
      toast({
        title: "Texto copiado!",
        description: "As informações do pedido foram copiadas para compartilhar."
      })
    }
  }

  const getPaymentMethodText = () => {
    if (!checkoutState.paymentMethod) return ''
    
    switch (checkoutState.paymentMethod.type) {
      case 'pix':
        return 'PIX'
      case 'credit':
        return `Cartão de Crédito${checkoutState.paymentMethod.installments ? ` (${checkoutState.paymentMethod.installments}x)` : ''}`
      case 'debit':
        return 'Cartão de Débito'
      default:
        return ''
    }
  }

  const getPaymentIcon = () => {
    if (!checkoutState.paymentMethod) return <CreditCard className="w-4 h-4" />
    
    switch (checkoutState.paymentMethod.type) {
      case 'pix':
        return <Smartphone className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Confirmação Principal */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Pedido Confirmado!
          </h2>
          <p className="text-green-600 mb-4">
            Obrigada por escolher a Nanda e Duda Kids!
          </p>
          <Badge variant="outline" className="bg-white border-green-300 text-green-700 text-lg px-4 py-2">
            Pedido #{checkoutState.orderId}
          </Badge>
        </CardContent>
      </Card>

      {/* Detalhes do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Package className="w-5 h-5" />
            Detalhes do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lista de Produtos */}
          <div className="space-y-3">
            {cartState.items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-purple-700">{item.name}</p>
                  {item.size && (
                    <p className="text-sm text-gray-600">{item.size}</p>
                  )}
                  <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                </div>
                <p className="font-bold text-pink-800">{item.price}</p>
              </div>
            ))}
          </div>

          <Separator />

          {/* Resumo Financeiro */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            {checkoutState.paymentMethod?.type === 'pix' && (
              <div className="flex justify-between text-green-600">
                <span>Desconto PIX (5%):</span>
                <span>- R$ {(totalPrice * 0.05).toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Frete:</span>
              <span className="text-green-600 font-medium">Grátis</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total Pago:</span>
              <span className="text-purple-700">R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <MapPin className="w-5 h-5" />
            Endereço de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{checkoutState.customerData.name}</p>
            <p className="text-sm text-gray-600">
              {checkoutState.address.street}, {checkoutState.address.number}
              {checkoutState.address.complement && `, ${checkoutState.address.complement}`}
            </p>
            <p className="text-sm text-gray-600">
              {checkoutState.address.neighborhood}, {checkoutState.address.city} - {checkoutState.address.state}
            </p>
            <p className="text-sm text-gray-600">CEP: {checkoutState.address.zipCode}</p>
            <p className="text-sm text-gray-600 mt-2">
              📱 {checkoutState.customerData.phone}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Método de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            {getPaymentIcon()}
            Método de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium">{getPaymentMethodText()}</p>
            {checkoutState.paymentMethod?.type === 'pix' && (
              <p className="text-sm text-green-600">✓ Pagamento confirmado via PIX</p>
            )}
            {(checkoutState.paymentMethod?.type === 'credit' || checkoutState.paymentMethod?.type === 'debit') && checkoutState.cardData && (
              <p className="text-sm text-gray-600">
                Cartão final {checkoutState.cardData.number.slice(-4)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Próximos Passos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-purple-100">
                1
              </Badge>
              <div>
                <p className="font-medium">Confirmação por e-mail</p>
                <p className="text-gray-600">Você receberá um e-mail com todos os detalhes do pedido</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-purple-100">
                2
              </Badge>
              <div>
                <p className="font-medium">Preparação do pedido</p>
                <p className="text-gray-600">Separamos e embalamos seus produtos com muito carinho</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-purple-100">
                3
              </Badge>
              <div>
                <p className="font-medium">Envio e entrega</p>
                <p className="text-gray-600">Você receberá o código de rastreamento em até 2 dias úteis</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleBackToHome}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Home className="w-4 h-4 mr-2" />
          Voltar ao Início
        </Button>
        
        <Button
          onClick={handleShareOrder}
          variant="outline"
          className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartilhar
        </Button>
      </div>

      {/* Contato */}
      <Card className="bg-pink-50 border-pink-200">
        <CardContent className="text-center py-6">
          <h3 className="font-bold text-purple-700 mb-2">Alguma dúvida?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Nossa equipe está pronta para te ajudar!
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-700"
              onClick={() => window.open('https://api.whatsapp.com/send?phone=5562985153410', '_blank')}
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-700"
              onClick={() => window.open('https://www.instagram.com/nandadudakids', '_blank')}
            >
              Instagram
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}