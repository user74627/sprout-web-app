import { NavLink } from 'react-router-dom'
import { Home, CheckSquare, ShoppingBag, BarChart3 } from '../ui/icons'

const links = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/tasks', label: 'Tasks', Icon: CheckSquare },
  { to: '/shop', label: 'Shop', Icon: ShoppingBag },
  { to: '/profile', label: 'Settings', Icon: BarChart3 },
]

export default function Navbar() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                 bg-white/90 backdrop-blur-lg border-t border-soil-200/40
                 flex items-center justify-around px-2 z-50 shadow-[0_-4px_24px_rgba(74,63,50,0.06)]"
      style={{
        height: 'calc(4rem + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Main navigation"
    >
      {links.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg
                     transition-colors duration-150 min-w-[4rem] relative"
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-sprout-400"
                  aria-hidden="true"
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.25 : 1.75}
                className={isActive ? 'text-sprout-500' : 'text-soil-400'}
                aria-hidden="true"
              />
              <span className={`text-[10px] tracking-wide ${
                isActive ? 'text-sprout-600 font-medium' : 'text-soil-400 font-normal'
              }`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
