import { Outlet, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import { useCart } from '../../context/CartContext'

export default function Layout() {
  const { t, i18n } = useTranslation()
  const { totalItemCount } = useCart()
  const location = useLocation()

  // The reservation flow uses its own full-page hero layout (title +
  // form), designed to feel like a dedicated booking screen rather than a
  // regular content page — so the top navbar is hidden there entirely.
  const hideNavbar = location.pathname.startsWith('/reservation')

  return (
    <div className="h-screen flex bg-background text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {!hideNavbar && (
          <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl shadow-lg shadow-black/20">
            <MobileNav />

            <div className="flex justify-end items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 px-2 sm:px-3 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 lg:py-6 flex-wrap">
              <div className="flex gap-1 text-[9px] sm:text-[10px] md:text-xs font-semibold">
                <button
                  onClick={() => i18n.changeLanguage('de')}
                  className={`px-1 py-0.5 md:px-2 md:py-1 rounded transition-colors ${i18n.language === 'de' ? 'bg-primary' : 'text-gray-400'}`}
                >
                  DE
                </button>
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`px-1 py-0.5 md:px-2 md:py-1 rounded transition-colors ${i18n.language === 'en' ? 'bg-primary' : 'text-gray-400'}`}
                >
                  EN
                </button>
              </div>

              <Link to="/cart" className="relative text-sm sm:text-base md:text-lg lg:text-xl">
                🛒
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 lg:-top-2 lg:-right-2 bg-primary text-white text-[8px] md:text-[9px] lg:text-[10px] font-bold w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-full flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/reservation"
                className="bg-primary hover:bg-primary-dark transition-colors text-[10px] sm:text-xs md:text-sm font-semibold px-2 py-1.5 sm:px-3 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded whitespace-nowrap"
              >
                {t('nav.bookTable')}
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}