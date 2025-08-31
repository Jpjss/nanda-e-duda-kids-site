import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ id: string }>
}

// GET /api/products/[id] - Buscar produto por ID
export async function GET(
  request: NextRequest,
  context: PageProps
) {
  try {
    const { id } = await context.params

    const product = await prisma.product.findUnique({
      where: { 
        id,
        isActive: true 
      },
      include: {
        category: true,
        variants: {
          where: { isActive: true },
          orderBy: [
            { size: 'asc' },
            { color: 'asc' }
          ]
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Atualizar produto (admin)
export async function PUT(
  request: NextRequest,
  context: PageProps
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

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
      isActive,
      variants
    } = body

    // Verificar se o slug já existe em outro produto
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug já existe' },
          { status: 400 }
        )
      }
    }

    // Atualizar produto
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(price && { price }),
        ...(salePrice !== undefined && { salePrice }),
        ...(image && { image }),
        ...(images && { images }),
        ...(categoryId && { categoryId }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      }
    })

    // Atualizar variações se fornecidas
    if (variants) {
      // Remover variações existentes
      await prisma.productVariant.deleteMany({
        where: { productId: id }
      })

      // Criar novas variações
      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map((variant: any) => ({
            ...variant,
            productId: id,
            sku: variant.sku || `${updatedProduct.slug}-${variant.size}-${variant.color}`.toLowerCase().replace(/\s+/g, '-')
          }))
        })
      }
    }

    // Buscar produto completo para retornar
    const completeProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true
      }
    })

    return NextResponse.json(completeProduct)

  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Remover produto (admin)
export async function DELETE(
  request: NextRequest,
  context: PageProps
) {
  try {
    const { id } = await context.params

    // Verificar se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há pedidos com este produto
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    })

    if (orderItemsCount > 0) {
      // Se há pedidos, apenas desativar o produto
      await prisma.product.update({
        where: { id },
        data: { isActive: false }
      })

      return NextResponse.json({
        message: 'Produto desativado (há pedidos associados)'
      })
    } else {
      // Se não há pedidos, pode deletar completamente
      await prisma.product.delete({
        where: { id }
      })

      return NextResponse.json({
        message: 'Produto removido com sucesso'
      })
    }

  } catch (error) {
    console.error('Erro ao remover produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}