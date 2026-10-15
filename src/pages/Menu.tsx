import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { menuApi } from '../api/menuApi'
import type { MenuItem } from '../types/menu'
import { useMenuNav } from '../context/MenuNavContext'
import { sortCategories } from '../utils/categoryOrder'
import { useCart } from '../context/CartContext'

interface MenuProps {
  // 'view': browse-only menu (no ordering). 'order': same list with add
  // buttons, item detail links and the cart bar.
  mode?: 'view' | 'order'
}

export default function Menu({ mode = 'view' }: MenuProps) {
  const ordering = mode === 'order'
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const { categories, activeCategory, setCategories, setActiveCategory, setOnMenuPage } = useMenuNav()
  const { addItem, totalItemCount, subtotal } = useCart()

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

  const displayDescription = (item: MenuItem) =>
    i18n.language === 'de' && item.descriptionDe ? item.descriptionDe : item.descriptionEn

  if (loading) {
    return <div className="px-4 lg:px-12 py-12 text-gray-400">Loading...</div>
  }

  const categoryOptions = [
    { key: 'all', label: t('menu.categories.all') },
    ...categories.map((c) => ({ key: c, label: c })),
  ]

  return (
    <div className={`px-4 lg:px-12 py-6 lg:py-12 ${ordering && totalItemCount > 0 ? 'pb-28 lg:pb-12' : ''}`}>
      <h1 className="font-display text-3xl lg:text-4xl mb-4 lg:mb-8">
        {ordering ? t('order.title') : t('menu.title')}
      </h1>

      {/* Category chips — phones/tablets only; on desktop the sidebar shows
          the same list. Sticks just below the 56px mobile header. */}
      <div className="lg:hidden sticky top-14 z-30 -mx-4 px-4 py-3 mb-4 bg-background/95 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {categoryOptions.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`shrink-0 px-4 h-10 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.key ? 'bg-primary text-white' : 'bg-surface text-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03, ease: 'easeOut' }}
            >
              <div
                className={`relative h-full bg-surface border border-border-subtle rounded-lg overflow-hidden ${
                  ordering ? 'hover:border-primary transition-colors' : ''
                }`}
              >
                {ordering ? (
                  <Link to={`/order/${item.id}`} className="block">
                    <MenuCardBody item={item} name={displayName(item)} />
                  </Link>
                ) : (
                  <MenuCardBody item={item} name={displayName(item)} description={displayDescription(item)} />
                )}

                {ordering && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      addItem(item, 1)
                    }}
                    aria-label="Add to cart"
                    className="absolute top-2 right-2 w-10 h-10 rounded-full bg-primary hover:bg-primary-dark active:scale-90 transition flex items-center justify-center text-white text-lg font-bold shadow-lg z-10"
                  >
                    +
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <p className="col-span-full text-gray-500 text-center py-12">No items in this category yet.</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Mobile cart bar — keeps the order one tap away while browsing. */}
      {ordering && totalItemCount > 0 && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background/95 to-transparent">
          <Link
            to="/cart"
            className="flex items-center justify-between w-full h-14 px-5 rounded-lg bg-primary active:bg-primary-dark text-white font-semibold shadow-lg shadow-black/40"
          >
            <span className="flex items-center gap-3">
              <span className="min-w-7 h-7 px-2 rounded-full bg-white/20 flex items-center justify-center text-sm">
                {totalItemCount}
              </span>
              {t('menu.viewCart')}
            </span>
            <span>€{subtotal.toFixed(2)}</span>
          </Link>
        </div>
      )}
    </div>
  )
}

function MenuCardBody({ item, name, description }: { item: MenuItem; name: string; description?: string | null }) {
  return (
    <>
      <div className="aspect-square bg-surface-light flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-600 text-xs">No image</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold mb-1 line-clamp-2 min-h-10">{name}</p>
        {description && <p className="text-xs text-gray-400 mb-2 line-clamp-3">{description}</p>}
        <p className="text-primary font-bold">€{item.price.toFixed(2)}</p>
      </div>
    </>
  )
}