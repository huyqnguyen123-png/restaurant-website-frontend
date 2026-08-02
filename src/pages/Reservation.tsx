import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { reservationApi } from '../api/reservationApi'
import { getReservationTimeOptions, isClosedOnDate, formatDateDDMMYYYY } from '../utils/businessHours'
import { isValidPhone } from '../utils/validation'

function todayIsoDate(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

export default function ReservationPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

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

  const closed = date !== '' && isClosedOnDate(date)
  const timeOptions = date !== '' && !closed ? getReservationTimeOptions(date) : []

  useEffect(() => {
    setTime('')
  }, [date])

  const phoneValid = isValidPhone(phone)

  const isValid =
    customerName.trim() !== '' &&
    phoneValid &&
    date !== '' &&
    !closed &&
    time !== '' &&
    partySize >= 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setSubmitting(true)
    setError(null)

    try {
      await reservationApi.create({
        customerName: customerName.trim(),
        phone: phone.trim(),
        reservationDate: date,
        reservationTime: `${time}:00`,
        partySize,
        notes: notes.trim() || undefined,
      })
      navigate('/reservation/success', {
        state: { customerName, date, time, partySize },
      })
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black px-6 lg:px-16 pt-12 lg:pt-20 pb-16 flex items-center">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 max-w-6xl mx-auto items-center w-full">

        <div className="text-left self-center -translate-y-8 lg:-translate-y-12">
          <p className="text-[#CC1C1C] text-sm tracking-[0.25em] font-medium mb-4 uppercase">
            予約する
          </p>
          <h1 
            className="text-white text-5xl lg:text-[4rem] leading-[1.1] mb-8 uppercase tracking-wide max-w-md"
            style={{ 
              fontFamily: '"Oswald", "Bebas Neue", "Arial Narrow", sans-serif',
              fontStretch: 'condensed'
            }}
          >
            {t('reservation.title')}
          </h1>
          <p className="text-[#9ca3af] max-w-sm text-[15px] leading-relaxed">
            {t('reservation.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
              {t('reservation.fullName')}
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={t('reservation.fullNamePlaceholder') ?? ''}
              className="w-full bg-surface border border-border-subtle rounded px-5 py-4 text-base focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
              {t('reservation.phone')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('reservation.phonePlaceholder') ?? ''}
              className="w-full bg-surface border border-border-subtle rounded px-5 py-4 text-base focus:outline-none focus:border-primary"
              required
            />
            {phone.trim() !== '' && !phoneValid && (
              <p className="text-xs text-red-500 mt-1.5">
                {t('reservation.invalidPhone') ?? 'Please enter a valid phone number.'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                {t('reservation.date')}
              </label>
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
                  className="relative z-10 w-full bg-surface border border-border-subtle rounded px-5 py-4 text-base text-left focus:outline-none focus:border-primary flex items-center justify-between"
                >
                  <span className={date ? 'text-white' : 'text-gray-500'}>
                    {date ? formatDateDDMMYYYY(date) : 'Select date'}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {closed && (
                <p className="text-xs text-red-500 mt-1.5 font-medium">{t('reservation.closedOnDate')}</p>
              )}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
                {t('reservation.time')}
              </label>
              <div className="relative">
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!date || closed}
                  className="w-full bg-surface border border-border-subtle rounded px-5 py-4 text-base appearance-none focus:outline-none focus:border-primary disabled:opacity-50"
                  required
                >
                  <option value="">Select time</option>
                  {timeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <svg
                  className="w-5 h-5 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
              {t('reservation.guests')}
            </label>
            <div className="flex items-center justify-between bg-surface border border-border-subtle rounded px-5 py-3.5">
              <button
                type="button"
                onClick={() => setPartySize((n) => Math.max(1, n - 1))}
                className="w-9 h-9 rounded-full border border-border-subtle hover:border-primary transition-colors flex items-center justify-center text-lg text-gray-300 hover:text-white"
                aria-label="Decrease guests"
              >
                −
              </button>
              <span className="text-lg font-medium tabular-nums">{partySize}</span>
              <button
                type="button"
                onClick={() => setPartySize((n) => n + 1)}
                className="w-9 h-9 rounded-full border border-border-subtle hover:border-primary transition-colors flex items-center justify-center text-lg text-gray-300 hover:text-white"
                aria-label="Increase guests"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide">
              {t('reservation.notes') ?? 'Notes'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('reservation.notesPlaceholder') ?? 'Special requests (optional)'}
              rows={3}
              className="w-full bg-surface border border-border-subtle rounded px-5 py-4 text-base focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full bg-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium uppercase tracking-wide text-sm py-5 rounded transition mt-2"
          >
            {submitting ? 'Submitting...' : t('reservation.submit') ?? 'Book Table'}
          </button>
        </form>

      </div>
    </div>
  )
}