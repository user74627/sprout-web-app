import { AnimatePresence, motion } from 'framer-motion'
import { Coins, Heart, Star } from 'lucide-react'

const PARTICLES = [
  { key: 'health', Icon: Heart, x: -34, delay: 0, tone: 'leaf' },
  { key: 'coins', Icon: Coins, x: 0, delay: 0.08, tone: 'gold' },
  { key: 'xp', Icon: Star, x: 34, delay: 0.16, tone: 'gold' },
]

export default function RewardBurst({ reward, show }) {
  return (
    <AnimatePresence>
      {show && reward && (
        <span className="garden-reward-burst" aria-hidden="true">
          {PARTICLES.map(({ key, Icon, x, delay, tone }) => (
            <motion.span
              key={key}
              className={`garden-reward-particle garden-tone-${tone}`}
              initial={{ opacity: 0, x, y: 4, scale: 0.55 }}
              animate={{ opacity: [0, 1, 1, 0], x, y: [4, -22, -38], scale: [0.55, 1.08, 1] }}
              transition={{ duration: 1, delay, ease: 'easeOut' }}
            >
              <Icon size={13} />+{reward[key]}
            </motion.span>
          ))}
        </span>
      )}
    </AnimatePresence>
  )
}
