const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Dados do admin
    const adminEmail = 'admin@nandaedudakids.com'
    const adminPassword = 'admin123'
    const adminName = 'Administrador'

    // Verificar se o admin já existe
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (existingAdmin) {
      console.log('❌ Admin já existe no banco de dados!')
      console.log(`📧 Email: ${adminEmail}`)
      return
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        isAdmin: true,
        isActive: true
      }
    })

    console.log('✅ Usuário administrador criado com sucesso!')
    console.log('📧 Email:', adminEmail)
    console.log('🔐 Senha:', adminPassword)
    console.log('👤 ID:', admin.id)
    console.log('')
    console.log('🚀 Você pode agora fazer login no painel administrativo:')
    console.log('🔗 http://localhost:3000/admin/login')

  } catch (error) {
    console.error('❌ Erro ao criar usuário admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()