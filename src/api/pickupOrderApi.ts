import { apiClient } from './client'
import type { CreatePickupOrderRequest, PickupOrderResponse } from '../types/pickupOrder'

export const pickupOrderApi = {
  create: async (request: CreatePickupOrderRequest): Promise<PickupOrderResponse> => {
    const response = await apiClient.post<PickupOrderResponse>('/pickup-orders', request)
    return response.data
  },
}