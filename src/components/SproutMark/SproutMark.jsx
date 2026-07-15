export default function SproutMark({ size = 36, className = '' }) {
  const gradientId = `sprout-mark-${size}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Sprout"
    >
      <defs>
        <linearGradient id={gradientId} x1="18" y1="8" x2="82" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2e5e3c" />
          <stop offset="1" stopColor="#173c2b" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${gradientId})`} />
      <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.12)" />
      <path d="M50 77V39" stroke="#79c565" strokeWidth="5" strokeLinecap="round" />
      <path d="M49 50C35 49 25 42 26 32c13-1 23 5 26 17Z" fill="#5da84a" />
      <path d="M51 42c13 0 22-7 22-17-13-1-22 5-24 16Z" fill="#79c565" />
      <circle cx="50" cy="29" r="3.5" fill="#e8b73e" />
    </svg>
  )
}
