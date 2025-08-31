import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories - Listar categorias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    const where: any = {}
    
    if (active === 'true') {
      where.isActive = true
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(categories)

  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Criar categoria (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, image } = body

    // Validações básicas
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, slug' },
        { status: 400 }
      )
    }

    // Verificar se o slug já existe
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Slug já existe' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image
      }
    })

    return NextResponse.json(category, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}