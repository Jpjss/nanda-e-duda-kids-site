// Teste simples de conectividade
console.log('🔍 Testando conectividade...')

// Teste com fetch (native)
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/mercadopago')
    const data = await response.json()
    console.log('✅ API Response:', data)
  } catch (error) {
    console.log('❌ Erro ao conectar:', error.message)
  }
}

// Teste local de integração (simulação)
console.log('🚀 Simulando integração Mercado Pago...')

const mockPaymentData = {
  id: 'test-payment-123',
  status: 'approved',
  external_reference: 'test-order-456',
  transaction_amount: 99.90,
  payment_method_id: 'pix',
  installments: 1
}

console.log('💰 Dados de pagamento simulados:', mockPaymentData)

// Simular processamento de webhook
const processPayment = (paymentData) => {
  console.log('📝 Processando pagamento...')
  
  const statusMapping = {
    'approved': 'APPROVED',
    'pending': 'PENDING',
    'rejected': 'REJECTED'
  }
  
  const result = {
    orderId: paymentData.external_reference,
    paymentId: paymentData.id,
    status: statusMapping[paymentData.status],
    amount: paymentData.transaction_amount,
    method: paymentData.payment_method_id.toUpperCase()
  }
  
  console.log('✅ Resultado do processamento:', result)
  return result
}

const result = processPayment(mockPaymentData)
console.log('🎉 Teste de integração concluído!')

// Se conseguir conectar, teste a API
testAPI()