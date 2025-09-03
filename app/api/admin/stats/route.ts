import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const stats = await prisma.$transaction(async (tx) => {
      const totalProducts = await tx.product.count()
      const totalOrders = await tx.order.count()
      const totalUsers = await tx.user.count()
      
      const totalRevenue = await tx.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          status: {
            in: ['CONFIRMED', 'SHIPPED', 'DELIVERED']
          }
        }
      })

      const ordersByStatus = await tx.order.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      })

      const statusCounts = ordersByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count.id
        return acc
      }, {} as Record<string, number>)

      return {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders: statusCounts.PENDING || 0,
        confirmedOrders: statusCounts.CONFIRMED || 0,
        shippedOrders: statusCounts.SHIPPED || 0,
        deliveredOrders: statusCounts.DELIVERED || 0,
        cancelledOrders: statusCounts.CANCELLED || 0
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  )
}