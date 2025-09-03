"use client"

import { useState } from 'react'

interface EmailData {
  type: 'order_confirmation' | 'status_update' | 'pix_pending'
  orderData: any
  oldStatus?: string
  newStatus?: string
  pixData?: any
}

interface EmailResult {
  success: boolean
  message?: string
  error?: string
}

export function useEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendEmail = async (emailData: EmailData): Promise<EmailResult> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      const result = await response.json()

      if (response.ok) {
        return {
          success: true,
          message: result.message
        }
      } else {
        setError(result.error || 'Erro ao enviar email')
        return {
          success: false,
          error: result.error || 'Erro ao enviar email'
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setLoading(false)
    }
  }

  const sendOrderConfirmation = async (orderData: any) => {
    return sendEmail({
      type: 'order_confirmation',
      orderData
    })
  }

  const sendStatusUpdate = async (orderData: any, oldStatus: string, newStatus: string) => {
    return sendEmail({
      type: 'status_update',
      orderData,
      oldStatus,
      newStatus
    })
  }

  const sendPixPending = async (orderData: any, pixData: any) => {
    return sendEmail({
      type: 'pix_pending',
      orderData,
      pixData
    })
  }

  return {
    sendEmail,
    sendOrderConfirmation,
    sendStatusUpdate,
    sendPixPending,
    loading,
    error
  }
}