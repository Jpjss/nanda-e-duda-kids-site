"use client"

import { useCart } from '@/context/cart-context'
import { useCheckout } from '@/context/checkout-context-v2'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, ShoppingBag, CreditCard, Smartphone, Check } from 'lucide-react'
import CustomerDataForm from '@/components/customer-data-form'
import PaymentMethodForm from '@/components/payment-method-form'

export default function CheckoutPage() {
  const { state: cartState } = useCart()
  const { state, setStep, calculateTotal } = useCheckout()
  const router = useRouter()

  const items = cartState.items

  // Se não há itens no carrinho, redireciona
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-8 pb-6">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Carrinho vazio</h2>
            <p className="text-gray-600 mb-4">
              Adicione alguns produtos ao seu carrinho para continuar.
            </p>
            <Button onClick={() => router.push('/')}>
              Voltar às compras
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const total = calculateTotal(items)

  const handleBackToCart = () => {
    router.push('/')
  }

  const getStepIcon = (stepName: string) => {
    const currentStepIndex = ['customer', 'payment', 'confirmation'].indexOf(state.step)
    const stepIndex = ['customer', 'payment', 'confirmation'].indexOf(stepName)

    if (stepIndex < currentStepIndex) {
      return <Check className="h-4 w-4 text-green-600" />
    }
    
    if (stepIndex === currentStepIndex) {
      return <div className="h-4 w-4 bg-blue-600 rounded-full" />
    }

    return <div className="h-4 w-4 bg-gray-300 rounded-full" />
  }

  const renderStepContent = () => {
    switch (state.step) {
      case 'customer':
        return <CustomerDataForm />
      
      case 'payment':
        return <PaymentMethodForm />
      
      case 'confirmation':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pedido Confirmado!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Seu pedido foi processado com sucesso.
              </p>
              <Button onClick={() => router.push('/')}>
                Continuar Comprando
              </Button>
            </CardContent>
          </Card>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          onClick={handleBackToCart}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Finalizar Compra</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            {getStepIcon('customer')}
            <span className={`text-sm ${state.step === 'customer' ? 'font-semibold text-blue-600' : ''}`}>
              Dados
            </span>
          </div>
          
          <div className="h-px bg-gray-300 w-16" />
          
          <div className="flex items-center gap-2">
            {getStepIcon('payment')}
            <span className={`text-sm ${state.step === 'payment' ? 'font-semibold text-blue-600' : ''}`}>
              Pagamento
            </span>
          </div>
          
          <div className="h-px bg-gray-300 w-16" />
          
          <div className="flex items-center gap-2">
            {getStepIcon('confirmation')}
            <span className={`text-sm ${state.step === 'confirmation' ? 'font-semibold text-blue-600' : ''}`}>
              Confirmação
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2">
          {renderStepContent()}
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Itens */}
              <div className="space-y-3">
                {items.map((item: any) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Tamanho: {item.size || 'Único'}</div>
                        <div>Qtd: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totais */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span className="text-green-600">Grátis</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Badges de Segurança */}
              <div className="pt-4 space-y-2">
                <Badge variant="outline" className="w-full justify-center py-2">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pagamento Seguro
                </Badge>
                <Badge variant="outline" className="w-full justify-center py-2">
                  <Smartphone className="h-4 w-4 mr-2" />
                  PIX Instantâneo
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}