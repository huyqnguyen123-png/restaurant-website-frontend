export interface MenuItem {
  id: number
  nameEn: string
  nameDe: string | null
  descriptionEn: string | null
  descriptionDe: string | null
  category: string | null
  imageUrl: string | null
  price: number
}