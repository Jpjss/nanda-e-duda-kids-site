const { PrismaClient: SqliteClient } = require('../tmp-sqlite-client')
const { PrismaClient: PostgresClient } = require('@prisma/client')

const sqlite = new SqliteClient()
const postgres = new PostgresClient()

async function migrateCategories() {
  const categories = await sqlite.category.findMany()

  for (const category of categories) {
    await postgres.category.upsert({
      where: { id: category.id },
      update: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      create: category,
    })
  }
}

async function migrateProducts() {
  const products = await sqlite.product.findMany()

  for (const product of products) {
    await postgres.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        image: product.image,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        weight: product.weight,
        width: product.width,
        height: product.height,
        length: product.length,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
      create: product,
    })
  }
}

async function migrateVariants() {
  const variants = await sqlite.productVariant.findMany()

  for (const variant of variants) {
    await postgres.productVariant.upsert({
      where: { id: variant.id },
      update: {
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        sku: variant.sku,
        isActive: variant.isActive,
        productId: variant.productId,
      },
      create: variant,
    })
  }
}

async function migrateUsers() {
  const users = await sqlite.user.findMany({
    where: {
      OR: [
        { isAdmin: true },
        { password: { not: null } },
      ],
    },
  })

  for (const user of users) {
    await postgres.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        name: user.name,
        phone: user.phone,
        cpf: user.cpf,
        password: user.password,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      create: user,
    })
  }
}

async function counts() {
  const [categories, products, variants, users, admins, orders, payments] = await Promise.all([
    postgres.category.count(),
    postgres.product.count(),
    postgres.productVariant.count(),
    postgres.user.count(),
    postgres.user.count({ where: { isAdmin: true } }),
    postgres.order.count(),
    postgres.payment.count(),
  ])

  return { categories, products, variants, users, admins, orders, payments }
}

async function main() {
  await migrateCategories()
  await migrateProducts()
  await migrateVariants()
  await migrateUsers()

  console.log(JSON.stringify(await counts(), null, 2))
}

main()
  .catch((error) => {
    console.error(JSON.stringify({ error: String(error.message || error).slice(0, 240) }, null, 2))
    process.exitCode = 1
  })
  .finally(async () => {
    await sqlite.$disconnect()
    await postgres.$disconnect()
  })
