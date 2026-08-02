import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface MenuNavContextValue {
  categories: string[]
  activeCategory: string
  setCategories: (categories: string[]) => void
  setActiveCategory: (category: string) => void
  // True while the Menu page is mounted — lets the Sidebar know it should
  // show the category list instead of the main navigation.
  onMenuPage: boolean
  setOnMenuPage: (value: boolean) => void
}

const MenuNavContext = createContext<MenuNavContextValue | undefined>(undefined)

export function MenuNavProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [onMenuPage, setOnMenuPage] = useState(false)

  return (
    <MenuNavContext.Provider
      value={{ categories, activeCategory, setCategories, setActiveCategory, onMenuPage, setOnMenuPage }}
    >
      {children}
    </MenuNavContext.Provider>
  )
}

export function useMenuNav() {
  const context = useContext(MenuNavContext)
  if (!context) {
    throw new Error('useMenuNav must be used within a MenuNavProvider')
  }
  return context
}