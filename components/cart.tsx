"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/context/cart-context'

export default function CartComponent() {
  const { state, updateQuantity, removeFromCart, clearCart, toggleCart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const formatPrice = (price: string) => {
    return parseFloat(price.replace('R$ ', '').replace(',', '.'))
  }

  const totalPrice = state.items.reduce((total, item) => {
    return total + (formatPrice(item.price) * item.quantity)
  }, 0)

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsOpen(false) // Fechar o carrinho
    router.push('/checkout') // Navegar para o checkout
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex flex-col items-center text-xs hover:text-purple-700 transition-colors"
        >
          <ShoppingBag className="h-6 w-6" />
          {state.items.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center p-0"
            >
              {state.items.reduce((count, item) => count + item.quantity, 0)}
            </Badge>
          )}
          Meu carrinho
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-purple-700">
            <ShoppingBag className="h-5 w-5" />
            Meu Carrinho ({state.items.reduce((count, item) => count + item.quantity, 0)} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-gray-500 mb-4">
                Adicione alguns produtos incríveis da nossa coleção!
              </p>
            </div>
          ) : (
            <>
              {/* Lista de Itens */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {state.items.map((item) => (
                  <Card key={`${item.id}-${item.size}`} className="relative">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Imagem do Produto */}
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.alt}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        {/* Informações do Produto */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-purple-700 mb-1 truncate">
                            {item.name}
                          </h4>
                          
                          {item.size && (
                            <p className="text-xs text-gray-600 mb-1">
                              Tamanho: {item.size}
                            </p>
                          )}
                          
                          <p className="font-bold text-pink-800">
                            {item.price}
                          </p>

                          {/* Controles de Quantidade */}
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Botão Remover */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 w-6 h-6 p-0 text-gray-400 hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Resumo e Ações */}
              <div className="space-y-4 py-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-purple-700">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-pink-800">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-pink-500 text-pink-800 hover:bg-pink-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Continuar Comprando
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-red-600"
                    onClick={clearCart}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}