import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

// Placeholder figures — replace with the restaurant's real numbers.
const STATS = [
  { value: '5+', key: 'experience' },
  { value: '50+', key: 'ingredients' },
  { value: '1000+', key: 'customers' },
  { value: '100+', key: 'specialties' },
] as const

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="px-4 lg:px-12 py-6 lg:py-12 max-w-6xl">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-primary text-lg lg:text-xl mb-2 tracking-wide">
            {t('私たちの物語')}
          </p>
          <h1 className="font-display text-3xl lg:text-4xl mb-8">{t('about.title')}</h1>

          <p className="text-gray-300 leading-relaxed mb-5">{t('about.paragraph1')}</p>
          <p className="text-gray-300 leading-relaxed mb-5">{t('about.paragraph2')}</p>
          <p className="text-gray-300 leading-relaxed mb-5">{t('about.paragraph3')}</p>
          <p className="text-gray-300 leading-relaxed">{t('about.paragraph4')}</p>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 1.03, filter: 'blur(16px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative lg:sticky lg:top-24"
        >
          <img
            src="/download.jpg"
            alt={t('about.title')}
            className="w-full h-[1000px] lg:h-[3800px] object-cover rounded-lg"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-12">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-surface border border-border-subtle rounded-lg p-5 text-center"
          >
            <p className="font-display text-3xl lg:text-4xl text-primary mb-2">{stat.value}</p>
            <p className="text-xs lg:text-sm text-gray-400">{t(`about.stats.${stat.key}`)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}