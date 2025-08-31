"use client"

import { useState } from 'react'
import { useCart } from '@/context/cart-context'
import { useCheckout } from '@/context/checkout-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Button from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Lock, Shield } from 'lucide-react'

interface CardPaymentProps {
  type: 'credit' | 'debit'
  onContinue: () => void
}

export default function CardPayment({ type, onContinue }: CardPaymentProps) {
  const { state: cartState } = useCart()
  const { setCardData, setOrderId, setProcessing, setPaymentMethod } = useCheckout()
  const { toast } = useToast()

  const [cardForm, setCardForm] = useState({
    number: '',
    holderName: '',
    expiryDate: '',
    cvv: '',
    installments: 1
  })

  const [isProcessing, setIsProcessingLocal] = useState(false)

  const totalPrice = cartState.items.reduce((total, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
    return total + (price * item.quantity)
  }, 0)

  const handleInputChange = (field: string, value: string) => {
    setCardForm(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ')
    return formatted.substring(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4)
    }
    return numbers
  }

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 4)
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    handleInputChange('number', formatted)
  }

  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value)
    handleInputChange('expiryDate', formatted)
  }

  const handleCVVChange = (value: string) => {
    const formatted = formatCVV(value)
    handleInputChange('cvv', formatted)
  }

  const validateCard = () => {
    if (!cardForm.number.replace(/\s/g, '') || cardForm.number.replace(/\s/g, '').length < 16) {
      toast({
        title: "Número do cartão inválido",
        description: "Por favor, insira um número de cartão válido.",
        variant: "destructive"
      })
      return false
    }

    if (!cardForm.holderName.trim()) {
      toast({
        title: "Nome do portador obrigatório",
        description: "Por favor, insira o nome do portador do cartão.",
        variant: "destructive"
      })
      return false
    }

    if (!cardForm.expiryDate || cardForm.expiryDate.length < 5) {
      toast({
        title: "Data de validade inválida",
        description: "Por favor, insira uma data de validade válida (MM/AA).",
        variant: "destructive"
      })
      return false
    }

    if (!cardForm.cvv || cardForm.cvv.length < 3) {
      toast({
        title: "CVV inválido",
        description: "Por favor, insira um CVV válido.",
        variant: "destructive"
      })
      return false
    }

    // Validação simples de data de validade
    const [month, year] = cardForm.expiryDate.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (parseInt(month) < 1 || parseInt(month) > 12) {
      toast({
        title: "Mês inválido",
        description: "Por favor, insira um mês válido (01-12).",
        variant: "destructive"
      })
      return false
    }

    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      toast({
        title: "Cartão vencido",
        description: "Por favor, use um cartão válido.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateCard()) return

    setIsProcessingLocal(true)
    setProcessing(true)

    // Salvar dados do cartão no contexto
    setCardData({
      number: cardForm.number,
      holderName: cardForm.holderName,
      expiryDate: cardForm.expiryDate,
      cvv: cardForm.cvv
    })

    // Atualizar método de pagamento com parcelas
    setPaymentMethod({ 
      type, 
      installments: type === 'credit' ? cardForm.installments : undefined 
    })

    // Simular processamento do pagamento
    setTimeout(() => {
      const orderId = `NDK-${Date.now()}`
      setOrderId(orderId)
      setIsProcessingLocal(false)
      setProcessing(false)

      toast({
        title: "Pagamento aprovado!",
        description: "Seu pedido foi processado com sucesso."
      })

      setTimeout(() => {
        onContinue()
      }, 1500)
    }, 3000)
  }

  const getInstallmentValue = (installments: number) => {
    return (totalPrice / installments).toFixed(2).replace('.', ',')
  }

  const getCardBrand = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '')
    if (cleanNumber.startsWith('4')) return 'Visa'
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'Mastercard'
    if (cleanNumber.startsWith('3')) return 'American Express'
    if (cleanNumber.startsWith('6')) return 'Elo'
    return ''
  }

  if (isProcessing) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-purple-700 mb-2">
            Processando pagamento...
          </h3>
          <p className="text-gray-600">
            Aguarde enquanto confirmamos sua transação
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações do Cartão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <CreditCard className="w-5 h-5" />
            {type === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Número do Cartão */}
          <div>
            <Label htmlFor="cardNumber">Número do Cartão *</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                type="text"
                value={cardForm.number}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="0000 0000 0000 0000"
                className="mt-1 pr-16"
                maxLength={19}
              />
              {getCardBrand(cardForm.number) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium text-gray-600">
                  {getCardBrand(cardForm.number)}
                </div>
              )}
            </div>
          </div>

          {/* Nome do Portador */}
          <div>
            <Label htmlFor="holderName">Nome do Portador *</Label>
            <Input
              id="holderName"
              type="text"
              value={cardForm.holderName}
              onChange={(e) => handleInputChange('holderName', e.target.value.toUpperCase())}
              placeholder="NOME COMO ESTÁ NO CARTÃO"
              className="mt-1"
            />
          </div>

          {/* Data de Validade e CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Validade *</Label>
              <Input
                id="expiryDate"
                type="text"
                value={cardForm.expiryDate}
                onChange={(e) => handleExpiryDateChange(e.target.value)}
                placeholder="MM/AA"
                className="mt-1"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                type="password"
                value={cardForm.cvv}
                onChange={(e) => handleCVVChange(e.target.value)}
                placeholder="000"
                className="mt-1"
                maxLength={4}
              />
            </div>
          </div>

          {/* Parcelamento (apenas para crédito) */}
          {type === 'credit' && (
            <div>
              <Label htmlFor="installments">Parcelamento</Label>
              <Select 
                value={cardForm.installments.toString()} 
                onValueChange={(value) => handleInputChange('installments', parseInt(value).toString())}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o parcelamento" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}x de R$ {getInstallmentValue(num)} 
                      {num === 1 ? ' à vista' : ' sem juros'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo do Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-700">Resumo do Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            {type === 'credit' && cardForm.installments > 1 && (
              <div className="flex justify-between text-purple-700 font-medium">
                <span>Parcelamento:</span>
                <span>
                  {cardForm.installments}x de R$ {getInstallmentValue(cardForm.installments)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Shield className="w-4 h-4" />
            <Lock className="w-4 h-4" />
            <span>Seus dados estão protegidos com criptografia SSL</span>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Finalizar */}
      <Button
        type="submit"
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 text-lg font-semibold"
        disabled={isProcessing}
      >
        {isProcessing ? 'Processando...' : `Finalizar Pagamento - R$ ${totalPrice.toFixed(2).replace('.', ',')}`}
      </Button>
    </form>
  )
}