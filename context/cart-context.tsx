"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface Product {
  id: number
  name: string
  price: string
  image: string
  alt: string
  category: string
}

export interface CartItem extends Product {
  quantity: number
  size?: string
}

interface CartState {
  items: CartItem[]
  total: number
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Product & { size?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.size === action.payload.size
      )

      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        }
      } else {
        const newItem: CartItem = {
          ...action.payload,
          quantity: 1
        }
        const updatedItems = [...state.items, newItem]
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        }
      }
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      }
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      }

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true
      }

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false
      }

    default:
      return state
  }
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'))
    return total + (price * item.quantity)
  }, 0)
}

interface CartContextType {
  state: CartState
  addToCart: (product: Product, size?: string) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isOpen: false
  })

  // Carregar carrinho do localStorage quando o componente monta
  useEffect(() => {
    const savedCart = localStorage.getItem('nanda-duda-cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        cartData.items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_TO_CART', payload: item })
        })
      } catch (error) {
        console.error('Erro ao carregar carrinho do localStorage:', error)
      }
    }
  }, [])

  // Salvar carrinho no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('nanda-duda-cart', JSON.stringify(state))
  }, [state])

  const addToCart = (product: Product, size?: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, size } })
  }

  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getItemCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}