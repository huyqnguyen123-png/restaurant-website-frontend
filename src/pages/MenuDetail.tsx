import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { menuApi } from '../api/menuApi'
import type { MenuItem } from '../types/menu'
import { useCart } from '../context/CartContext'

export default function MenuDetail() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [item, setItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!id) return
    menuApi
      .getById(Number(id))
      .then(setItem)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="px-4 lg:px-12 py-12 text-gray-400">Loading...</div>
  }

  if (!item) {
    return <div className="px-4 lg:px-12 py-12 text-gray-400">Item not found.</div>
  }

  const displayName = i18n.language === 'de' && item.nameDe ? item.nameDe : item.nameEn
  const displayDescription =
    i18n.language === 'de' && item.descriptionDe ? item.descriptionDe : item.descriptionEn

  const handleAddToOrder = () => {
    addItem(item, quantity)
    navigate('/menu')
  }

  return (
    <div className="px-4 lg:px-12 pt-4 pb-32 lg:py-12">
      <Link to="/menu" className="text-sm text-gray-400 hover:text-white mb-4 lg:mb-6 inline-flex items-center h-10">
        ← {t('menu.backToMenu')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <div className="aspect-[4/3] sm:aspect-square bg-surface border border-border-subtle rounded-lg flex items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 text-sm">No image</span>
            )}
          </div>
        </div>

        <div>
          <h1 className="font-display text-2xl sm:text-3xl mb-2">{displayName}</h1>
          <p className="text-primary text-2xl font-bold mb-6">€{item.price.toFixed(2)}</p>

          {displayDescription && (
            <div className="mb-8">
              <p className="text-primary text-sm font-semibold mb-2">{t('menu.ingredients')}</p>
              <p className="text-gray-400">{displayDescription}</p>
            </div>
          )}

          {/* On phones the quantity stepper and button are pinned to the
              bottom of the screen so they're always within thumb reach. */}
          <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-xl border-t border-border-subtle lg:static lg:z-auto lg:block lg:p-0 lg:bg-transparent lg:backdrop-blur-none lg:border-0">
            <p className="hidden lg:block text-sm text-gray-400 mb-2">{t('menu.quantity')}</p>
            <div className="flex items-center gap-2 lg:gap-4 lg:mb-8 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-11 h-11 rounded bg-surface border border-border-subtle text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-11 h-11 rounded bg-surface border border-border-subtle text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToOrder}
              className="flex-1 lg:flex-none w-full lg:w-auto min-h-12 bg-primary hover:bg-primary-dark transition-colors text-sm lg:text-base leading-tight font-semibold px-3 lg:px-8 py-2 rounded"
            >
              {t('menu.addToOrder')} · €{(item.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}