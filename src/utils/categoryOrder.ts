export const CATEGORY_ORDER = [
  'Starters',
  'Salads',
  'Soups',
  'Wok',
  'Maki',
  'Nigiri',
  'Inside Out Rolls',
  'Crunchy Rolls',
  'Special Rolls',
  'Sashimi',
  'Combos',
  'Drinks',
  'Softdrink',
  'Beer',
  'Longdrink',
  'Wine',
  'Shot',
  'Sweets',
]

export function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a)
    const indexB = CATEGORY_ORDER.indexOf(b)
    const rankA = indexA === -1 ? CATEGORY_ORDER.length : indexA
    const rankB = indexB === -1 ? CATEGORY_ORDER.length : indexB
    return rankA - rankB
  })
}