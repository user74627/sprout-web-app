import { motion, useReducedMotion } from 'framer-motion'
import Pet from '../Pet/Pet'

const MOOD_COPY = {
  thriving: 'Doing very well',
  content: 'Doing well',
  droopy: 'Needs some care',
  sad: 'Needs a small win',
}

export default function Habitat({ health = 100, equippedItems = [], petName = 'Pip', state = 'content' }) {
  const reduceMotion = useReducedMotion()

  return (
    <figure className="editorial-habitat-figure">
      <div className={`garden-habitat editorial-habitat garden-habitat-${state}`} aria-label={`${petName}'s habitat`}>
        <div className="editorial-habitat-sun" aria-hidden="true" />
        <div className="editorial-habitat-horizon" aria-hidden="true" />
        <div className="editorial-habitat-ground" aria-hidden="true" />
        <div className="garden-pet-stage editorial-pet-stage">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.35 }}>
            <Pet health={health} equippedItems={equippedItems} size={148} />
          </motion.div>
        </div>
      </div>
      <figcaption className="editorial-habitat-caption">
        <div>
          <h2>{petName}</h2>
          <p>{MOOD_COPY[state]} · {health}% health</p>
        </div>
        <span className={`editorial-mood editorial-mood-${state}`}>{state}</span>
      </figcaption>
    </figure>
  )
}
