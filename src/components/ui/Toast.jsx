import { motion, AnimatePresence } from 'framer-motion'

const TONES = {
  success: 'bg-sprout-500 text-white',
  reward: 'bg-gradient-to-r from-sprout-500 to-xp-500 text-white',
  error: 'bg-danger-500 text-white',
}

export default function Toast({ show, tone = 'success', children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="toast"
          role="status"
          initial={{ opacity: 0, y: -20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', damping: 22, stiffness: 350 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-lift
                      flex items-center gap-2 font-semibold text-label max-w-[90vw] text-center
                      ${TONES[tone] || TONES.success}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
