"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface CustomerData {
  name: string
  email: string
  phone: string
  cpf: string
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface PaymentMethod {
  type: 'pix' | 'credit' | 'debit'
  installments?: number
}

export interface CardData {
  number: string
  holderName: string
  expiryDate: string
  cvv: string
}

interface CheckoutState {
  step: 'customer' | 'payment' | 'confirmation'
  customerData: CustomerData
  address: Address
  paymentMethod: PaymentMethod | null
  cardData: CardData | null
  isProcessing: boolean
  orderId: string | null
}

type CheckoutAction =
  | { type: 'SET_STEP'; payload: CheckoutState['step'] }
  | { type: 'SET_CUSTOMER_DATA'; payload: CustomerData }
  | { type: 'SET_ADDRESS'; payload: Address }
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_CARD_DATA'; payload: CardData }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_ORDER_ID'; payload: string }
  | { type: 'RESET_CHECKOUT' }

const initialState: CheckoutState = {
  step: 'customer',
  customerData: {
    name: '',
    email: '',
    phone: '',
    cpf: ''
  },
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  },
  paymentMethod: null,
  cardData: null,
  isProcessing: false,
  orderId: null
}

const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload }
    
    case 'SET_CUSTOMER_DATA':
      return { ...state, customerData: action.payload }
    
    case 'SET_ADDRESS':
      return { ...state, address: action.payload }
    
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload }
    
    case 'SET_CARD_DATA':
      return { ...state, cardData: action.payload }
    
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload }
    
    case 'SET_ORDER_ID':
      return { ...state, orderId: action.payload }
    
    case 'RESET_CHECKOUT':
      return initialState
    
    default:
      return state
  }
}

interface CheckoutContextType {
  state: CheckoutState
  setStep: (step: CheckoutState['step']) => void
  setCustomerData: (data: CustomerData) => void
  setAddress: (address: Address) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setCardData: (data: CardData) => void
  setProcessing: (processing: boolean) => void
  setOrderId: (orderId: string) => void
  resetCheckout: () => void
  isStepValid: (step: CheckoutState['step']) => boolean
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckout deve ser usado dentro de um CheckoutProvider')
  }
  return context
}

interface CheckoutProviderProps {
  children: React.ReactNode
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState)

  const setStep = (step: CheckoutState['step']) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }

  const setCustomerData = (data: CustomerData) => {
    dispatch({ type: 'SET_CUSTOMER_DATA', payload: data })
  }

  const setAddress = (address: Address) => {
    dispatch({ type: 'SET_ADDRESS', payload: address })
  }

  const setPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })
  }

  const setCardData = (data: CardData) => {
    dispatch({ type: 'SET_CARD_DATA', payload: data })
  }

  const setProcessing = (processing: boolean) => {
    dispatch({ type: 'SET_PROCESSING', payload: processing })
  }

  const setOrderId = (orderId: string) => {
    dispatch({ type: 'SET_ORDER_ID', payload: orderId })
  }

  const resetCheckout = () => {
    dispatch({ type: 'RESET_CHECKOUT' })
  }

  const isStepValid = (step: CheckoutState['step']): boolean => {
    switch (step) {
      case 'customer':
        return (
          state.customerData.name !== '' &&
          state.customerData.email !== '' &&
          state.customerData.phone !== '' &&
          state.customerData.cpf !== '' &&
          state.address.street !== '' &&
          state.address.number !== '' &&
          state.address.neighborhood !== '' &&
          state.address.city !== '' &&
          state.address.state !== '' &&
          state.address.zipCode !== ''
        )
      
      case 'payment':
        if (!state.paymentMethod) return false
        if (state.paymentMethod.type === 'pix') return true
        return state.cardData !== null &&
               state.cardData.number !== '' &&
               state.cardData.holderName !== '' &&
               state.cardData.expiryDate !== '' &&
               state.cardData.cvv !== ''
      
      case 'confirmation':
        return state.orderId !== null
      
      default:
        return false
    }
  }

  const value: CheckoutContextType = {
    state,
    setStep,
    setCustomerData,
    setAddress,
    setPaymentMethod,
    setCardData,
    setProcessing,
    setOrderId,
    resetCheckout,
    isStepValid
  }

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}