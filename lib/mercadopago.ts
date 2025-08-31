import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

if (!accessToken) {
  throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado')
}

// Configurar cliente
export const mercadopago = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
    idempotencyKey: 'DEV'
  }
})

// Instâncias das APIs
export const preferenceApi = new Preference(mercadopago)
export const paymentApi = new Payment(mercadopago)

// Tipos auxiliares
export interface CheckoutItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  picture_url?: string
  description?: string
}

export interface CheckoutPayer {
  name: string
  surname: string
  email: string
  phone?: {
    area_code: string
    number: string
  }
  identification?: {
    type: string
    number: string
  }
  address?: {
    street_name: string
    street_number: string
    zip_code: string
    city: string
    state: string
  }
}

export interface CreatePreferenceData {
  items: CheckoutItem[]
  payer: CheckoutPayer
  external_reference: string
  back_urls: {
    success: string
    failure: string
    pending: string
  }
  auto_return?: 'approved' | 'all'
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>
    excluded_payment_types?: Array<{ id: string }>
    installments?: number
  }
  notification_url?: string
  statement_descriptor?: string
}

// Função para criar preferência de pagamento
export async function createPaymentPreference(data: CreatePreferenceData) {
  try {
    const response = await preferenceApi.create({
      body: {
        ...data,
        statement_descriptor: data.statement_descriptor || 'NANDA&DUDAKIDS'
      }
    })

    return response
  } catch (error) {
    console.error('Erro ao criar preferência:', error)
    throw error
  }
}

// Função para buscar informações de pagamento
export async function getPaymentInfo(paymentId: string) {
  try {
    const response = await paymentApi.get({
      id: paymentId
    })

    return response
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    throw error
  }
}

// Função para processar webhook do Mercado Pago
export async function processWebhookNotification(data: any) {
  try {
    if (data.type === 'payment') {
      const paymentInfo = await getPaymentInfo(data.data.id)
      return paymentInfo
    }
    
    return null
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    throw error
  }
}

// Funções auxiliares para conversão de dados
export function formatPhoneNumber(phone: string) {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Se começa com 55 (código do Brasil), remove
  const withoutCountryCode = cleaned.startsWith('55') ? cleaned.slice(2) : cleaned
  
  // Extrai código de área e número
  if (withoutCountryCode.length >= 10) {
    const areaCode = withoutCountryCode.slice(0, 2)
    const number = withoutCountryCode.slice(2)
    return { area_code: areaCode, number }
  }
  
  return { area_code: '11', number: withoutCountryCode }
}

export function formatCPF(cpf: string) {
  return cpf.replace(/\D/g, '')
}

export function convertCartItemToMercadoPago(item: any): CheckoutItem {
  const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
  
  return {
    id: item.id.toString(),
    title: item.name,
    quantity: item.quantity,
    unit_price: price,
    picture_url: item.image ? `${process.env.NEXT_PUBLIC_APP_URL}${item.image}` : undefined,
    description: `Tamanho: ${item.size || 'Único'} - Cor: ${item.color || 'Padrão'}`
  }
}