import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Pet from '../Pet/Pet'

const MOOD_COPY = {
  thriving: 'Radiating good energy',
  content: 'Growing steady and strong',
  droopy: 'A little care would help',
  sad: 'Ready for a small win',
}

export default function Habitat({
  health = 100,
  equippedItems = [],
  petName = 'Pip',
  state = 'content',
  className = '',
}) {
  const reduceMotion = useReducedMotion()

  return (
    <section className={`garden-habitat garden-habitat-${state} ${className}`} aria-label={`${petName}'s habitat`}>
      <div className="garden-sky-glow" aria-hidden="true" />
      <div className="garden-sun" aria-hidden="true"><span /></div>
      <div className="garden-cloud garden-cloud-one" aria-hidden="true" />
      <div className="garden-cloud garden-cloud-two" aria-hidden="true" />
      <div className="garden-hill garden-hill-back" aria-hidden="true" />
      <div className="garden-hill garden-hill-front" aria-hidden="true" />
      <div className="garden-grain" aria-hidden="true" />

      <div className="garden-habitat-label">
        <span className="garden-live-dot" aria-hidden="true" />
        Live garden
      </div>

      <motion.div
        className="garden-pet-stage"
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="garden-pet-aura" aria-hidden="true" />
        <Pet health={health} equippedItems={equippedItems} size={150} />
      </motion.div>

      <div className="garden-habitat-copy">
        <div className="garden-pet-name-row">
          <h2>{petName}</h2>
          <span className={`garden-mood-chip garden-mood-${state}`}>{state}</span>
        </div>
        <p>{MOOD_COPY[state]}</p>
      </div>

      {state === 'thriving' && (
        <div className="garden-sparkle" aria-hidden="true">
          <Sparkles size={18} />
        </div>
      )}
    </section>
  )
}
