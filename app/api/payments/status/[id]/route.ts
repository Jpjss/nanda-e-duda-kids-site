import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ id: string }>
}

// GET /api/payments/status/[id] - Consultar status do pagamento
export async function GET(
  request: NextRequest,
  context: PageProps
) {
  try {
    const { id } = await context.params

    // Buscar pagamento no banco local
    const payment = await prisma.payment.findUnique({
      where: { externalId: id },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Pagamento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: payment.id,
      externalId: payment.externalId,
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      installments: payment.installments,
      pixQrCode: payment.pixQrCode,
      pixCopyPaste: payment.pixCopyPaste,
      approvedAt: payment.approvedAt,
      failedAt: payment.failedAt,
      failureReason: payment.failureReason,
      order: {
        id: payment.order.id,
        orderNumber: payment.order.orderNumber,
        status: payment.order.status,
        total: payment.order.total,
        customerName: payment.order.customerName,
        customerEmail: payment.order.customerEmail
      }
    })

  } catch (error) {
    console.error('Erro ao consultar status do pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}