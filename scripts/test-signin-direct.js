const { default: fetch } = require('node-fetch')

async function testSignIn() {
  try {
    console.log('🔐 Testando POST para /api/auth/signin/credentials...')
    
    const response = await fetch('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@nandaedudakids.com',
        password: '123456',
        redirect: false
      })
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    
    const text = await response.text()
    console.log('Response body:', text)
    
  } catch (error) {
    console.error('Erro:', error)
  }
}

testSignIn()