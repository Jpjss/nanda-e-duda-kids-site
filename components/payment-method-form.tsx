"use client"

import { useCheckout } from '@/context/checkout-context-v2'
import { useCart } from '@/context/cart-context'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Smartphone, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { toast } from "sonner"

export default function PaymentMethodForm() {
  const { state, setPaymentMethod, setStep, setProcessing, setOrderId } = useCheckout()
  const { state: cartState, clearCart } = useCart()
  
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'credit' | 'debit'>('pix')
  const [isProcessing, setIsProcessingLocal] = useState(false)

  const handleCreateOrder = async () => {
    try {
      setIsProcessingLocal(true)
      setProcessing(true)

      // Preparar dados do pedido
      const orderData = {
        items: cartState.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
          color: 'Padrão' // Por enquanto padrão
        })),
        customerData: state.customerData,
        address: state.address,
        paymentMethod: selectedMethod.toUpperCase()
      }

      // Criar pedido
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Erro ao criar pedido')
      }

      const order = await orderResponse.json()
      setOrderId(order.id)

      // Preparar dados para o Mercado Pago
      const preferenceData = {
        items: cartState.items,
        customerData: state.customerData,
        address: state.address,
        orderId: order.id
      }

      // Criar preferência de pagamento
      const preferenceResponse = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferenceData)
      })

      if (!preferenceResponse.ok) {
        const error = await preferenceResponse.json()
        throw new Error(error.error || 'Erro ao criar preferência de pagamento')
      }

      const preference = await preferenceResponse.json()

      // Redirecionar para o Mercado Pago
      const checkoutUrl = preference.sandboxInitPoint || preference.initPoint
      
      if (checkoutUrl) {
        // Limpar carrinho
        clearCart()
        
        // Redirecionar para o checkout do Mercado Pago
        window.location.href = checkoutUrl
      } else {
        throw new Error('URL de pagamento não encontrada')
      }

    } catch (error) {
      console.error('Erro no checkout:', error)
      toast.error(error instanceof Error ? error.message : 'Erro no checkout')
      setIsProcessingLocal(false)
      setProcessing(false)
    }
  }

  const paymentMethods = [
    {
      id: 'pix' as const,
      name: 'PIX',
      description: 'Pagamento instantâneo',
      icon: <Smartphone className="h-6 w-6" />,
      details: 'Aprovação imediata • Sem taxas'
    },
    {
      id: 'credit' as const,
      name: 'Cartão de Crédito',
      description: 'Parcele em até 12x',
      icon: <CreditCard className="h-6 w-6" />,
      details: 'Visa, Mastercard, Elo • Parcelamento disponível'
    },
    {
      id: 'debit' as const,
      name: 'Cartão de Débito',
      description: 'Débito à vista',
      icon: <CreditCard className="h-6 w-6" />,
      details: 'Visa, Mastercard • Pagamento imediato'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forma de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métodos de Pagamento */}
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => setSelectedMethod(value as typeof selectedMethod)}
          className="space-y-4"
        >
          {paymentMethods.map((method) => (
            <div key={method.id} className="relative">
              <RadioGroupItem
                value={method.id}
                id={method.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={method.id}
                className="flex items-center space-x-4 border-2 border-gray-200 rounded-lg p-4 cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-gray-300"
              >
                <div className="flex-shrink-0 text-blue-600">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{method.name}</h3>
                    <span className="text-sm text-gray-600">{method.description}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{method.details}</p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Separator />

        {/* Informações do PIX */}
        {selectedMethod === 'pix' && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Como funciona o PIX:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Você será redirecionado para finalizar o pagamento</li>
              <li>• Use o QR Code ou código PIX no seu banco</li>
              <li>• Aprovação instantânea após o pagamento</li>
              <li>• Pedido confirmado automaticamente</li>
            </ul>
          </div>
        )}

        {/* Informações do Cartão */}
        {(selectedMethod === 'credit' || selectedMethod === 'debit') && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              {selectedMethod === 'credit' ? 'Cartão de Crédito:' : 'Cartão de Débito:'}
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Você será redirecionado para o checkout seguro</li>
              <li>• Digite os dados do seu cartão com segurança</li>
              {selectedMethod === 'credit' && <li>• Escolha o número de parcelas</li>}
              <li>• Confirmação imediata do pagamento</li>
            </ul>
          </div>
        )}

        {/* Botões */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setStep('customer')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <Button 
            onClick={handleCreateOrder}
            disabled={isProcessing}
            size="lg"
            className="flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processando...
              </>
            ) : (
              'Finalizar Pedido'
            )}
          </Button>
        </div>

        {/* Selo de Segurança */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Pagamento 100% seguro via Mercado Pago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}