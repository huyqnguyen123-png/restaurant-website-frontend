import { useTranslation } from 'react-i18next'
import { getShiftsForDate } from '../utils/businessHours'

// Reuses the same SHIFTS_BY_DAY data that already powers the Reservation
// page's time picker — so the hours shown here can never drift out of
// sync with the hours actually enforced when booking.
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// A fixed reference date for each day of the week (Jan 4-10, 2026 happens
// to be a Sun-Sat week) — only the day-of-week is used, the actual date is
// irrelevant since business hours don't vary by specific date.
const REFERENCE_DATES = [
  '2026-01-04', // Sunday
  '2026-01-05', // Monday
  '2026-01-06', // Tuesday
  '2026-01-07', // Wednesday
  '2026-01-08', // Thursday
  '2026-01-09', // Friday
  '2026-01-10', // Saturday
]

export default function OpeningHoursList() {
  const { t } = useTranslation()

  return (
    <ul className="flex flex-col gap-1.5">
      {DAY_KEYS.map((dayKey, index) => {
        const shifts = getShiftsForDate(REFERENCE_DATES[index])
        return (
          <li key={dayKey} className="flex justify-between text-sm gap-4">
            <span className="text-gray-400">{t(`days.${dayKey}`)}</span>
            <span className="font-medium text-right">
              {shifts.length === 0
                ? t('days.closed')
                : shifts.map((s) => `${s.open}–${s.close}`).join(', ')}
            </span>
          </li>
        )
      })}
    </ul>
  )
}