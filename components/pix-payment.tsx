"use client"

import { useState, useEffect } from 'react'
import { useCart } from '@/context/cart-context'
import { useCheckout } from '@/context/checkout-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Copy, CheckCircle, Clock, QrCode } from 'lucide-react'

interface PixPaymentProps {
  onContinue: () => void
}

export default function PixPayment({ onContinue }: PixPaymentProps) {
  const { state: cartState } = useCart()
  const { setOrderId, setProcessing } = useCheckout()
  const { toast } = useToast()
  
  const [pixCode, setPixCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'confirmed'>('pending')
  const [timeLeft, setTimeLeft] = useState(900) // 15 minutos em segundos

  const totalPrice = cartState.items.reduce((total, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
    return total + (price * item.quantity)
  }, 0)

  const discountedPrice = totalPrice * 0.95 // 5% de desconto

  useEffect(() => {
    generatePixCode()
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, paymentStatus])

  const generatePixCode = async () => {
    setIsGenerating(true)
    
    // Simular geração do código PIX (em produção, isso seria uma chamada para API)
    setTimeout(() => {
      const mockPixCode = `00020126580014br.gov.bcb.pix0136${Date.now()}-${Math.random().toString(36).substr(2, 9)}520400005303986540${discountedPrice.toFixed(2)}5802BR5925NANDA E DUDA KIDS STORE6009SAO PAULO61080540900062070503***6304${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      setPixCode(mockPixCode)
      setIsGenerating(false)
    }, 2000)
  }

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para sua área de transferência."
      })
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  const simulatePayment = () => {
    setPaymentStatus('processing')
    setProcessing(true)
    
    // Simular verificação de pagamento
    setTimeout(() => {
      const orderId = `NDK-${Date.now()}`
      setOrderId(orderId)
      setPaymentStatus('confirmed')
      setProcessing(false)
      
      toast({
        title: "Pagamento confirmado!",
        description: "Seu pedido foi processado com sucesso."
      })
      
      setTimeout(() => {
        onContinue()
      }, 1500)
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (paymentStatus === 'confirmed') {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-600 mb-2">
            Pagamento Confirmado!
          </h3>
          <p className="text-gray-600">
            Seu pedido foi processado com sucesso.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Informações do PIX */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <QrCode className="w-5 h-5" />
            Pagamento via PIX
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Valor original:</span>
              <span className="text-gray-500 line-through">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Desconto PIX (5%):</span>
              <span className="text-green-600 font-medium">
                - R$ {(totalPrice * 0.05).toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-lg font-bold">Total a pagar:</span>
              <span className="text-xl font-bold text-green-600">
                R$ {discountedPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Código expira em: <strong>{formatTime(timeLeft)}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* QR Code e Código PIX */}
      <Card>
        <CardContent className="py-6">
          {isGenerating ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Gerando código PIX...</p>
            </div>
          ) : (
            <>
              {/* QR Code Placeholder */}
              <div className="text-center mb-6">
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 mx-auto max-w-xs">
                  <QrCode className="w-24 h-24 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Escaneie o QR Code com seu banco
                  </p>
                </div>
              </div>

              {/* Código PIX */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Ou copie e cole o código PIX:
                  </p>
                  <div className="bg-gray-50 border rounded-lg p-3 text-xs font-mono break-all">
                    {pixCode}
                  </div>
                </div>

                <Button
                  onClick={copyPixCode}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Código PIX
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Instruções */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700 text-lg">
            Como pagar com PIX:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            <li className="flex gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                1
              </Badge>
              <span>Abra o app do seu banco ou carteira digital</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                2
              </Badge>
              <span>Escolha a opção PIX e escaneie o QR Code ou cole o código</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                3
              </Badge>
              <span>Confirme o pagamento em seu app</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                4
              </Badge>
              <span>O pagamento será confirmado automaticamente</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Status do Pagamento */}
      {paymentStatus === 'processing' && (
        <Card>
          <CardContent className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-purple-700 font-medium">Verificando pagamento...</p>
            <p className="text-sm text-gray-600">Aguarde a confirmação</p>
          </CardContent>
        </Card>
      )}

      {/* Botão para simular pagamento (apenas para demo) */}
      {paymentStatus === 'pending' && !isGenerating && (
        <div className="text-center">
          <Button
            onClick={simulatePayment}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            🎯 Simular Pagamento (Demo)
          </Button>
        </div>
      )}
    </div>
  )
}