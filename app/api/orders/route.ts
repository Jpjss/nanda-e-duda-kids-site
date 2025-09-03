import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/orders - Criar novo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      items,
      customerData,
      address,
      paymentMethod,
      userId
    } = body

    // Validações básicas
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrinho não pode estar vazio' },
        { status: 400 }
      )
    }

    if (!customerData || !customerData.name || !customerData.email || !customerData.phone) {
      return NextResponse.json(
        { error: 'Dados do cliente são obrigatórios' },
        { status: 400 }
      )
    }

    if (!address || !address.street || !address.city || !address.state) {
      return NextResponse.json(
        { error: 'Endereço completo é obrigatório' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Método de pagamento é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar produtos para calcular valores
    const productIds = items.map((item: any) => String(item.productId))
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Alguns produtos não foram encontrados' },
        { status: 400 }
      )
    }

    // Calcular valores
    let subtotal = 0
    const orderItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === String(item.productId))
      if (!product) throw new Error('Produto não encontrado')
      
      const price = product.salePrice || product.price
      const itemTotal = Number(price) * item.quantity
      subtotal += itemTotal

      return {
        productId: String(item.productId),
        quantity: item.quantity,
        price: price,
        size: item.size,
        color: item.color
      }
    })

    const shippingCost = 0 // Frete grátis por enquanto
    const total = subtotal + shippingCost

    // Gerar número do pedido
    const orderNumber = `NDP${Date.now().toString().slice(-8)}`

    // Criar ou buscar endereço
    let addressId: string

    if (userId) {
      // Se tem usuário, criar endereço vinculado
      const createdAddress = await prisma.address.create({
        data: {
          ...address,
          userId
        }
      })
      addressId = createdAddress.id
    } else {
      // Guest checkout - criar endereço temporário vinculado a um usuário guest
      const guestUser = await prisma.user.create({
        data: {
          email: customerData.email,
          name: customerData.name,
          phone: customerData.phone,
          cpf: customerData.cpf
        }
      })

      const createdAddress = await prisma.address.create({
        data: {
          ...address,
          userId: guestUser.id
        }
      })
      addressId = createdAddress.id
    }

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal,
        shippingCost,
        total,
        paymentMethod,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        customerCpf: customerData.cpf,
        userId,
        addressId,
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        address: true
      }
    })

    return NextResponse.json(order, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET /api/orders - Listar pedidos (admin ou usuário logado)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          },
          address: true,
          payments: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}