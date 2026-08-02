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
    <div className="px-4 lg:px-12 py-6 lg:py-12">
      <Link to="/menu" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
        ← {t('menu.backToMenu')}
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="aspect-square bg-surface border border-border-subtle rounded-lg flex items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 text-sm">No image</span>
            )}
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl mb-2">{displayName}</h1>
          <p className="text-primary text-2xl font-bold mb-6">€{item.price.toFixed(2)}</p>

          {displayDescription && (
            <div className="mb-8">
              <p className="text-primary text-sm font-semibold mb-2">{t('menu.ingredients')}</p>
              <p className="text-gray-400">{displayDescription}</p>
            </div>
          )}

          <p className="text-sm text-gray-400 mb-2">{t('menu.quantity')}</p>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded bg-surface border border-border-subtle text-lg"
            >
              −
            </button>
            <span className="text-lg font-semibold w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded bg-surface border border-border-subtle text-lg"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToOrder}
            className="w-full lg:w-auto bg-primary hover:bg-primary-dark transition-colors font-semibold px-8 py-3 rounded"
          >
            {t('menu.addToOrder')}
          </button>
        </div>
      </div>
    </div>
  )
}