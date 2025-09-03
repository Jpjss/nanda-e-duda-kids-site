const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱 Populando banco de dados com produtos...')

    // Limpar dados existentes
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    console.log('🗑️ Dados antigos removidos')

    // Criar categoria padrão
    const category = await prisma.category.create({
      data: {
        id: 'cat1',
        name: 'Roupas Infantis',
        slug: 'roupas-infantis',
        description: 'Roupas confortáveis e estilosas para crianças',
        isActive: true
      }
    })
    
    console.log('✅ Categoria criada:', category.name)

    // Criar produtos de exemplo
    const products = [
      {
        id: '1',
        name: 'Camiseta Super Herói',
        slug: 'camiseta-super-heroi',
        description: 'Camiseta infantil com estampa de super herói. Tecido 100% algodão, confortável e durável.',
        price: 29.90,
        salePrice: 24.90,
        image: '/camiseta-super-heroi.png',
        isActive: true,
        categoryId: category.id
      },
      {
        id: '2',
        name: 'Vestido Verão Encantado',
        slug: 'vestido-verao-encantado',
        description: 'Vestido infantil perfeito para o verão. Tecido leve e fresco com estampa floral delicada.',
        price: 59.90,
        salePrice: 49.90,
        image: '/vestido-verao-encantado.png',
        isActive: true,
        categoryId: category.id
      },
      {
        id: '3',
        name: 'Conjunto Dino Aventureiro',
        slug: 'conjunto-dino-aventureiro',
        description: 'Conjunto infantil com camiseta e shorts, tema dinossauros. Ideal para brincadeiras.',
        price: 79.90,
        salePrice: 69.90,
        image: '/conjunto-dino-aventureiro.png',
        isActive: true,
        categoryId: category.id
      },
      {
        id: '4',
        name: 'Pijama de Estrelas',
        slug: 'pijama-de-estrelas',
        description: 'Pijama infantil super confortável com estampa de estrelas brilhantes. Perfeito para uma boa noite de sono.',
        price: 49.90,
        salePrice: 39.90,
        image: '/pijama-de-estrelas.png',
        isActive: true,
        categoryId: category.id
      },
      {
        id: '5',
        name: 'Macacão Unicórnio Mágico',
        slug: 'macacao-unicornio-magico',
        description: 'Macacão infantil com capuz de unicórnio. Super fofo e quentinho para os dias mais frios.',
        price: 89.90,
        salePrice: 79.90,
        image: '/macacao-unicornio-magico.png',
        isActive: true,
        categoryId: category.id
      },
      {
        id: '6',
        name: 'Shorts Jeans Divertido',
        slug: 'shorts-jeans-divertido',
        description: 'Shorts jeans infantil com bordados divertidos. Resistente e estiloso para o dia a dia.',
        price: 39.90,
        salePrice: 34.90,
        image: '/shorts-jeans-divertido.png',
        isActive: true,
        categoryId: category.id
      }
    ]

    for (const product of products) {
      await prisma.product.create({
        data: product
      })
      console.log(`✅ Produto criado: ${product.name}`)
    }

    console.log('🎉 Banco de dados populado com sucesso!')
    console.log(`📦 Total de produtos criados: ${products.length}`)

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()