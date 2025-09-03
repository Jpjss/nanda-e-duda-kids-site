import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products - Listar produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {
      isActive: true
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Buscar produtos
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: {
            where: { isActive: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Calcular informações de paginação
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    })

  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/products - Criar produto (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      image,
      images,
      categoryId,
      isFeatured,
      variants
    } = body

    // Validações básicas
    if (!name || !slug || !price || !image || !categoryId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, slug, price, image, categoryId' },
        { status: 400 }
      )
    }

    // Verificar se o slug já existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Slug já existe' },
        { status: 400 }
      )
    }

    // Criar produto
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        salePrice,
        image,
        categoryId,
        isFeatured: isFeatured || false
      }
    })

    // Criar variações se fornecidas
    if (variants && variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((variant: any) => ({
          ...variant,
          productId: product.id,
          sku: variant.sku || `${slug}-${variant.size}-${variant.color}`.toLowerCase().replace(/\s+/g, '-')
        }))
      })
    }

    // Buscar produto completo para retornar
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: true
      }
    })

    return NextResponse.json(completeProduct, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}