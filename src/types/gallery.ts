export type GalleryCategory = 'FOOD' | 'RESTAURANT' | 'CHEFS' | 'EVENTS'

export interface GalleryImage {
  id: number
  imageUrl: string
  category: GalleryCategory
  displayOrder: number
}