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

  const hideNavbar = location.pathname.startsWith('/reservation')

  return (
    <div className="h-screen flex bg-background text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {!hideNavbar && (
          <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl shadow-lg shadow-black/20 flex items-center">
            {/* Mobile/tablet header (logo + hamburger) — handles its own
                padding/background, and owns the language switcher, cart,
                and book-table link inside its slide-out drawer so the top
                bar never has to cram everything into one row on narrow
                screens. */}
            <MobileNav />

            {/* Desktop-only top bar — the sidebar already provides primary
                navigation at this width, so this row only needs the
                secondary actions. */}
            <div className="hidden lg:flex flex-1 items-center justify-end gap-6 px-6 xl:px-8 py-4 xl:py-6">
              <div className="flex items-center gap-2.5 text-sm font-semibold">
                <button
                  onClick={() => i18n.changeLanguage('de')}
                  className={`transition-colors ${i18n.language === 'de' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  DE
                </button>
                <span className="text-gray-600 font-light select-none">|</span>
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`transition-colors ${i18n.language === 'en' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  EN
                </button>
              </div>

              <Link to="/cart" className="relative flex items-center text-gray-300 hover:text-primary transition-colors group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 transition-transform group-hover:scale-110"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {totalItemCount}
                  </span>
                )}
              </Link>

              <Link
                to="/reservation"
                className="text-red-600 transition-all duration-300 ease-out hover:text-red-400 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] text-sm font-bold uppercase tracking-wide whitespace-nowrap"
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