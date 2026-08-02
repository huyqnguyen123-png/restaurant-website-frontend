import { apiClient } from './client'
import type { MenuItem } from '../types/menu'

export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get<MenuItem[]>('/menu')
    return response.data
  },

  getById: async (id: number): Promise<MenuItem> => {
    const response = await apiClient.get<MenuItem>(`/menu/${id}`)
    return response.data
  },
}