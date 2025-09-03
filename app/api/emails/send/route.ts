import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail, sendStatusUpdateEmail, sendPixPendingEmail } from '@/lib/email'

// POST /api/emails/send - Enviar emails
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, orderData, ...extraData } = body

    if (!type || !orderData) {
      return NextResponse.json(
        { error: 'Tipo de email e dados do pedido são obrigatórios' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'order_confirmation':
        result = await sendOrderConfirmationEmail(orderData)
        break

      case 'status_update':
        const { oldStatus, newStatus } = extraData
        if (!oldStatus || !newStatus) {
          return NextResponse.json(
            { error: 'Status anterior e novo são obrigatórios para atualização' },
            { status: 400 }
          )
        }
        result = await sendStatusUpdateEmail(orderData, oldStatus, newStatus)
        break

      case 'pix_pending':
        const { pixData } = extraData
        result = await sendPixPendingEmail(orderData, pixData || {})
        break

      default:
        return NextResponse.json(
          { error: 'Tipo de email não suportado' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        message: 'Email enviado com sucesso',
        data: result.data
      })
    } else {
      return NextResponse.json(
        { error: 'Falha ao enviar email', details: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erro na API de email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/emails/send - Verificar status do serviço
export async function GET() {
  return NextResponse.json({
    service: 'Email Service',
    status: 'operational',
    provider: 'Resend',
    timestamp: new Date().toISOString()
  })
}