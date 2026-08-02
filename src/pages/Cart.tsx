import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { pickupOrderApi } from '../api/pickupOrderApi'
import { getPickupTimeOptions, isClosedOnDate, formatDateDDMMYYYY } from '../utils/businessHours'
import { isValidPhone } from '../utils/validation'

function todayIsoDate(): string {
  return new Date().toISOString().split('T')[0]
}

export default function Cart() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart()

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const closed = date !== '' && isClosedOnDate(date)
  const timeOptions = date !== '' && !closed ? getPickupTimeOptions(date) : []

  useEffect(() => {
    setTime('')
  }, [date])

  const openDatePicker = () => {
    const input = dateInputRef.current
    if (!input) return
    input.focus()
    try {
      input.showPicker?.()
    } catch {
      input.click()
    }
  }

  const displayName = (item: { nameEn: string; nameDe: string | null }) =>
    i18n.language === 'de' && item.nameDe ? item.nameDe : item.nameEn

  const phoneValid = isValidPhone(phone)

  const isValid =
    items.length > 0 &&
    customerName.trim() !== '' &&
    phoneValid &&
    date !== '' &&
    !closed &&
    time !== ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setSubmitting(true)
    setError(null)

    try {
      const response = await pickupOrderApi.create({
        customerName: customerName.trim(),
        phone: phone.trim(),
        pickupTime: `${date}T${time}:00`,
        items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        notes: notes.trim() || undefined,
      })
      clearCart()
      navigate('/cart/success', {
        state: {
          customerName,
          date,
          time,
          total: response.totalAmount,
        },
      })
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="px-4 lg:px-12 py-16 lg:py-24 text-center">
        <p className="text-gray-400 mb-6">{t('cart.empty')}</p>
        <Link
          to="/menu"
          className="inline-block bg-primary hover:bg-primary-dark transition-colors font-semibold px-6 py-3 rounded"
        >
          {t('cart.backToMenu')}
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-12 py-6 lg:py-12">
      <h1 className="font-display text-3xl lg:text-4xl mb-8">{t('cart.yourOrder')}</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.menuItemId}
              className="flex items-center justify-between gap-3 bg-surface border border-border-subtle rounded-lg p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{displayName(item)}</p>
                <p className="text-primary text-sm font-bold">€{item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                  className="w-7 h-7 rounded bg-surface-light border border-border-subtle text-sm"
                >
                  −
                </button>
                <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                  className="w-7 h-7 rounded bg-surface-light border border-border-subtle text-sm"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.menuItemId)}
                className="text-gray-500 hover:text-red-400 text-xs shrink-0"
              >
                {t('cart.remove')}
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center border-t border-border-subtle pt-4 mt-2">
            <span className="text-gray-400">{t('cart.total')}</span>
            <span className="text-xl font-bold text-primary">€{subtotal.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{t('cart.fullName')}</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('cart.fullNamePlaceholder') ?? ''}
              className="w-full bg-surface border border-border-subtle rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{t('cart.phone')}</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('cart.phonePlaceholder') ?? ''}
              className="w-full bg-surface border border-border-subtle rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
              required
            />
            {phone.trim() !== '' && !phoneValid && (
              <p className="text-xs text-red-500 mt-1.5">{t('cart.invalidPhone')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t('cart.pickupDate')}</label>
              <div className="relative">
                <input
                  ref={dateInputRef}
                  type="date"
                  value={date}
                  min={todayIsoDate()}
                  onChange={(e) => setDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                  required
                  tabIndex={-1}
                />
                <button
                  type="button"
                  onClick={openDatePicker}
                  className="relative z-10 w-full bg-surface border border-border-subtle rounded px-4 py-2.5 text-sm text-left focus:outline-none focus:border-primary flex items-center justify-between"
                >
                  <span className={date ? 'text-white' : 'text-gray-500'}>
                    {date ? formatDateDDMMYYYY(date) : 'dd/mm/yyyy'}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{t('cart.pickupTime')}</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={date === '' || closed}
                className="w-full bg-surface border border-border-subtle rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary disabled:opacity-40"
                required
              >
                <option value="" disabled>
                  {t('cart.timePlaceholder')}
                </option>
                {timeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {closed && <p className="text-xs text-red-500 -mt-2 font-medium">{t('cart.closedThisDay')}</p>}

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{t('cart.notes')}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('cart.notesPlaceholder') ?? ''}
              rows={3}
              className="w-full bg-surface border border-border-subtle rounded px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="bg-primary hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold px-6 py-3 rounded"
          >
            {submitting ? '...' : t('cart.placeOrder')}
          </button>
        </form>
      </div>
    </div>
  )
}