import { Resend } from 'resend'

// Configuração do Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Configurações de email
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Nanda e Duda Kids <noreply@nandaedudakids.com>',
  replyTo: process.env.EMAIL_REPLY_TO || 'contato@nandaedudakids.com',
  supportEmail: process.env.EMAIL_SUPPORT || 'suporte@nandaedudakids.com'
}

// Função para enviar email de confirmação de pedido
export async function sendOrderConfirmationEmail(orderData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [orderData.customerEmail],
      subject: `Pedido Confirmado #${orderData.id.slice(-8)} - Nanda e Duda Kids`,
      html: generateOrderConfirmationHTML(orderData),
      replyTo: EMAIL_CONFIG.replyTo
    })

    if (error) {
      console.error('Erro ao enviar email de confirmação:', error)
      return { success: false, error }
    }

    console.log('Email de confirmação enviado:', data?.id)
    return { success: true, data }

  } catch (error) {
    console.error('Erro no envio de email:', error)
    return { success: false, error }
  }
}

// Função para enviar email de atualização de status
export async function sendStatusUpdateEmail(orderData: any, oldStatus: string, newStatus: string) {
  try {
    const statusMessages = {
      PENDING: 'Pedido em Processamento',
      CONFIRMED: 'Pagamento Confirmado',
      SHIPPED: 'Pedido Enviado',
      DELIVERED: 'Pedido Entregue',
      CANCELLED: 'Pedido Cancelado'
    }

    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [orderData.customerEmail],
      subject: `${statusMessages[newStatus as keyof typeof statusMessages]} - Pedido #${orderData.id.slice(-8)}`,
      html: generateStatusUpdateHTML(orderData, oldStatus, newStatus),
      replyTo: EMAIL_CONFIG.replyTo
    })

    if (error) {
      console.error('Erro ao enviar email de status:', error)
      return { success: false, error }
    }

    console.log('Email de status enviado:', data?.id)
    return { success: true, data }

  } catch (error) {
    console.error('Erro no envio de email de status:', error)
    return { success: false, error }
  }
}

// Função para enviar email de PIX pendente
export async function sendPixPendingEmail(orderData: any, pixData: any) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: [orderData.customerEmail],
      subject: `PIX Pendente - Pedido #${orderData.id.slice(-8)} - Nanda e Duda Kids`,
      html: generatePixPendingHTML(orderData, pixData),
      replyTo: EMAIL_CONFIG.replyTo
    })

    if (error) {
      console.error('Erro ao enviar email de PIX pendente:', error)
      return { success: false, error }
    }

    console.log('Email de PIX pendente enviado:', data?.id)
    return { success: true, data }

  } catch (error) {
    console.error('Erro no envio de email de PIX:', error)
    return { success: false, error }
  }
}

// Template HTML para confirmação de pedido
function generateOrderConfirmationHTML(orderData: any) {
  const itemsHTML = orderData.items?.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image || '/placeholder.jpg'}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <small>Tamanho: ${item.size || 'Único'} | Cor: ${item.color || 'Padrão'}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}x
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        R$ ${item.price?.toFixed(2).replace('.', ',') || '0,00'}
      </td>
    </tr>
  `).join('') || ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pedido Confirmado - Nanda e Duda Kids</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Pedido Confirmado!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Obrigado por escolher a Nanda e Duda Kids</p>
        </div>

        <!-- Conteúdo -->
        <div style="padding: 30px 20px;">
          
          <!-- Saudação -->
          <h2 style="color: #2d3748; margin-bottom: 20px;">Olá, ${orderData.customerName}! 👋</h2>
          
          <p style="margin-bottom: 20px;">
            Seu pedido foi confirmado com sucesso e já está sendo processado. 
            Você receberá atualizações sobre o status do seu pedido por email.
          </p>

          <!-- Detalhes do Pedido -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #2d3748;">📦 Detalhes do Pedido</h3>
            <p><strong>Número do Pedido:</strong> #${orderData.id.slice(-8)}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
            <p><strong>Status:</strong> <span style="color: #48bb78;">Confirmado</span></p>
            <p><strong>Método de Pagamento:</strong> ${orderData.paymentMethod === 'PIX' ? 'PIX' : 'Cartão'}</p>
          </div>

          <!-- Itens do Pedido -->
          <h3 style="color: #2d3748;">🛍️ Itens do Pedido</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #edf2f7;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e0;">Produto</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e0;">Detalhes</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #cbd5e0;">Qtd</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #cbd5e0;">Valor</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <!-- Total -->
          <div style="text-align: right; margin-bottom: 20px;">
            <div style="background-color: #edf2f7; padding: 15px; border-radius: 8px; display: inline-block;">
              <p style="margin: 0; font-size: 18px;"><strong>Total: R$ ${orderData.total?.toFixed(2).replace('.', ',') || '0,00'}</strong></p>
            </div>
          </div>

          <!-- Endereço de Entrega -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #2d3748;">📍 Endereço de Entrega</h3>
            <p style="margin-bottom: 5px;">${orderData.shippingStreet}</p>
            <p style="margin-bottom: 5px;">${orderData.shippingNeighborhood} - ${orderData.shippingCity}/${orderData.shippingState}</p>
            <p style="margin-bottom: 0;">CEP: ${orderData.shippingZipCode}</p>
          </div>

          <!-- Próximos Passos -->
          <div style="background-color: #ebf8ff; padding: 20px; border-radius: 8px; border-left: 4px solid #4299e1;">
            <h3 style="margin-top: 0; color: #2b6cb0;">📋 Próximos Passos</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Processaremos seu pedido em até 1 dia útil</li>
              <li>Você receberá o código de rastreamento por email</li>
              <li>Prazo de entrega: 3-7 dias úteis</li>
            </ul>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #2d3748; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0 0 10px 0;">💜 Nanda e Duda Kids - Roupas com Amor</p>
          <p style="margin: 0; opacity: 0.8; font-size: 14px;">
            Dúvidas? Responda este email ou entre em contato: ${EMAIL_CONFIG.supportEmail}
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// Template HTML para PIX pendente
function generatePixPendingHTML(orderData: any, pixData: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PIX Pendente - Nanda e Duda Kids</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">⏰ PIX Pendente</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Complete seu pagamento para finalizar o pedido</p>
        </div>

        <!-- Conteúdo -->
        <div style="padding: 30px 20px;">
          
          <h2 style="color: #2d3748; margin-bottom: 20px;">Olá, ${orderData.customerName}! 👋</h2>
          
          <p style="margin-bottom: 20px;">
            Seu pedido #${orderData.id.slice(-8)} foi criado com sucesso! 
            Para finalizar, complete o pagamento via PIX usando as informações abaixo:
          </p>

          <!-- Informações do PIX -->
          <div style="background-color: #f0fff4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px solid #48bb78;">
            <h3 style="margin-top: 0; color: #2f855a;">💚 Dados para Pagamento PIX</h3>
            <p><strong>Valor:</strong> R$ ${orderData.total?.toFixed(2).replace('.', ',') || '0,00'}</p>
            <p><strong>Chave PIX:</strong> <code style="background-color: #e6fffa; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${pixData.pixKey || 'Será disponibilizada na finalização'}</code></p>
            
            <div style="text-align: center; margin: 20px 0;">
              <p><strong>QR Code PIX:</strong></p>
              <div style="background-color: white; padding: 10px; border-radius: 8px; display: inline-block;">
                ${pixData.qrCode ? `<img src="${pixData.qrCode}" alt="QR Code PIX" style="max-width: 200px;">` : '<p>QR Code será gerado na finalização</p>'}
              </div>
            </div>
          </div>

          <!-- Instruções -->
          <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f6ad55;">
            <h3 style="margin-top: 0; color: #c05621;">📱 Como Pagar com PIX</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Abra o app do seu banco</li>
              <li>Escolha a opção PIX</li>
              <li>Escaneie o QR Code ou cole a chave PIX</li>
              <li>Confirme o pagamento</li>
              <li>Pronto! Seu pedido será confirmado automaticamente</li>
            </ol>
          </div>

          <!-- Detalhes do Pedido -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="margin-top: 0; color: #2d3748;">📦 Resumo do Pedido</h3>
            <p><strong>Número:</strong> #${orderData.id.slice(-8)}</p>
            <p><strong>Total:</strong> R$ ${orderData.total?.toFixed(2).replace('.', ',') || '0,00'}</p>
            <p><strong>Prazo para Pagamento:</strong> 24 horas</p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #2d3748; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0 0 10px 0;">💜 Nanda e Duda Kids - Roupas com Amor</p>
          <p style="margin: 0; opacity: 0.8; font-size: 14px;">
            Dúvidas? Responda este email ou entre em contato: ${EMAIL_CONFIG.supportEmail}
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// Template HTML para atualização de status
function generateStatusUpdateHTML(orderData: any, oldStatus: string, newStatus: string) {
  const statusConfig = {
    PENDING: { color: '#f6ad55', icon: '⏳', message: 'Seu pedido está sendo processado' },
    CONFIRMED: { color: '#48bb78', icon: '✅', message: 'Pagamento confirmado! Seu pedido será enviado em breve' },
    SHIPPED: { color: '#4299e1', icon: '🚚', message: 'Seu pedido foi enviado e está a caminho' },
    DELIVERED: { color: '#9f7aea', icon: '📦', message: 'Seu pedido foi entregue com sucesso' },
    CANCELLED: { color: '#f56565', icon: '❌', message: 'Seu pedido foi cancelado' }
  }

  const config = statusConfig[newStatus as keyof typeof statusConfig] || statusConfig.PENDING

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Atualização do Pedido - Nanda e Duda Kids</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: ${config.color}; color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">${config.icon} Pedido Atualizado</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Status do seu pedido foi atualizado</p>
        </div>

        <!-- Conteúdo -->
        <div style="padding: 30px 20px;">
          
          <h2 style="color: #2d3748; margin-bottom: 20px;">Olá, ${orderData.customerName}! 👋</h2>
          
          <p style="margin-bottom: 20px; font-size: 18px;">
            ${config.message}
          </p>

          <!-- Status -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #2d3748;">📊 Status do Pedido</h3>
            <p><strong>Número do Pedido:</strong> #${orderData.id.slice(-8)}</p>
            <p><strong>Status Anterior:</strong> ${oldStatus}</p>
            <p><strong>Status Atual:</strong> <span style="color: ${config.color}; font-weight: bold;">${newStatus}</span></p>
            <p><strong>Data da Atualização:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          ${newStatus === 'SHIPPED' ? `
          <div style="background-color: #ebf8ff; padding: 20px; border-radius: 8px; border-left: 4px solid #4299e1;">
            <h3 style="margin-top: 0; color: #2b6cb0;">🚚 Rastreamento</h3>
            <p>Seu pedido foi enviado e pode ser rastreado pelos Correios.</p>
            <p><strong>Código de Rastreamento:</strong> <code style="background-color: #e6fffa; padding: 4px 8px; border-radius: 4px;">BR123456789BR</code></p>
            <p><a href="https://www.correios.com.br/rastreamento" style="color: #4299e1; text-decoration: none;">🔗 Rastrear Pedido</a></p>
          </div>
          ` : ''}

        </div>

        <!-- Footer -->
        <div style="background-color: #2d3748; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0 0 10px 0;">💜 Nanda e Duda Kids - Roupas com Amor</p>
          <p style="margin: 0; opacity: 0.8; font-size: 14px;">
            Dúvidas? Responda este email ou entre em contato: ${EMAIL_CONFIG.supportEmail}
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

export { EMAIL_CONFIG }