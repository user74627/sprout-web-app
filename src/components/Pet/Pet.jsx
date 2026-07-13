import { motion } from 'framer-motion'

const STATES = {
  thriving: {
    headFill: '#7bc462', stemStroke: '#5aad42', leaf1Fill: '#5aad42', leaf2Fill: '#489234',
    potFill: '#c4a87c', rimFill: '#a68f5e', eyeFill: '#2d5e1f',
    stemPath: 'M100 179 Q99 158 100 138 Q101 118 100 104',
    leaf1Path: 'M97 150 C82 138 62 124 58 106 C72 112 89 132 99 148 Z',
    leaf2Path: 'M103 138 C118 126 138 112 142 94 C128 100 111 120 101 136 Z',
    headCx: 100, headCy: 78,
    eye1: { cx: 91, cy: 74 }, eye2: { cx: 109, cy: 74 },
    shine1: { cx: 93, cy: 72.5 }, shine2: { cx: 111, cy: 72.5 },
    mouthPath: 'M88 82 Q100 93 112 82',
    cheeks: true, sparkles: true, tears: false,
    animation: 'breathe',
    label: 'Thriving',
  },
  content: {
    headFill: '#a8d88f', stemStroke: '#7bc462', leaf1Fill: '#7bc462', leaf2Fill: '#5aad42',
    potFill: '#c4a87c', rimFill: '#a68f5e', eyeFill: '#3a7829',
    stemPath: 'M100 179 Q99 158 100 138 Q100 118 100 104',
    leaf1Path: 'M97 150 C84 142 68 134 65 118 C78 122 93 138 99 148 Z',
    leaf2Path: 'M103 140 C116 132 132 124 135 108 C122 112 107 128 101 138 Z',
    headCx: 100, headCy: 78,
    eye1: { cx: 91, cy: 74 }, eye2: { cx: 109, cy: 74 },
    shine1: { cx: 93, cy: 72.5 }, shine2: { cx: 111, cy: 72.5 },
    mouthPath: 'M90 82 Q100 89 110 82',
    cheeks: false, sparkles: false, tears: false,
    animation: 'breathe',
    label: 'Content',
  },
  droopy: {
    headFill: '#d4c88a', stemStroke: '#b8a86a', leaf1Fill: '#c4b87a', leaf2Fill: '#b0a468',
    potFill: '#b89878', rimFill: '#9a7f62', eyeFill: '#6b5640',
    stemPath: 'M100 179 Q97 158 97 138 Q96 118 97 104',
    leaf1Path: 'M97 150 C86 158 72 170 68 186 C80 174 94 160 99 150 Z',
    leaf2Path: 'M101 140 C112 148 126 160 130 176 C118 164 105 150 101 140 Z',
    headCx: 98, headCy: 80,
    eye1: { cx: 89, cy: 76 }, eye2: { cx: 107, cy: 76 },
    shine1: { cx: 91, cy: 74.5 }, shine2: { cx: 109, cy: 74.5 },
    mouthPath: 'M89 86 Q98 82 107 86',
    cheeks: false, sparkles: false, tears: false,
    animation: 'breathe-slow',
    tilt: -2,
    label: 'Droopy',
  },
  sad: {
    headFill: '#b8b8b8', stemStroke: '#989898', leaf1Fill: '#a8a8a8', leaf2Fill: '#909090',
    potFill: '#a09088', rimFill: '#887870', eyeFill: '#4a3f32',
    stemPath: 'M100 179 Q94 158 92 138 Q90 118 91 104',
    leaf1Path: 'M96 150 C86 162 74 180 72 200 C82 184 93 166 98 150 Z',
    leaf2Path: 'M99 140 C110 152 122 170 124 190 C114 174 103 156 99 140 Z',
    headCx: 93, headCy: 82,
    eye1: { cx: 84, cy: 79 }, eye2: { cx: 102, cy: 79 },
    shine1: { cx: 85.5, cy: 77.5 }, shine2: { cx: 103.5, cy: 77.5 },
    mouthPath: 'M82 90 Q93 84 104 90',
    cheeks: false, sparkles: false, tears: true,
    animation: 'breathe-slow',
    tilt: -3,
    label: 'Sad',
  },
}

const ANIMATION_CLASS = {
  breathe: 'animate-breathe',
  'breathe-slow': 'animate-breathe-slow',
}

function AccessoryLayer({ equippedItems, headCy }) {
  const topY = headCy - 23
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
        <text x="107" y={topY - 1} textAnchor="middle" fontSize="26">🎉</text>
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

function Sparkles() {
  return (
    <g>
      <circle cx="132" cy="52" r="3.5" fill="#f0c040" className="pet-sparkle" style={{ animationDelay: '0s' }} />
      <circle cx="70" cy="58" r="2.5" fill="#f0c040" className="pet-sparkle" style={{ animationDelay: '0.6s' }} />
      <circle cx="138" cy="80" r="2" fill="#fdf4d4" className="pet-sparkle" style={{ animationDelay: '1.2s' }} />
    </g>
  )
}

export default function Pet({ health = 100, equippedItems = [], size = 200 }) {
  const state = health >= 75 ? 'thriving'
    : health >= 45 ? 'content'
    : health >= 20 ? 'droopy'
    : 'sad'

  const c = STATES[state]
  const animClass = ANIMATION_CLASS[c.animation] || 'animate-breathe'

  return (
    <div className="flex flex-col items-center gap-1 select-none relative">
      <div
        className={`relative ${animClass}`}
        style={{
          transform: c.tilt ? `rotate(${c.tilt}deg)` : undefined,
          transformOrigin: '50% 80%',
        }}
      >
        <svg
          viewBox="0 0 200 250"
          width={size}
          height={size * 1.25}
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`Pet is ${c.label}`}
        >
          <ellipse cx="100" cy="242" rx="48" ry="7" fill="rgba(74,63,50,0.07)" />

          {equippedItems.includes('rainbow') && (
            <text x="100" y="32" textAnchor="middle" fontSize="56" opacity="0.70">🌈</text>
          )}

          <rect x="62" y="184" width="76" height="12" rx="6" fill={c.rimFill} />
          <path d="M65 196 L135 196 L143 235 L57 235 Z" fill={c.potFill} />
          <path d="M75 200 Q73 216 75 229" stroke="rgba(255,255,255,0.25)"
            strokeWidth="4" fill="none" strokeLinecap="round" />
          <ellipse cx="100" cy="186" rx="35" ry="7" fill="#4a3f32" opacity="0.7" />

          <path d={c.stemPath} stroke={c.stemStroke} strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d={c.leaf1Path} fill={c.leaf1Fill} />
          <path d={c.leaf2Path} fill={c.leaf2Fill} />

          <circle cx={c.headCx} cy={c.headCy} r="26" fill={c.headFill} />
          <circle cx={c.eye1.cx} cy={c.eye1.cy} r="4.5" fill={c.eyeFill} />
          <circle cx={c.eye2.cx} cy={c.eye2.cy} r="4.5" fill={c.eyeFill} />
          <circle cx={c.shine1.cx} cy={c.shine1.cy} r="1.5" fill="white" />
          <circle cx={c.shine2.cx} cy={c.shine2.cy} r="1.5" fill="white" />

          {state === 'sad' && (
            <g>
              <path d="M80 72 Q84 70 88 73" stroke={c.eyeFill} strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M98 73 Q102 70 106 72" stroke={c.eyeFill} strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          )}

          {c.cheeks && (
            <g>
              <ellipse cx="85" cy="80" rx="5" ry="3" fill="#d4604a" opacity="0.35" />
              <ellipse cx="115" cy="80" rx="5" ry="3" fill="#d4604a" opacity="0.35" />
            </g>
          )}

          <path d={c.mouthPath} stroke={c.eyeFill} strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {c.tears && (
            <g>
              <path d="M83 83 C82 88 81 92 82 96" stroke="#8ab4d4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M104 83 C105 88 106 92 105 96" stroke="#8ab4d4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {c.sparkles && <Sparkles />}
          <AccessoryLayer equippedItems={equippedItems} headCy={c.headCy} />
        </svg>
      </div>
    </div>
  )
}

export function getPetMoodClass(state) {
  return `pet-glow pet-glow-${state}`
}
