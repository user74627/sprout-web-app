import { NavLink } from 'react-router-dom'
import { Home, CheckSquare, ShoppingBag, BarChart3 } from '../ui/icons'
import SproutMark from '../SproutMark/SproutMark'

const links = [
  { to: '/', label: 'Garden', Icon: Home },
  { to: '/tasks', label: 'Tasks', Icon: CheckSquare },
  { to: '/shop', label: 'Shop', Icon: ShoppingBag },
  { to: '/profile', label: 'Progress', Icon: BarChart3 },
]

function NavigationLink({ to, label, Icon, desktop = false }) {
  return (
    <NavLink to={to} end={to === '/'} className={({ isActive }) => `${desktop ? 'sprout-side-link' : 'sprout-bottom-link'} ${isActive ? 'is-active' : ''}`}>
      <span><Icon size={desktop ? 20 : 21} aria-hidden="true" /></span>
      <small>{label}</small>
    </NavLink>
  )
}

export default function Navbar() {
  return (
    <>
      <aside className="sprout-side-nav" aria-label="Primary navigation">
        <div className="sprout-side-brand"><SproutMark size={40} /><strong>Sprout</strong></div>
        <nav>{links.map((link) => <NavigationLink key={link.to} {...link} desktop />)}</nav>
      </aside>
      <nav className="sprout-bottom-nav" aria-label="Primary navigation">
        <div>{links.map((link) => <NavigationLink key={link.to} {...link} />)}</div>
      </nav>
    </>
  )
}
