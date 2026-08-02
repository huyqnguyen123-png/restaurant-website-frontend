import { apiClient } from './client'
import type { GalleryImage, GalleryCategory } from '../types/gallery'

export const galleryApi = {
  getAll: async (category?: GalleryCategory): Promise<GalleryImage[]> => {
    const params = category ? { category } : {}
    const response = await apiClient.get<GalleryImage[]>('/gallery', { params })
    return response.data
  },
}