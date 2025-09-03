# 📧 Guia de Configuração do Sistema de Emails - Resend

## 🚀 Configuração Inicial

### 1. Criar Conta no Resend
1. Acesse: https://resend.com/
2. Crie uma conta gratuita
3. Verifique seu email
4. Acesse o dashboard

### 2. Configurar Domínio (Recomendado)
```bash
# Exemplo de configuração DNS
# Adicione estes registros no seu provedor de DNS:

MX     nandaedudakids.com     feedback-smtp.us-east-1.amazonses.com    10
TXT    nandaedudakids.com     "v=spf1 include:amazonses.com ~all"
TXT    _dmarc.nandaedudakids.com    "v=DMARC1; p=quarantine; rua=mailto:admin@nandaedudakids.com"
```

### 3. Obter Chave API
1. No dashboard do Resend, vá em "API Keys"
2. Clique em "Create API Key"
3. Dê um nome: "Nanda e Duda Kids - Produção"
4. Copie a chave gerada

### 4. Configurar Variáveis de Ambiente
```bash
# .env
RESEND_API_KEY=re_123abc456def789ghi012jkl345mno678pqr
EMAIL_FROM=Nanda e Duda Kids <noreply@nandaedudakids.com>
EMAIL_REPLY_TO=contato@nandaedudakids.com
EMAIL_SUPPORT=suporte@nandaedudakids.com
NEXTAUTH_URL=https://seu-dominio.com
```

## 🧪 Teste de Configuração

### Teste 1: API Route
```bash
# Testar endpoint de emails
curl -X GET http://localhost:3000/api/emails/send

# Resposta esperada:
{
  "service": "Email Service",
  "status": "operational",
  "provider": "Resend",
  "timestamp": "2025-09-02T..."
}
```

### Teste 2: Envio Manual
```bash
# Testar envio de email
curl -X POST http://localhost:3000/api/emails/send \
  -H "Content-Type: application/json" \
  -d '{
    "type": "order_confirmation",
    "orderData": {
      "id": "test123",
      "customerName": "João Teste",
      "customerEmail": "seu-email@teste.com",
      "total": 89.90,
      "items": []
    }
  }'
```

### Teste 3: Painel Administrativo
1. Acesse: http://localhost:3000/admin/emails
2. Preencha o formulário de teste
3. Envie um email de teste
4. Verifique sua caixa de entrada

## 📊 Monitoramento

### Dashboard do Resend
- **Emails Enviados**: Quantidade total
- **Taxa de Entrega**: Percentual de sucesso
- **Bounces**: Emails que falharam
- **Complaints**: Relatórios de spam

### Logs da Aplicação
```javascript
// Logs no console do servidor
console.log('Email de confirmação enviado:', data?.id)
console.error('Erro ao enviar email:', error)
```

## 🔧 Troubleshooting

### Problema: "API Key inválida"
**Solução:**
1. Verifique se RESEND_API_KEY está correto no .env
2. Reinicie o servidor: `npm run dev`
3. Teste a chave no dashboard do Resend

### Problema: "Domain not verified"
**Solução:**
1. Use um domínio verificado ou onboarding@resend.dev para testes
2. Configure DNS conforme documentação do Resend
3. Aguarde verificação (pode levar até 24h)

### Problema: "Rate limit exceeded"
**Solução:**
1. Plano gratuito: 100 emails/dia
2. Implemente retry com delay
3. Considere upgrade do plano

### Problema: Emails na pasta spam
**Solução:**
1. Configure SPF, DKIM e DMARC
2. Use domínio verificado
3. Evite palavras trigger de spam
4. Inclua link de descadastro

## 📧 Templates Disponíveis

### 1. Confirmação de Pedido
- **Trigger**: Pagamento aprovado
- **Conteúdo**: Resumo do pedido, itens, entrega
- **Design**: Responsivo, cores da marca

### 2. PIX Pendente
- **Trigger**: Pedido criado com PIX
- **Conteúdo**: Instruções, QR Code, prazo
- **Design**: Destaque para informações de pagamento

### 3. Atualização de Status
- **Trigger**: Mudança de status manual/automática
- **Conteúdo**: Status atual, próximos passos
- **Design**: Cores baseadas no status

## 🔐 Segurança

### Boas Práticas
- [ ] Use HTTPS sempre
- [ ] Valide dados de entrada
- [ ] Implemente rate limiting
- [ ] Log eventos importantes
- [ ] Use domínio verificado
- [ ] Configure autenticação DKIM

### Dados Sensíveis
- [ ] Não inclua senhas em emails
- [ ] Ofusque dados pessoais se necessário
- [ ] Use links seguros com tokens
- [ ] Implemente opt-out para marketing

## 📈 Métricas Importantes

### KPIs de Email
- **Taxa de Entrega**: > 95%
- **Taxa de Abertura**: 15-25%
- **Taxa de Cliques**: 2-5%
- **Taxa de Bounce**: < 2%
- **Reclamações de Spam**: < 0.1%

### Monitoramento Contínuo
```javascript
// Exemplo de log estruturado
{
  "event": "email_sent",
  "type": "order_confirmation",
  "recipient": "customer@email.com",
  "order_id": "order_123",
  "timestamp": "2025-09-02T10:30:00Z",
  "message_id": "msg_abc123",
  "status": "success"
}
```

## 🚀 Deploy em Produção

### Checklist Pré-Deploy
- [ ] Configurar domínio no Resend
- [ ] Verificar DNS (SPF, DKIM, DMARC)
- [ ] Testar envio em ambiente de staging
- [ ] Configurar variáveis de ambiente
- [ ] Validar templates com dados reais
- [ ] Configurar monitoramento de logs

### Variáveis de Produção
```bash
# Vercel/Netlify
RESEND_API_KEY=sua_chave_de_producao
EMAIL_FROM=Nanda e Duda Kids <noreply@nandaedudakids.com>
EMAIL_REPLY_TO=contato@nandaedudakids.com
EMAIL_SUPPORT=suporte@nandaedudakids.com
NEXTAUTH_URL=https://nandaedudakids.com
```

## 📚 Recursos Adicionais

- [Documentação Resend](https://resend.com/docs)
- [Guia de SPF/DKIM](https://resend.com/docs/dashboard/domains/introduction)
- [Best Practices](https://resend.com/docs/send/best-practices)
- [Rate Limits](https://resend.com/docs/api-reference/introduction#rate-limit)

---

**Status da Fase 6**: ✅ Sistema de Emails Implementado
**Próxima Fase**: Painel Administrativo (Fase 7)