import { NextRequest, NextResponse } from 'next/server'
import { 
  createPaymentPreference, 
  formatPhoneNumber, 
  formatCPF, 
  convertCartItemToMercadoPago,
  type CreatePreferenceData,
  type CheckoutPayer
} from '@/lib/mercadopago'

// POST /api/payments/create-preference - Criar preferência de pagamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      customerData,
      address,
      orderId
    } = body

    // Validações básicas
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Itens são obrigatórios' },
        { status: 400 }
      )
    }

    if (!customerData || !customerData.name || !customerData.email) {
      return NextResponse.json(
        { error: 'Dados do cliente são obrigatórios' },
        { status: 400 }
      )
    }

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID do pedido é obrigatório' },
        { status: 400 }
      )
    }

    // Converter itens do carrinho para formato Mercado Pago
    const mercadopagoItems = items.map(convertCartItemToMercadoPago)

    // Formatar dados do comprador
    const nameParts = customerData.name.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || firstName

    const phone = formatPhoneNumber(customerData.phone)
    const cpf = customerData.cpf ? formatCPF(customerData.cpf) : undefined

    const payer: CheckoutPayer = {
      name: firstName,
      surname: lastName,
      email: customerData.email,
      phone,
      ...(cpf && {
        identification: {
          type: 'CPF',
          number: cpf
        }
      }),
      ...(address && {
        address: {
          street_name: address.street,
          street_number: address.number,
          zip_code: address.zipCode?.replace(/\D/g, '') || '',
          city: address.city,
          state: address.state
        }
      })
    }

    // URLs de retorno
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const backUrls = {
      success: `${baseUrl}/checkout/success?order=${orderId}`,
      failure: `${baseUrl}/checkout/failure?order=${orderId}`,
      pending: `${baseUrl}/checkout/pending?order=${orderId}`
    }

    // Dados da preferência
    const preferenceData: CreatePreferenceData = {
      items: mercadopagoItems,
      payer,
      external_reference: orderId,
      back_urls: backUrls,
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: 'NANDA&DUDA KIDS',
      payment_methods: {
        installments: 12, // Máximo 12 parcelas
        excluded_payment_types: [], // Aceitar todos os tipos
        excluded_payment_methods: [] // Aceitar todos os métodos
      }
    }

    // Criar preferência no Mercado Pago
    const preference = await createPaymentPreference(preferenceData)

    if (!preference || !preference.id) {
      throw new Error('Falha ao criar preferência de pagamento')
    }

    // Retornar dados necessários para o frontend
    return NextResponse.json({
      preferenceId: preference.id,
      sandboxInitPoint: preference.sandbox_init_point,
      initPoint: preference.init_point,
      publicKey: process.env.MERCADOPAGO_PUBLIC_KEY
    })

  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// GET /api/payments/status/[paymentId] - Consultar status do pagamento
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const paymentId = url.pathname.split('/').pop()

    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID do pagamento é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar informações do pagamento no Mercado Pago
    const { getPaymentInfo } = await import('@/lib/mercadopago')
    const paymentInfo = await getPaymentInfo(paymentId)

    if (!paymentInfo) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      external_reference: paymentInfo.external_reference,
      transaction_amount: paymentInfo.transaction_amount,
      payment_method_id: paymentInfo.payment_method_id,
      payment_type_id: paymentInfo.payment_type_id,
      date_approved: paymentInfo.date_approved,
      date_created: paymentInfo.date_created
    })

  } catch (error) {
    console.error('Erro ao consultar status do pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}