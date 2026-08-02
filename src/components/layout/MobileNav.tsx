import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function MobileNav() {
  const { t } = useTranslation()
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
    <div className="lg:hidden">
      <header className="flex items-center justify-between px-4 py-4 bg-surface border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <img src="/Ava2.jpg" alt="Logo" className="w-8 h-8 rounded object-cover" />
          <span className="font-display text-sm">KIBI</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-2xl leading-none px-2"
          aria-label="Open menu"
        >
          ☰
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between px-4 py-4 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-display text-sm">
                刃
              </div>
              <span className="font-display text-sm">KIBI</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-2xl leading-none px-2"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col px-4 py-6 gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-4 rounded text-base font-medium ${
                    isActive ? 'bg-primary text-white' : 'text-gray-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}