import { Link, useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDateDDMMYYYY } from '../utils/businessHours'

interface LocationState {
  customerName: string
  date: string
  time: string
  total: number
}

export default function CartSuccess() {
  const { t } = useTranslation()
  const location = useLocation()
  const state = location.state as LocationState | undefined

  if (!state) {
    return <Navigate to="/menu" replace />
  }

  return (
    <div className="px-4 lg:px-12 py-16 lg:py-24 max-w-xl text-center mx-auto">
      <div className="text-5xl mb-6">✓</div>
      <h1 className="font-display text-3xl lg:text-4xl mb-4">{t('orderSuccess.title')}</h1>
      <p className="text-gray-400 mb-8">{t('orderSuccess.message')}</p>

      <div className="bg-surface border border-border-subtle rounded-lg p-6 text-left mb-8">
        <p className="text-sm text-gray-400 mb-1">{t('cart.fullName')}</p>
        <p className="font-semibold mb-4">{state.customerName}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">{t('cart.pickupDate')}</p>
            <p className="font-semibold">{formatDateDDMMYYYY(state.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">{t('cart.pickupTime')}</p>
            <p className="font-semibold">{state.time}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-4 mb-1">{t('cart.total')}</p>
        <p className="font-semibold text-primary">€{state.total.toFixed(2)}</p>
      </div>

      <Link
        to="/"
        className="inline-block bg-primary hover:bg-primary-dark transition-colors font-semibold px-6 py-3 rounded"
      >
        {t('orderSuccess.backToHome')}
      </Link>
    </div>
  )
}