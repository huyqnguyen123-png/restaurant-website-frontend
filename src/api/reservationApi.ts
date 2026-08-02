import { apiClient } from './client'
import type { CreateReservationRequest, Reservation } from '../types/reservation'

export const reservationApi = {
  create: async (request: CreateReservationRequest): Promise<Reservation> => {
    const response = await apiClient.post<Reservation>('/reservations', request)
    return response.data
  },
}