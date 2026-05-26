import { motion, AnimatePresence } from 'framer-motion'

// ── State configurations ──────────────────────────────────────────────────────

const STATES = {
  thriving: {
    headFill:   '#6FCF97',
    stemStroke: '#27AE60',
    leaf1Fill:  '#27AE60',
    leaf2Fill:  '#219653',
    potFill:    '#E07A5F',
    rimFill:    '#C9654A',
    eyeFill:    '#1A6B3C',
    stemPath:   'M100 179 Q99 158 100 138 Q101 118 100 104',
    leaf1Path:  'M97 150 C82 138 62 124 58 106 C72 112 89 132 99 148 Z',
    leaf2Path:  'M103 138 C118 126 138 112 142 94 C128 100 111 120 101 136 Z',
    headCx: 100, headCy: 78,
    eye1: { cx: 91, cy: 74 },
    eye2: { cx: 109, cy: 74 },
    shine1: { cx: 93, cy: 72.5 },
    shine2: { cx: 111, cy: 72.5 },
    mouthPath: 'M88 82 Q100 93 112 82',
    cheeks: true,
    sparkles: true,
    tears: false,
    animation: { y: [0, -14, 0] },
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
    label: 'Thriving',
    labelColor: 'text-sprout-600',
    bg: 'bg-sprout-50',
  },
  content: {
    headFill:   '#A5D6A7',
    stemStroke: '#43A047',
    leaf1Fill:  '#66BB6A',
    leaf2Fill:  '#4CAF50',
    potFill:    '#E07A5F',
    rimFill:    '#C9654A',
    eyeFill:    '#2E7D32',
    stemPath:   'M100 179 Q99 158 100 138 Q100 118 100 104',
    leaf1Path:  'M97 150 C84 142 68 134 65 118 C78 122 93 138 99 148 Z',
    leaf2Path:  'M103 140 C116 132 132 124 135 108 C122 112 107 128 101 138 Z',
    headCx: 100, headCy: 78,
    eye1: { cx: 91, cy: 74 },
    eye2: { cx: 109, cy: 74 },
    shine1: { cx: 93, cy: 72.5 },
    shine2: { cx: 111, cy: 72.5 },
    mouthPath: 'M90 82 Q100 89 110 82',
    cheeks: false,
    sparkles: false,
    tears: false,
    animation: { rotate: [-1.5, 1.5, -1.5] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
    label: 'Content',
    labelColor: 'text-green-600',
    bg: 'bg-green-50',
  },
  droopy: {
    headFill:   '#E6EE9C',
    stemStroke: '#8BC34A',
    leaf1Fill:  '#CDDC39',
    leaf2Fill:  '#C6D148',
    potFill:    '#BF8A6E',
    rimFill:    '#A37058',
    eyeFill:    '#558B2F',
    stemPath:   'M100 179 Q97 158 97 138 Q96 118 97 104',
    leaf1Path:  'M97 150 C86 158 72 170 68 186 C80 174 94 160 99 150 Z',
    leaf2Path:  'M101 140 C112 148 126 160 130 176 C118 164 105 150 101 140 Z',
    headCx: 98, headCy: 80,
    eye1: { cx: 89, cy: 76 },
    eye2: { cx: 107, cy: 76 },
    shine1: { cx: 91, cy: 74.5 },
    shine2: { cx: 109, cy: 74.5 },
    mouthPath: 'M89 86 Q98 82 107 86',
    cheeks: false,
    sparkles: false,
    tears: false,
    animation: { y: [0, 4, 0] },
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    label: 'Droopy',
    labelColor: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  sad: {
    headFill:   '#BDBDBD',
    stemStroke: '#757575',
    leaf1Fill:  '#9E9E9E',
    leaf2Fill:  '#757575',
    potFill:    '#A08080',
    rimFill:    '#886666',
    eyeFill:    '#424242',
    stemPath:   'M100 179 Q94 158 92 138 Q90 118 91 104',
    leaf1Path:  'M96 150 C86 162 74 180 72 200 C82 184 93 166 98 150 Z',
    leaf2Path:  'M99 140 C110 152 122 170 124 190 C114 174 103 156 99 140 Z',
    headCx: 93, headCy: 82,
    eye1: { cx: 84, cy: 79 },
    eye2: { cx: 102, cy: 79 },
    shine1: { cx: 85.5, cy: 77.5 },
    shine2: { cx: 103.5, cy: 77.5 },
    mouthPath: 'M82 90 Q93 84 104 90',
    cheeks: false,
    sparkles: false,
    tears: true,
    animation: { opacity: [1, 0.82, 1] },
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
    label: 'Sad',
    labelColor: 'text-gray-500',
    bg: 'bg-gray-50',
  },
}

// ── Accessory overlays (emoji rendered as SVG text) ───────────────────────────

function AccessoryLayer({ equippedItems, headCy }) {
  const topY = headCy - 23  // just above head

  return (
    <g style={{ pointerEvents: 'none' }}>
      {equippedItems.includes('rainbow') && (
        <text x="100" y="32" textAnchor="middle" fontSize="56" opacity="0.75">🌈</text>
      )}
      {equippedItems.includes('crown') && (
        <text x="100" y={topY - 2} textAnchor="middle" fontSize="28">👑</text>
      )}
      {equippedItems.includes('floral') && (
        <text x="100" y={topY + 2} textAnchor="middle" fontSize="26">🌸</text>
      )}
      {equippedItems.includes('partyhat') && (
        <text x="107" y={topY - 1} textAnchor="middle" fontSize="26"
          style={{ transform: 'rotate(-15deg)', transformOrigin: '107px 50px' }}>🎉</text>
      )}
      {equippedItems.includes('sunglasses') && (
        <text x={headCy === 82 ? 93 : 100} y={headCy - 4} textAnchor="middle" fontSize="20">😎</text>
      )}
      {equippedItems.includes('bowtie') && (
        <text x="100" y="112" textAnchor="middle" fontSize="20">🎀</text>
      )}
      {equippedItems.includes('star') && (
        <text x="100" y="222" textAnchor="middle" fontSize="20">⭐</text>
      )}
    </g>
  )
}

// ── Sparkles (thriving state) ─────────────────────────────────────────────────

function Sparkles() {
  return (
    <g>
      <motion.circle cx="132" cy="52" r="3.5" fill="#FFD700"
        animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.4, 0.9] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} />
      <motion.circle cx="70" cy="58" r="2.5" fill="#FFD700"
        animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0.3, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 0.4 }} />
      <motion.circle cx="138" cy="80" r="2" fill="#FFFDE7"
        animate={{ scale: [1, 2, 1], opacity: [0.8, 0.2, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.8 }} />
    </g>
  )
}

// ── Main Pet component ────────────────────────────────────────────────────────

export default function Pet({ health = 100, equippedItems = [], size = 200 }) {
  const state = health >= 75 ? 'thriving'
    : health >= 45 ? 'content'
    : health >= 20 ? 'droopy'
    : 'sad'

  const c = STATES[state]

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <motion.div
        key={state}
        animate={c.animation}
        transition={c.transition}
        style={{ originX: '50%', originY: '80%' }}
      >
        <svg
          viewBox="0 0 200 250"
          width={size}
          height={size * 1.25}
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`Pet is ${c.label}`}
        >
          {/* Shadow */}
          <ellipse cx="100" cy="242" rx="48" ry="7" fill="rgba(0,0,0,0.07)" />

          {/* Rainbow goes behind everything */}
          {equippedItems.includes('rainbow') && (
            <text x="100" y="32" textAnchor="middle" fontSize="56" opacity="0.70">🌈</text>
          )}

          {/* Pot rim */}
          <rect x="62" y="184" width="76" height="12" rx="6" fill={c.rimFill} />

          {/* Pot body */}
          <path d="M65 196 L135 196 L143 235 L57 235 Z" fill={c.potFill} />

          {/* Pot highlight */}
          <path d="M75 200 Q73 216 75 229" stroke="rgba(255,255,255,0.25)"
            strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Soil */}
          <ellipse cx="100" cy="186" rx="35" ry="7" fill="#3E2723" />

          {/* Stem */}
          <motion.path
            d={c.stemPath}
            stroke={c.stemStroke}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            initial={false}
            animate={{ d: c.stemPath }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* Leaves */}
          <motion.path
            d={c.leaf1Path}
            fill={c.leaf1Fill}
            initial={false}
            animate={{ d: c.leaf1Path, fill: c.leaf1Fill }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
          <motion.path
            d={c.leaf2Path}
            fill={c.leaf2Fill}
            initial={false}
            animate={{ d: c.leaf2Path, fill: c.leaf2Fill }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />

          {/* Head */}
          <motion.circle
            cx={c.headCx} cy={c.headCy} r="26"
            fill={c.headFill}
            initial={false}
            animate={{ cx: c.headCx, cy: c.headCy, fill: c.headFill }}
            transition={{ duration: 0.6 }}
          />

          {/* Eyes */}
          <circle cx={c.eye1.cx} cy={c.eye1.cy} r="4.5" fill={c.eyeFill} />
          <circle cx={c.eye2.cx} cy={c.eye2.cy} r="4.5" fill={c.eyeFill} />
          <circle cx={c.shine1.cx} cy={c.shine1.cy} r="1.5" fill="white" />
          <circle cx={c.shine2.cx} cy={c.shine2.cy} r="1.5" fill="white" />

          {/* Sad eyebrows */}
          {state === 'sad' && (
            <g>
              <path d="M80 72 Q84 70 88 73" stroke={c.eyeFill} strokeWidth="2"
                fill="none" strokeLinecap="round" />
              <path d="M98 73 Q102 70 106 72" stroke={c.eyeFill} strokeWidth="2"
                fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Cheeks */}
          {c.cheeks && (
            <g>
              <ellipse cx="85" cy="80" rx="5" ry="3" fill="#FF8A80" opacity="0.45" />
              <ellipse cx="115" cy="80" rx="5" ry="3" fill="#FF8A80" opacity="0.45" />
            </g>
          )}

          {/* Mouth */}
          <path
            d={c.mouthPath}
            stroke={c.eyeFill}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Tears */}
          {c.tears && (
            <g>
              <path d="M83 83 C82 88 81 92 82 96" stroke="#90CAF9"
                strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M104 83 C105 88 106 92 105 96" stroke="#90CAF9"
                strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Sparkles */}
          {c.sparkles && <Sparkles />}

          {/* Accessories */}
          <AccessoryLayer equippedItems={equippedItems} headCy={c.headCy} />
        </svg>
      </motion.div>
    </div>
  )
}
