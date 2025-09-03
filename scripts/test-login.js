const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testLogin() {
  try {
    const email = 'admin@nandaedudakids.com'
    const password = 'admin123'
    
    console.log('🔐 Testando login:')
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ Usuário não encontrado!')
      return
    }
    
    console.log('✅ Usuário encontrado')
    console.log('🔐 Hash da senha no banco:', user.password)
    
    // Testar senha
    if (user.password) {
      const isValid = await bcrypt.compare(password, user.password)
      console.log('🔓 Senha válida:', isValid)
      
      if (isValid) {
        console.log('✅ LOGIN FUNCIONARIA!')
        console.log('👑 É admin:', user.isAdmin)
        console.log('🟢 Está ativo:', user.isActive)
      } else {
        console.log('❌ SENHA INCORRETA!')
      }
    } else {
      console.log('❌ Usuário sem senha!')
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()