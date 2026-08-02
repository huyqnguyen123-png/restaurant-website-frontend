import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useMenuNav } from '../../context/MenuNavContext'

export default function Sidebar() {
  const { t } = useTranslation()
  const { categories, activeCategory, setActiveCategory, onMenuPage } = useMenuNav()

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.menu'), path: '/menu' },
    { label: t('nav.reservation'), path: '/reservation' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.contact'), path: '/contact' },
  ]

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 border-r border-border-subtle bg-surface px-6 py-8 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-12">
        <img src="/Ava2.jpg" alt="Logo" className="w-12 h-12 rounded object-cover" />
        <div>
          <p className="font-display text-lg leading-tight">KIBI</p>
          <p className="text-[10px] text-gray-400 tracking-widest">ASIAN CUISINE</p>
        </div>
      </div>

      {onMenuPage ? (
        <nav className="relative flex flex-col gap-1 overflow-y-auto flex-1 min-h-0">
          <NavLink
            to="/"
            className="relative px-4 py-3 rounded text-sm font-medium text-gray-300 hover:bg-surface-light hover:text-white mb-2 flex items-center gap-2 transition-colors"
          >
            ← {t('nav.home')}
          </NavLink>

          <div className="h-px bg-border-subtle my-2" />

          <button
            onClick={() => setActiveCategory('all')}
            className="relative px-4 py-3 rounded text-sm font-medium text-left overflow-hidden flex items-center"
          >
            {activeCategory === 'all' && (
              <motion.div
                layoutId="sidebar-category-highlight"
                className="absolute inset-0 bg-primary rounded"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className={`relative z-10 ${activeCategory === 'all' ? 'text-white' : 'text-gray-300'}`}>
              {t('menu.categories.all')}
            </span>
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="relative px-4 py-3 rounded text-sm font-medium text-left overflow-hidden flex items-center"
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="sidebar-category-highlight"
                  className="absolute inset-0 bg-primary rounded"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${activeCategory === category ? 'text-white' : 'text-gray-300'}`}>
                {category}
              </span>
            </button>
          ))}
        </nav>
      ) : (
        <nav className="relative flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative px-4 py-3 rounded text-sm font-medium overflow-hidden transition-colors hover:bg-surface-light flex items-center"
              end={item.path === '/'}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-nav-highlight"
                      className="absolute inset-0 bg-primary rounded"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="mt-auto pt-8">
        <p className="text-xs text-gray-500 mb-3">{t('nav.followUs')}</p>
        <a
          href="https://www.instagram.com/kibiori/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-gray-400 hover:text-primary transition-colors"
          aria-label="Instagram"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
      </div>
    </aside>
  )
}