import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { galleryApi } from '../api/galleryApi'
import type { GalleryImage, GalleryCategory } from '../types/gallery'

const CATEGORIES: { key: GalleryCategory | 'all'; labelKey: string }[] = [
  { key: 'all', labelKey: 'gallery.categories.all' },
  { key: 'FOOD', labelKey: 'gallery.categories.food' },
  { key: 'RESTAURANT', labelKey: 'gallery.categories.restaurant' },
  { key: 'CHEFS', labelKey: 'gallery.categories.chefs' },
  { key: 'EVENTS', labelKey: 'gallery.categories.events' },
]

export default function Gallery() {
  const { t } = useTranslation()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all')
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    galleryApi
      .getAll()
      .then(setImages)
      .finally(() => setLoading(false))
  }, [])

  const filteredImages =
    activeCategory === 'all' ? images : images.filter((img) => img.category === activeCategory)

  if (loading) {
    return <div className="px-4 lg:px-12 py-12 text-gray-400">Loading...</div>
  }

  return (
    <div className="px-4 lg:px-12 py-6 lg:py-12">
      <h1 className="font-display text-3xl lg:text-4xl mb-4 lg:mb-8">{t('gallery.title')}</h1>

      <div className="flex gap-2 mb-6 lg:mb-8 -mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto no-scrollbar lg:flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 px-4 h-10 rounded text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.key ? 'bg-primary text-white' : 'bg-surface text-gray-300 hover:text-white'
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4"
        >
          {filteredImages.map((img, index) => (
            <motion.button
              key={img.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.03 }}
              onClick={() => setLightboxImage(img.imageUrl)}
              className="aspect-square bg-surface border border-border-subtle rounded-lg overflow-hidden"
            >
              <img
                src={img.imageUrl}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.button>
          ))}
          {filteredImages.length === 0 && (
            <p className="col-span-full text-gray-500 text-center py-12">No images in this category yet.</p>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightboxImage}
              alt=""
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}