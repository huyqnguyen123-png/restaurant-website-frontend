import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { MenuItem } from '../types/menu'

export interface CartItem {
  menuItemId: number
  nameEn: string
  nameDe: string | null
  price: number
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (menuItem: MenuItem, quantity: number) => void
  removeItem: (menuItemId: number) => void
  updateQuantity: (menuItemId: number, quantity: number) => void
  clearCart: () => void
  totalItemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Adding the same item again increases its quantity instead of creating a
  // duplicate row — mirrors the same "merge on re-add" behavior already
  // built into the POS app's order screen.
  const addItem = (menuItem: MenuItem, quantity: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id)
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          nameEn: menuItem.nameEn,
          nameDe: menuItem.nameDe,
          price: menuItem.price,
          quantity,
        },
      ]
    })
  }

  const removeItem = (menuItemId: number) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId))
  }

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(menuItemId)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => setItems([])

  const totalItemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}