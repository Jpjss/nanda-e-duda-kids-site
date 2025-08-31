"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: number
  name: string
  price: string
  image: string
  alt: string
  category: string
  description: string
  features: string[]
  sizes: string[]
  colors: string[]
  rating: number
  reviews: number
  inStock: boolean
}

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, escolha um tamanho antes de adicionar ao carrinho.",
        variant: "destructive"
      })
      return
    }

    if (!selectedColor) {
      toast({
        title: "Selecione uma cor",
        description: "Por favor, escolha uma cor antes de adicionar ao carrinho.",
        variant: "destructive"
      })
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product, `${selectedSize} - ${selectedColor}`)
    }

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Imagem do Produto */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={product.image}
                  alt={product.alt}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </CardContent>
            </Card>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2 bg-pink-100 text-pink-800">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-purple-700 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>
              <p className="text-4xl font-bold text-pink-800 mb-4">
                {product.price}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seleção de Tamanho */}
            <div>
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                Tamanho:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className={`rounded-full ${
                      selectedSize === size
                        ? 'bg-purple-500 text-white'
                        : 'border-purple-300 text-purple-700 hover:bg-purple-50'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Seleção de Cor */}
            <div>
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                Cor:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    className={`rounded-full ${
                      selectedColor === color
                        ? 'bg-pink-500 text-white'
                        : 'border-pink-300 text-pink-700 hover:bg-pink-50'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantidade */}
            <div>
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                Quantidade:
              </h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-full text-lg font-semibold"
                disabled={!product.inStock}
              >
                {product.inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Favoritar
                </Button>
                <Button variant="outline" className="flex-1 rounded-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Benefícios */}
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-purple-600" />
                  <span>Frete Grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Compra Segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-purple-600" />
                  <span>7 dias para trocar</span>
                </div>
              </div>
            </div>

            {/* Características */}
            <div>
              <h3 className="text-lg font-semibold text-purple-700 mb-3">
                Características:
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}