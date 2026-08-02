import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

// Updated stats to match the reference design
const STATS = [
  { value: '10+', key: 'experience' },
  { value: '50+', key: 'ingredients' },
  { value: '20K+', key: 'customers' },
  { value: '15+', key: 'specialties' },
] as const

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="relative w-full bg-[#0a0a0a] text-white py-16 lg:py-24 overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* Background Image Container with Left Fade Mask */}
      <motion.div
        initial={{ opacity: 0, filter: 'blur(16px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        // Occupies 1/2 of the width on large screens to give text more space
        className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0 opacity-30 lg:opacity-100"
        style={{
          // Fades the image to transparent on the left to blend seamlessly with the black background
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 60%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 60%)',
        }}
      >
        <img
          src="/download.jpg"
          alt={t('about.title')}
          className="w-full h-full object-cover object-center lg:object-right"
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 px-6 lg:px-16 max-w-7xl mx-auto w-full flex flex-col gap-16 lg:gap-24">
        
        {/* Text Content */}
        <div className="lg:w-1/2 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-600 font-bold text-sm lg:text-base mb-2 tracking-widest uppercase">
              {t('私たちの物語')}
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-8 tracking-wider uppercase text-white">
              {t('about.title', 'Our Story')}
            </h1>

            <div className="text-gray-400 leading-relaxed space-y-6">
              <p>{t('about.paragraph1')}</p>
              <p>{t('about.paragraph2')}</p>
              <p>{t('about.paragraph3')}</p>
              {/* Restored the missing 4th paragraph */}
              <p>{t('about.paragraph4')}</p>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pt-8 lg:border-t border-gray-800/60 lg:w-4/5">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="text-left"
            >
              <p className="font-display text-4xl lg:text-5xl text-red-600 font-bold mb-2">
                {stat.value}
              </p>
              <p className="text-xs lg:text-sm text-gray-500 uppercase tracking-widest font-semibold">
                {t(`about.stats.${stat.key}`)}
              </p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </div>
  )
}