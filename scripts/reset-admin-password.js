const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function resetAdminPassword() {
  try {
    const email = 'admin@nandaedudakids.com'
    const newPassword = '123456'
    
    console.log('🔄 Resetando senha do admin...')
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Atualizar senha
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })
    
    console.log('✅ Senha resetada com sucesso!')
    console.log('📧 Email:', email)
    console.log('🔑 Nova senha:', newPassword)
    console.log('👤 Usuário ID:', updatedUser.id)
    
    // Testar nova senha
    const testUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (testUser && testUser.password) {
      const isValid = await bcrypt.compare(newPassword, testUser.password)
      console.log('🔓 Teste da nova senha:', isValid ? '✅ OK' : '❌ FALHOU')
    }
    
  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAdminPassword()