export interface CreateReservationRequest {
  customerName: string
  phone: string
  reservationDate: string // "2026-08-05"
  reservationTime: string // "19:30:00"
  partySize: number
  notes?: string
}

export interface Reservation {
  id: number
  customerName: string
  phone: string
  reservationDate: string
  reservationTime: string
  partySize: number
  notes: string | null
  createdAt: string
}