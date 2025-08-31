/**
 * Script para testar o webhook do Mercado Pago localmente
 * Execute com: node scripts/test-webhook.js
 */

const axios = require('axios')

const WEBHOOK_URL = 'http://localhost:3000/api/webhooks/mercadopago'

// Mock de notificação do Mercado Pago
const mockPaymentNotification = {
  id: 12345,
  live_mode: false,
  type: "payment",
  date_created: "2025-08-31T15:30:00.000-04:00",
  application_id: 123456789,
  user_id: 123456789,
  version: 1,
  api_version: "v1",
  action: "payment.created",
  data: {
    id: "1234567890"
  }
}

// Mock de dados de pagamento aprovado
const mockApprovedPayment = {
  id: 12345,
  live_mode: false,
  type: "payment",
  date_created: "2025-08-31T15:35:00.000-04:00",
  application_id: 123456789,
  user_id: 123456789,
  version: 1,
  api_version: "v1",
  action: "payment.updated",
  data: {
    id: "1234567890"
  }
}

async function testWebhook() {
  console.log('🧪 Testando webhook do Mercado Pago...\n')

  try {
    // Teste 1: GET endpoint
    console.log('1️⃣ Testando endpoint GET...')
    const getResponse = await axios.get(WEBHOOK_URL)
    console.log('✅ GET Response:', getResponse.data)
    console.log('')

    // Teste 2: Notificação de pagamento criado
    console.log('2️⃣ Testando notificação de pagamento criado...')
    const postResponse1 = await axios.post(WEBHOOK_URL, mockPaymentNotification, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('✅ POST Response 1:', postResponse1.data)
    console.log('')

    // Teste 3: Notificação de pagamento aprovado
    console.log('3️⃣ Testando notificação de pagamento aprovado...')
    const postResponse2 = await axios.post(WEBHOOK_URL, mockApprovedPayment, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('✅ POST Response 2:', postResponse2.data)
    console.log('')

    // Teste 4: Notificação inválida
    console.log('4️⃣ Testando notificação inválida...')
    const invalidNotification = { invalid: 'data' }
    const postResponse3 = await axios.post(WEBHOOK_URL, invalidNotification, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('✅ POST Response 3:', postResponse3.data)
    console.log('')

    console.log('🎉 Todos os testes do webhook passaram!')

  } catch (error) {
    if (error.response) {
      console.error('❌ Erro na resposta:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('❌ Erro na requisição:', error.message)
      console.log('⚠️  Verifique se o servidor está rodando em http://localhost:3000')
    } else {
      console.error('❌ Erro:', error.message)
    }
  }
}

// Executar testes
testWebhook()