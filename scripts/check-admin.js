const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@nandaedudakids.com' }
    })
    
    console.log('📋 Verificação do usuário admin:')
    if (admin) {
      console.log('✅ Admin encontrado:')
      console.log('📧 Email:', admin.email)
      console.log('👤 Nome:', admin.name)
      console.log('🔐 Tem senha:', admin.password ? 'Sim' : 'Não')
      console.log('👑 É admin:', admin.isAdmin)
      console.log('🟢 Está ativo:', admin.isActive)
      console.log('🆔 ID:', admin.id)
    } else {
      console.log('❌ Admin não encontrado!')
    }
  } catch (error) {
    console.error('❌ Erro ao verificar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmin()