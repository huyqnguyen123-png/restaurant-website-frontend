export interface Shift {
  open: string // "11:00"
  close: string // "15:00"
}

// JS Date.getDay() convention: 0 = Sunday, 1 = Monday, ... 6 = Saturday.
// Single source of truth for opening hours — shared by the Reservation page
// now, and will be reused by the Cart/Checkout pickup-time picker later.
// European convention: 0 = Monday, 1 = Tuesday, ... 6 = Sunday. Note this is
// DIFFERENT from JS's native Date.getDay() (which returns 0 for Sunday) —
// use jsDayToMondayFirst() below to convert before looking up this table.
const SHIFTS_BY_DAY: Record<number, Shift[]> = {
  0: [], // Monday — closed
  1: [
    { open: '11:00', close: '15:00' },
    { open: '17:00', close: '22:00' },
  ], // Tuesday
  2: [
    { open: '11:00', close: '15:00' },
    { open: '17:00', close: '22:00' },
  ], // Wednesday
  3: [
    { open: '11:00', close: '15:00' },
    { open: '17:00', close: '22:00' },
  ], // Thursday
  4: [{ open: '11:00', close: '22:00' }], // Friday
  5: [{ open: '11:00', close: '22:00' }], // Saturday
  6: [{ open: '12:00', close: '22:00' }], // Sunday
}

// Converts JS's Date.getDay() (0 = Sunday) to the Monday-first convention
// used by SHIFTS_BY_DAY above (0 = Monday).
function jsDayToMondayFirst(jsDay: number): number {
  return (jsDay + 6) % 7
}

const RESERVATION_TIME_STEP_MINUTES = 30
const RESERVATION_CLOSING_BUFFER_MINUTES = 30

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function getShiftsForDate(dateStr: string): Shift[] {
  const date = new Date(`${dateStr}T00:00:00`)
  return SHIFTS_BY_DAY[jsDayToMondayFirst(date.getDay())] ?? []
}

export function isClosedOnDate(dateStr: string): boolean {
  return getShiftsForDate(dateStr).length === 0
}

// Generates valid reservation time slots for a given date, stopping 30
// minutes before each shift's closing time.
export function getReservationTimeOptions(dateStr: string): string[] {
  const shifts = getShiftsForDate(dateStr)
  const options: string[] = []

  for (const shift of shifts) {
    const openMinutes = timeToMinutes(shift.open)
    const closeMinutes = timeToMinutes(shift.close)
    const latestStart = closeMinutes - RESERVATION_CLOSING_BUFFER_MINUTES

    for (let m = openMinutes; m <= latestStart; m += RESERVATION_TIME_STEP_MINUTES) {
      options.push(minutesToTime(m))
    }
  }

  return options
}

export function formatDateDDMMYYYY(isoDate: string): string {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

const PICKUP_TIME_STEP_MINUTES = 15
const PICKUP_MIN_LEAD_MINUTES = 20
const PICKUP_CLOSING_BUFFER_MINUTES = 15

function todayIso(): string {
  return new Date().toISOString().split('T')[0]
}

// Generates valid pickup time slots for a given date — within the day's
// shifts, and additionally excludes any slot less than 20 minutes from now
// if the selected date is today (matches the same rule enforced server-side).
export function getPickupTimeOptions(dateStr: string): string[] {
  const shifts = getShiftsForDate(dateStr)
  const options: string[] = []
  const isToday = dateStr === todayIso()

  let earliestMinutesToday = 0
  if (isToday) {
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + PICKUP_MIN_LEAD_MINUTES
    earliestMinutesToday = Math.ceil(nowMinutes / PICKUP_TIME_STEP_MINUTES) * PICKUP_TIME_STEP_MINUTES
  }

  for (const shift of shifts) {
    const openMinutes = timeToMinutes(shift.open)
    const latestPickupMinutes = timeToMinutes(shift.close) - PICKUP_CLOSING_BUFFER_MINUTES

    for (let m = openMinutes; m <= latestPickupMinutes; m += PICKUP_TIME_STEP_MINUTES) {
      if (isToday && m < earliestMinutesToday) continue
      options.push(minutesToTime(m))
    }
  }

  return options
}