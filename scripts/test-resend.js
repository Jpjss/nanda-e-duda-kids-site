const { Resend } = require('resend')

async function testResendAPI() {
  try {
    console.log('🧪 Testando API do Resend...')
    
    const resend = new Resend('re_TPD8UUFE_9XQ22HBFTNmFEZLSUwYehbFw')
    
    console.log('✅ Cliente Resend criado com sucesso')
    
    // Teste simples de envio
    const result = await resend.emails.send({
      from: 'Nanda e Duda Kids <onboarding@resend.dev>',
      to: ['jp0886230@gmail.com'],
      subject: 'Teste de Configuração - Nanda e Duda Kids',
      html: '<h1>Teste de Email</h1><p>Se você recebeu este email, a configuração está funcionando!</p>'
    })
    
    console.log('📧 Resultado do envio:', result)
    
  } catch (error) {
    console.error('❌ Erro no teste do Resend:', error)
  }
}

testResendAPI()