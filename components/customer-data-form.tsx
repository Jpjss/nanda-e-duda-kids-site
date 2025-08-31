"use client"

import { useCheckout } from '@/context/checkout-context-v2'
import { useCart } from '@/context/cart-context'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from "sonner"

export default function CustomerDataForm() {
  const { state, setCustomerData, setAddress, setStep } = useCheckout()
  
  const [formData, setFormData] = useState({
    // Dados pessoais
    name: state.customerData.name,
    email: state.customerData.email,
    phone: state.customerData.phone,
    cpf: state.customerData.cpf,
    
    // Endereço
    zipCode: state.address.zipCode,
    street: state.address.street,
    number: state.address.number,
    complement: state.address.complement,
    neighborhood: state.address.neighborhood,
    city: state.address.city,
    state: state.address.state
  })

  const [isLoadingCep, setIsLoadingCep] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const searchCEP = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) return

    setIsLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }))
        toast.success('CEP encontrado!')
      } else {
        toast.error('CEP não encontrado')
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP')
    } finally {
      setIsLoadingCep(false)
    }
  }

  const handleSubmit = () => {
    // Validar campos obrigatórios
    const requiredFields = ['name', 'email', 'phone', 'zipCode', 'street', 'number', 'neighborhood', 'city', 'state']
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido')
      return
    }

    // Salvar dados nos contextos
    setCustomerData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cpf: formData.cpf
    })

    setAddress({
      zipCode: formData.zipCode,
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state
    })

    // Ir para próximo passo
    setStep('payment')
    toast.success('Dados salvos! Escolha a forma de pagamento.')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados para Entrega</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Dados Pessoais</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF (opcional)</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Endereço de Entrega</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => {
                  const formatted = formatZipCode(e.target.value)
                  handleInputChange('zipCode', formatted)
                  if (formatted.replace(/\D/g, '').length === 8) {
                    searchCEP(formatted)
                  }
                }}
                placeholder="00000-000"
                maxLength={9}
                disabled={isLoadingCep}
              />
              {isLoadingCep && <p className="text-sm text-gray-500 mt-1">Buscando CEP...</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="street">Logradouro *</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="Rua, Avenida..."
              />
            </div>

            <div>
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                placeholder="123"
              />
            </div>

            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={formData.complement}
                onChange={(e) => handleInputChange('complement', e.target.value)}
                placeholder="Apto, Bloco..."
              />
            </div>

            <div>
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                placeholder="Centro"
              />
            </div>

            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="São Paulo"
              />
            </div>

            <div>
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                placeholder="SP"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        {/* Botão de continuar */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="w-full md:w-auto"
          >
            Continuar para Pagamento
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}