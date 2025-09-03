const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testAuth() {
  try {
    console.log('🔍 Verificando usuário admin...')
    
    const user = await prisma.user.findUnique({
      where: { email: 'admin@nandaedudakids.com' }
    })
    
    console.log('Usuário encontrado:', {
      id: user?.id,
      email: user?.email,
      name: user?.name,
      isAdmin: user?.isAdmin,
      isActive: user?.isActive,
      hasPassword: !!user?.password
    })
    
    if (user?.password) {
      const isValid = await bcrypt.compare('123456', user.password)
      console.log('Senha "123456" é válida:', isValid)
      
      const hashTest = await bcrypt.hash('123456', 12)
      console.log('Hash de teste para "123456":', hashTest)
      console.log('Hash atual do usuário:', user.password)
    }
    
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()