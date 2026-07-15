import { Coins, Flame, Heart, Star } from 'lucide-react'

const STATUS_ITEMS = [
  { key: 'health', label: 'Health', Icon: Heart, tone: 'leaf' },
  { key: 'level', label: 'Level', Icon: Star, tone: 'gold' },
  { key: 'streak', label: 'Streak', Icon: Flame, tone: 'coral' },
  { key: 'coins', label: 'Coins', Icon: Coins, tone: 'gold' },
]

export default function GardenStatus({ health, level, streak, coins }) {
  const values = { health: `${health}%`, level, streak: `${streak}d`, coins }

  return (
    <section className="garden-status-strip" aria-label="Garden status">
      {STATUS_ITEMS.map(({ key, label, Icon, tone }) => (
        <div className="garden-status-item" key={key}>
          <span className={`garden-status-icon garden-tone-${tone}`}><Icon size={16} aria-hidden="true" /></span>
          <span>
            <strong className="tabular">{values[key]}</strong>
            <small>{label}</small>
          </span>
        </div>
      ))}
    </section>
  )
}
