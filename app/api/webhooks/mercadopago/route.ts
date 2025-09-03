import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { processWebhookNotification } from '@/lib/mercadopago'

// POST /api/webhooks/mercadopago - Receber notificações do Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook recebido:', JSON.stringify(body, null, 2))

    // Verificar se é uma notificação de pagamento
    if (body.type === 'payment' && body.data && body.data.id) {
      const paymentId = body.data.id.toString()
      
      // Buscar informações completas do pagamento
      const paymentInfo = await processWebhookNotification(body)
      
      if (!paymentInfo) {
        console.log('Informações de pagamento não encontradas')
        return NextResponse.json({ received: true })
      }

      // Buscar pedido pelo external_reference
      const orderId = paymentInfo.external_reference
      if (!orderId) {
        console.log('External reference não encontrada')
        return NextResponse.json({ received: true })
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payments: true }
      })

      if (!order) {
        console.log(`Pedido ${orderId} não encontrado`)
        return NextResponse.json({ received: true })
      }

      // Mapear status do Mercado Pago para nosso sistema
      const mapPaymentStatus = (mpStatus: string) => {
        switch (mpStatus) {
          case 'approved':
            return 'APPROVED'
          case 'pending':
            return 'PENDING'
          case 'rejected':
          case 'cancelled':
            return 'REJECTED'
          case 'refunded':
            return 'REFUNDED'
          default:
            return 'PENDING'
        }
      }

      const mapOrderStatus = (mpStatus: string) => {
        switch (mpStatus) {
          case 'approved':
            return 'CONFIRMED'
          case 'pending':
            return 'PENDING'
          case 'rejected':
          case 'cancelled':
            return 'CANCELLED'
          case 'refunded':
            return 'REFUNDED'
          default:
            return 'PENDING'
        }
      }

      // Mapear método de pagamento
      const mapPaymentMethod = (methodId: string) => {
        if (methodId === 'pix') return 'PIX'
        if (methodId.includes('visa') || methodId.includes('master') || methodId.includes('elo')) {
          return 'CREDIT_CARD'
        }
        return 'CREDIT_CARD'
      }

      const paymentStatus = mapPaymentStatus(paymentInfo.status || 'pending')
      const orderStatus = mapOrderStatus(paymentInfo.status || 'pending')
      const paymentMethod = mapPaymentMethod(paymentInfo.payment_method_id || '')

      // Verificar se já existe um pagamento com este external_id
      const existingPayment = await prisma.payment.findUnique({
        where: { externalId: paymentId }
      })

      if (existingPayment) {
        // Atualizar pagamento existente
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            status: paymentStatus,
            ...(paymentStatus === 'APPROVED' && { approvedAt: new Date() }),
            ...(paymentStatus === 'REJECTED' && { 
              failedAt: new Date(),
              failureReason: paymentInfo.status_detail 
            })
          }
        })
      } else {
        // Criar novo pagamento
        await prisma.payment.create({
          data: {
            orderId: order.id,
            externalId: paymentId,
            status: paymentStatus,
            method: paymentMethod,
            amount: paymentInfo.transaction_amount || 0,
            installments: paymentInfo.installments || 1,
            ...(paymentInfo.payment_method_id === 'pix' && {
              pixQrCode: paymentInfo.point_of_interaction?.transaction_data?.qr_code,
              pixCopyPaste: paymentInfo.point_of_interaction?.transaction_data?.qr_code_base64
            }),
            ...(paymentStatus === 'APPROVED' && { approvedAt: new Date() }),
            ...(paymentStatus === 'REJECTED' && { 
              failedAt: new Date(),
              failureReason: paymentInfo.status_detail 
            })
          }
        })
      }

      // Atualizar status do pedido
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: orderStatus,
          paymentStatus: paymentStatus
        }
      })

      console.log(`Pedido ${orderId} atualizado para status: ${orderStatus}`)

      // Enviar email de confirmação se aprovado
      if (paymentStatus === 'APPROVED') {
        console.log(`Pagamento aprovado para pedido ${orderId}`)
        
        try {
          // Buscar dados completos do pedido para email
          const orderWithItems = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
              items: {
                include: {
                  product: true
                }
              },
              address: true
            }
          })

          if (orderWithItems) {
            // Preparar dados para o email
            const emailData = {
              id: orderWithItems.id,
              customerName: orderWithItems.customerName,
              customerEmail: orderWithItems.customerEmail,
              total: orderWithItems.total,
              paymentMethod: orderWithItems.paymentMethod,
              shippingStreet: orderWithItems.address.street,
              shippingNeighborhood: orderWithItems.address.neighborhood,
              shippingCity: orderWithItems.address.city,
              shippingState: orderWithItems.address.state,
              shippingZipCode: orderWithItems.address.zipCode,
              items: orderWithItems.items.map(item => ({
                name: item.product.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.product.image
              }))
            }

            // Enviar email de confirmação
            const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/emails/send`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                type: 'order_confirmation',
                orderData: emailData
              })
            })

            if (emailResponse.ok) {
              console.log(`Email de confirmação enviado para ${orderWithItems.customerEmail}`)
            } else {
              console.error('Erro ao enviar email de confirmação')
            }
          }
        } catch (emailError) {
          console.error('Erro ao processar email de confirmação:', emailError)
        }
      }

    } else {
      console.log('Tipo de notificação não suportado:', body.type)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/webhooks/mercadopago - Endpoint para testes
export async function GET() {
  return NextResponse.json({
    message: 'Webhook do Mercado Pago funcionando',
    timestamp: new Date().toISOString()
  })
}