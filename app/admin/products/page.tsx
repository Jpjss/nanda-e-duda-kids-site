"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search,
  Package,
  Eye,
  Image as ImageIcon
} from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  active: boolean
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Super Herói',
    description: 'Camiseta infantil com estampa de super herói',
    price: 29.90,
    category: 'Camisetas',
    image: '/camiseta-super-heroi.png',
    stock: 15,
    active: true
  },
  {
    id: '2',
    name: 'Vestido Verão Encantado',
    description: 'Vestido leve e colorido para o verão',
    price: 45.90,
    category: 'Vestidos',
    image: '/vestido-verao-encantado.png',
    stock: 8,
    active: true
  },
  {
    id: '3',
    name: 'Tênis Colorido Infantil',
    description: 'Tênis confortável e colorido',
    price: 79.90,
    category: 'Calçados',
    image: '/tenis-colorido-infantil.png',
    stock: 12,
    active: true
  }
]

const categories = ['Camisetas', 'Vestidos', 'Calçados', 'Acessórios', 'Conjuntos']

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: categories[0],
    image: '',
    stock: 0,
    active: true
  })

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSave = () => {
    if (editingProduct) {
      // Editar produto existente
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...formData, id: editingProduct.id }
          : p
      ))
    } else {
      // Criar novo produto
      const newProduct: Product = {
        ...formData,
        id: `product_${Date.now()}`
      }
      setProducts([...products, newProduct])
    }
    
    resetForm()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      active: product.active
    })
    setShowForm(true)
  }

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const toggleActive = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, active: !p.active } : p
    ))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: categories[0],
      image: '',
      stock: 0,
      active: true
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Produtos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie o catálogo de produtos da loja
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Produtos</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Produto */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome do produto"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição do produto"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="image">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="/nome-da-imagem.png"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="active">Produto ativo</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className={`${!product.active ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                    ) : null}
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <Badge 
                      className={`mt-1 ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-sm text-gray-600">
                  Estoque: {product.stock}
                </span>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleActive(product.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou adicionar um novo produto.
            </p>
          </CardContent>
        </Card>
      )}

    </div>
  )
}