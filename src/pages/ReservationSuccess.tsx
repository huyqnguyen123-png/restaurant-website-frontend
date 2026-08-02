import { Link, useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDateDDMMYYYY } from '../utils/businessHours'

interface LocationState {
  customerName: string
  date: string
  time: string
  partySize: number
}

export default function ReservationSuccess() {
  const { t } = useTranslation()
  const location = useLocation()
  const state = location.state as LocationState | undefined

  // If someone lands here directly (no state passed — e.g. refreshed the
  // page or pasted the URL), there's no reservation detail to show, so send
  // them back to make a fresh booking instead of a broken confirmation page.
  if (!state) {
    return <Navigate to="/reservation" replace />
  }

  return (
    <div className="px-4 lg:px-12 py-16 lg:py-24 max-w-xl text-center mx-auto">
      <div className="text-5xl mb-6">✓</div>
      <h1 className="font-display text-3xl lg:text-4xl mb-4">{t('bookingSuccess.title')}</h1>
      <p className="text-gray-400 mb-8">{t('bookingSuccess.message')}</p>

      <div className="bg-surface border border-border-subtle rounded-lg p-6 text-left mb-8">
        <p className="text-sm text-gray-400 mb-1">{t('reservation.fullName')}</p>
        <p className="font-semibold mb-4">{state.customerName}</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">{t('reservation.date')}</p>
            <p className="font-semibold">{formatDateDDMMYYYY(state.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">{t('reservation.time')}</p>
            <p className="font-semibold">{state.time}</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-4 mb-1">{t('reservation.guests')}</p>
        <p className="font-semibold">{state.partySize}</p>
      </div>

      <Link
        to="/"
        className="inline-block bg-primary hover:bg-primary-dark transition-colors font-semibold px-6 py-3 rounded"
      >
        {t('bookingSuccess.backToHome')}
      </Link>
    </div>
  )
}