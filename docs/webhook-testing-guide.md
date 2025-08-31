# 🔗 Guia de Teste de Webhook - Mercado Pago

## 📋 Pré-requisitos
- Servidor Next.js rodando em http://localhost:3000
- Conta de desenvolvedor no Mercado Pago
- ngrok instalado para exposição do localhost

## 🚀 Passo a Passo para Teste Real

### 1. Instalar ngrok (se não tiver)
```bash
# Windows - via Chocolatey
choco install ngrok

# Ou baixar de: https://ngrok.com/download
```

### 2. Expor o servidor local
```bash
# Terminal 1: Servidor Next.js
npm run dev

# Terminal 2: ngrok
ngrok http 3000
```

### 3. Configurar Webhook no Mercado Pago
1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Vá em "Webhooks"
3. Adicione a URL: `https://[SEU-NGROK-URL].ngrok.io/api/webhooks/mercadopago`
4. Selecione eventos: `payment`

### 4. Variáveis de Ambiente
Certifique-se de ter no `.env`:
```bash
MERCADOPAGO_ACCESS_TOKEN=seu_access_token_de_teste
MERCADOPAGO_PUBLIC_KEY=sua_public_key_de_teste
```

### 5. Teste de Integração Completa

#### 5.1 Criar Pedido de Teste
```javascript
// Dados do pedido
const orderData = {
  items: [
    {
      id: "produto-1",
      name: "Camiseta Super Herói", 
      price: 29.90,
      quantity: 1
    }
  ],
  customerData: {
    name: "João Teste",
    email: "joao@teste.com",
    phone: "11999999999",
    document: "12345678901"
  }
}
```

#### 5.2 Processar Pagamento
1. Acesse: http://localhost:3000
2. Adicione produto ao carrinho
3. Vá para checkout
4. Preencha dados do cliente
5. Selecione PIX como método de pagamento
6. Finalize o pedido

#### 5.3 Verificar Webhook
1. Monitore logs do servidor: `npm run dev`
2. Verifique logs do ngrok: Interface web em http://localhost:4040
3. Confirme recebimento de notificações no endpoint

### 6. Verificação no Banco de Dados
```bash
# Abrir Prisma Studio
npx prisma studio

# Verificar tabelas:
# - orders: Status do pedido
# - payments: Dados do pagamento
# - order_items: Itens do pedido
```

## 🧪 Scripts de Teste Disponíveis

### Teste de Webhook Local
```bash
node scripts/test-webhook-phase5.js
```

### Teste de Integração
```bash
node scripts/test-integration.js
```

### Validação de APIs
```bash
# Testar endpoint de produtos
curl http://localhost:3000/api/products

# Testar endpoint de webhook
curl http://localhost:3000/api/webhooks/mercadopago
```

## 📊 Monitoramento

### Logs Importantes
- **Next.js Console**: Erros de aplicação e logs de webhook
- **Prisma Logs**: Queries do banco de dados
- **ngrok Interface**: Tráfego HTTP em tempo real
- **Mercado Pago Dashboard**: Status dos pagamentos

### Pontos de Verificação
- [ ] Webhook recebe notificações
- [ ] Dados são validados corretamente
- [ ] Status de pagamento é mapeado
- [ ] Pedido é atualizado no banco
- [ ] Logs não mostram erros

## 🎯 Cenários de Teste

### Cenário 1: Pagamento PIX Aprovado
1. Criar pedido com PIX
2. Simular pagamento aprovado
3. Verificar: order.status = 'CONFIRMED'

### Cenário 2: Pagamento Pendente
1. Criar pedido com cartão
2. Deixar pagamento pendente
3. Verificar: order.status = 'PENDING'

### Cenário 3: Pagamento Rejeitado
1. Criar pedido
2. Simular pagamento rejeitado
3. Verificar: order.status = 'CANCELLED'

## 🔧 Troubleshooting

### Webhook não recebe notificações
- Verificar URL no painel do Mercado Pago
- Confirmar que ngrok está ativo
- Testar endpoint manualmente

### Erros de validação
- Verificar estrutura da notificação
- Conferir logs de erro no console
- Validar dados de entrada

### Problemas de banco de dados
- Verificar conexão SQLite
- Executar `npx prisma generate`
- Recriar migrations se necessário

## ✅ Critérios de Sucesso da Fase 5

- [x] Webhook implementado e funcional
- [x] Mapeamento de status correto
- [x] Validação de dados robusta
- [x] Integração com banco de dados
- [x] Logs e monitoramento
- [x] Testes automatizados
- [ ] Teste em ambiente real com ngrok
- [ ] Documentação completa

---

**Próximo**: Fase 6 - Sistema de Emails 📧