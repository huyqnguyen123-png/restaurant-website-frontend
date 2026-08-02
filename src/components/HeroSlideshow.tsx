import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeroSlideshowProps {
  images: string[]
}

export default function HeroSlideshow({ images }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  if (images.length === 0) return null

  const goTo = (newIndex: number, dir: number) => {
    setDirection(dir)
    setIndex(((newIndex % images.length) + images.length) % images.length)
  }

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 60
    if (info.offset.x < -threshold) goTo(index + 1, 1)
    else if (info.offset.x > threshold) goTo(index - 1, -1)
  }

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setTimeout(() => {
      goTo(index + 1, 1)
    }, 5000)

    return () => clearTimeout(timer)
  }, [index, images.length])

  return (
    <div className="relative w-full h-full flex flex-col justify-between">
      <div className="relative w-full h-[90%] lg:aspect-[4/3] lg:h-auto lg:max-h-full overflow-hidden bg-[#0a0a0a]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            alt="Hero Slide"
            custom={direction}
            initial={{ x: direction >= 0 ? 60 : -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction >= 0 ? -60 : 60, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-6 flex items-center gap-4 z-20">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Go to image ${i + 1}`}
              className="flex items-center justify-center h-4"
            >
              <motion.div
                animate={{
                  width: i === index ? 48 : 8,
                  height: i === index ? 8 : 8,
                  backgroundColor: i === index ? '#CC1C1C' : '#4a4a4a',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="rounded-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}