import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../../context/CartContext'

export default function MobileNav() {
  const { t, i18n } = useTranslation()
  const { totalItemCount } = useCart()
  const [open, setOpen] = useState(false)

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.menu'), path: '/menu' },
    { label: t('nav.reservation'), path: '/reservation' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.contact'), path: '/contact' },
  ]

  return (
    <div className="lg:hidden w-full">
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-surface border-b border-border-subtle w-full">
        <div className="flex items-center gap-2">
          <img src="/Ava2.jpg" alt="Logo" className="w-8 h-8 sm:w-9 sm:h-9 rounded object-cover" />
          <span className="font-display text-sm sm:text-base">KIBI</span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/cart" className="relative flex items-center text-gray-300" aria-label="Cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {totalItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalItemCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="text-2xl leading-none px-1"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border-subtle shrink-0">
            <div className="flex items-center gap-2">
              <img src="/Ava2.jpg" alt="Logo" className="w-8 h-8 sm:w-9 sm:h-9 rounded object-cover" />
              <span className="font-display text-sm sm:text-base">KIBI</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-2xl leading-none px-1"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col">
            {/* Language switcher */}
            <div className="flex items-center gap-3 text-sm font-semibold mb-6">
              <button
                onClick={() => i18n.changeLanguage('de')}
                className={`px-3 py-1.5 rounded transition-colors ${i18n.language === 'de' ? 'bg-primary text-white' : 'text-gray-400'}`}
              >
                DE
              </button>
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-3 py-1.5 rounded transition-colors ${i18n.language === 'en' ? 'bg-primary text-white' : 'text-gray-400'}`}
              >
                EN
              </button>
            </div>

            <nav className="flex flex-col gap-2 mb-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3.5 sm:py-4 rounded text-base font-medium ${
                      isActive ? 'bg-primary text-white' : 'text-gray-300'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-4">
              <Link
                to="/reservation"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-primary hover:bg-primary-dark transition-colors text-white font-bold uppercase tracking-wide text-sm py-4 rounded"
              >
                {t('nav.bookTable')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}