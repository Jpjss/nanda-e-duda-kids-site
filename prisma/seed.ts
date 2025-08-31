import { prisma } from '@/lib/prisma'

const categories = [
  {
    name: 'Roupas',
    slug: 'roupas',
    description: 'Roupas infantis para todas as ocasiões',
    image: '/placeholder.jpg'
  },
  {
    name: 'Calçados',
    slug: 'calcados',
    description: 'Calçados confortáveis para os pequenos',
    image: '/placeholder.jpg'
  },
  {
    name: 'Acessórios',
    slug: 'acessorios',
    description: 'Acessórios charmosos para completar o look',
    image: '/placeholder.jpg'
  }
]

const products = [
  {
    name: 'Camiseta Super Herói',
    slug: 'camiseta-super-heroi',
    description: 'Camiseta confortável com estampa de super herói. Perfeita para aventuras e brincadeiras.',
    price: 29.90,
    image: '/camiseta-super-heroi.png',
    categorySlug: 'roupas',
    variants: [
      { size: 'P', color: 'Azul', stock: 15 },
      { size: 'M', color: 'Azul', stock: 20 },
      { size: 'G', color: 'Azul', stock: 10 },
      { size: 'P', color: 'Vermelho', stock: 12 },
      { size: 'M', color: 'Vermelho', stock: 18 },
      { size: 'G', color: 'Vermelho', stock: 8 }
    ]
  },
  {
    name: 'Vestido Verão Encantado',
    slug: 'vestido-verao-encantado',
    description: 'Vestido leve e fresco para os dias quentes. Tecido respirável e estampa encantadora.',
    price: 45.90,
    image: '/vestido-verao-encantado.png',
    categorySlug: 'roupas',
    variants: [
      { size: 'P', color: 'Rosa', stock: 10 },
      { size: 'M', color: 'Rosa', stock: 15 },
      { size: 'G', color: 'Rosa', stock: 8 },
      { size: 'P', color: 'Amarelo', stock: 12 },
      { size: 'M', color: 'Amarelo', stock: 20 },
      { size: 'G', color: 'Amarelo', stock: 6 }
    ]
  },
  {
    name: 'Tênis Colorido Infantil',
    slug: 'tenis-colorido-infantil',
    description: 'Tênis confortável e colorido. Solado antiderrapante e design moderno.',
    price: 79.90,
    image: '/tenis-colorido-infantil.png',
    categorySlug: 'calcados',
    variants: [
      { size: '25', color: 'Multicolorido', stock: 8 },
      { size: '26', color: 'Multicolorido', stock: 10 },
      { size: '27', color: 'Multicolorido', stock: 12 },
      { size: '28', color: 'Multicolorido', stock: 9 },
      { size: '29', color: 'Multicolorido', stock: 7 },
      { size: '30', color: 'Multicolorido', stock: 5 }
    ]
  },
  {
    name: 'Laço de Cabelo Encantado',
    slug: 'laco-cabelo-encantado',
    description: 'Laço de cabelo delicado e charmoso. Material macio e hipoalergênico.',
    price: 15.90,
    image: '/laco-cabelo-encantado.png',
    categorySlug: 'acessorios',
    variants: [
      { size: 'Único', color: 'Rosa', stock: 25 },
      { size: 'Único', color: 'Azul', stock: 20 },
      { size: 'Único', color: 'Amarelo', stock: 18 },
      { size: 'Único', color: 'Roxo', stock: 15 }
    ]
  },
  {
    name: 'Macacão Unicórnio Mágico',
    slug: 'macacao-unicornio-magico',
    description: 'Macacão fofo com tema de unicórnio. Tecido macio e confortável para dormir.',
    price: 59.90,
    image: '/macacao-unicornio-magico.png',
    categorySlug: 'roupas',
    variants: [
      { size: 'P', color: 'Rosa', stock: 12 },
      { size: 'M', color: 'Rosa', stock: 15 },
      { size: 'G', color: 'Rosa', stock: 10 },
      { size: 'P', color: 'Branco', stock: 8 },
      { size: 'M', color: 'Branco', stock: 12 },
      { size: 'G', color: 'Branco', stock: 6 }
    ]
  },
  {
    name: 'Pijama de Estrelas',
    slug: 'pijama-de-estrelas',
    description: 'Pijama confortável com estampa de estrelas. Perfeito para uma boa noite de sono.',
    price: 39.90,
    image: '/pijama-de-estrelas.png',
    categorySlug: 'roupas',
    variants: [
      { size: 'P', color: 'Azul', stock: 15 },
      { size: 'M', color: 'Azul', stock: 20 },
      { size: 'G', color: 'Azul', stock: 12 },
      { size: 'P', color: 'Rosa', stock: 10 },
      { size: 'M', color: 'Rosa', stock: 18 },
      { size: 'G', color: 'Rosa', stock: 8 }
    ]
  },
  {
    name: 'Shorts Jeans Divertido',
    slug: 'shorts-jeans-divertido',
    description: 'Shorts jeans com detalhes divertidos. Resistente e confortável para o dia a dia.',
    price: 34.90,
    image: '/shorts-jeans-divertido.png',
    categorySlug: 'roupas',
    variants: [
      { size: 'P', color: 'Azul', stock: 18 },
      { size: 'M', color: 'Azul', stock: 22 },
      { size: 'G', color: 'Azul', stock: 14 },
      { size: 'P', color: 'Desbotado', stock: 12 },
      { size: 'M', color: 'Desbotado', stock: 16 },
      { size: 'G', color: 'Desbotado', stock: 10 }
    ]
  },
  {
    name: 'Casaco Inverno Quentinho',
    slug: 'casaco-inverno-quentinho',
    description: 'Casaco quente e aconchegante para os dias frios. Material de alta qualidade.',
    price: 89.90,
    image: '/casaco-inverno-quentinho.png',
    categorySlug: 'roupas',
    variants: [
      { size: 'P', color: 'Vermelho', stock: 8 },
      { size: 'M', color: 'Vermelho', stock: 12 },
      { size: 'G', color: 'Vermelho', stock: 6 },
      { size: 'P', color: 'Azul', stock: 10 },
      { size: 'M', color: 'Azul', stock: 15 },
      { size: 'G', color: 'Azul', stock: 8 }
    ]
  },
  {
    name: 'Conjunto Dino Aventureiro',
    slug: 'conjunto-dino-aventureiro',
    description: 'Conjunto com tema de dinossauros. Camiseta + short para aventuras inesquecíveis.',
    price: 54.90,
    image: '/conjunto-dino-aventureiro.png',
    categorySlug: 'roupas',
    variants: [
      { size: 'P', color: 'Verde', stock: 14 },
      { size: 'M', color: 'Verde', stock: 18 },
      { size: 'G', color: 'Verde', stock: 12 },
      { size: 'P', color: 'Laranja', stock: 10 },
      { size: 'M', color: 'Laranja', stock: 14 },
      { size: 'G', color: 'Laranja', stock: 8 }
    ]
  }
]

async function main() {
  console.log('🌱 Iniciando seeding do banco de dados...')

  // Limpar dados existentes
  await prisma.orderItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.address.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()

  // Criar categorias
  console.log('📂 Criando categorias...')
  const createdCategories = await Promise.all(
    categories.map(category =>
      prisma.category.create({
        data: category
      })
    )
  )

  // Criar produtos com variações
  console.log('🛍️ Criando produtos...')
  for (const productData of products) {
    const { variants, categorySlug, ...product } = productData
    
    // Encontrar categoria
    const category = createdCategories.find(cat => cat.slug === categorySlug)
    if (!category) continue

    // Criar produto
    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        price: product.price,
        categoryId: category.id
      }
    })

    // Criar variações
    if (variants) {
      await Promise.all(
        variants.map(variant =>
          prisma.productVariant.create({
            data: {
              ...variant,
              productId: createdProduct.id,
              sku: `${createdProduct.slug}-${variant.size}-${variant.color}`.toLowerCase().replace(/\s+/g, '-')
            }
          })
        )
      )
    }
  }

  // Criar usuário admin
  console.log('👤 Criando usuário administrador...')
  await prisma.user.create({
    data: {
      email: 'admin@nandaeduadakids.com',
      name: 'Administrador',
      phone: '(11) 99999-9999',
      isAdmin: true
    }
  })

  console.log('✅ Seeding concluído com sucesso!')
  console.log(`📊 Criadas ${createdCategories.length} categorias`)
  console.log(`📦 Criados ${products.length} produtos`)
  console.log('🎯 Banco de dados pronto para uso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })