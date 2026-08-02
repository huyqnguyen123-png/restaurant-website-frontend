import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { menuApi } from '../api/menuApi'
import type { MenuItem } from '../types/menu'
import { useMenuNav } from '../context/MenuNavContext'
import { sortCategories } from '../utils/categoryOrder'
import { useCart } from '../context/CartContext'

export default function Menu() {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const { activeCategory, setCategories, setActiveCategory, setOnMenuPage } = useMenuNav()
  const { addItem } = useCart()

  useEffect(() => {
    menuApi
      .getAll()
      .then((data) => {
        setItems(data)
        const uniqueCategories = Array.from(
          new Set(data.map((i) => i.category).filter((c): c is string => !!c))
        )
        setCategories(sortCategories(uniqueCategories))
      })
      .finally(() => setLoading(false))
  }, [setCategories])

  useEffect(() => {
    setOnMenuPage(true)
    setActiveCategory('all')
    return () => setOnMenuPage(false)
  }, [setOnMenuPage, setActiveCategory])

  const filteredItems =
    activeCategory === 'all' ? items : items.filter((i) => i.category === activeCategory)

  const displayName = (item: MenuItem) =>
    i18n.language === 'de' && item.nameDe ? item.nameDe : item.nameEn

  if (loading) {
    return <div className="px-4 lg:px-12 py-12 text-gray-400">Loading...</div>
  }

  return (
    <div className="px-4 lg:px-12 py-6 lg:py-12">
      <h1 className="font-display text-3xl lg:text-4xl mb-8">{t('menu.title')}</h1>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03, ease: 'easeOut' }}
            >
              <div className="relative bg-surface border border-border-subtle rounded-lg overflow-hidden hover:border-primary transition-colors">
                <Link to={`/menu/${item.id}`} className="block">
                  <div className="aspect-square bg-surface-light flex items-center justify-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={displayName(item)} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-600 text-xs">No image</span>
                    )}
                  </div>
                  <div className="p-3 pr-10">
                    <p className="text-sm font-semibold mb-1 truncate">{displayName(item)}</p>
                    <p className="text-primary font-bold">€{item.price.toFixed(2)}</p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addItem(item, 1)
                  }}
                  aria-label="Add to cart"
                  className="absolute top-4 right-5 w-8 h-8 rounded-full bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center text-white text-base font-bold shadow-lg z-10"
                >
                  +
                </button>
              </div>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full text-gray-500 text-center py-12">No items in this category yet.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}