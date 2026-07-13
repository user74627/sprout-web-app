import { NavLink } from 'react-router-dom'

const links = [
  {
    to: '/',
    label: 'Home',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    to: '/tasks',
    label: 'Tasks',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    to: '/shop',
    label: 'Shop',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Settings',
    icon: (active) => (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
]

export default function Navbar() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                 bg-surface-elevated/95 backdrop-blur-md border-t border-line-subtle
                 flex items-center justify-around px-2 py-2 z-50"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {links.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-150 ${
              isActive
                ? 'text-sprout-600 bg-sprout-50'
                : 'text-ink-muted hover:text-ink-secondary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {icon(isActive)}
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
