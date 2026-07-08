function CoinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="5.5" fill="none" stroke="#d97706" strokeWidth="1.2" opacity="0.55" />
      <path d="M10 6.5v7M8 8.4c0-.9.9-1.4 2-1.4s2 .5 2 1.3c0 2-4 1.4-4 3.4 0 .8.9 1.3 2 1.3s2-.5 2-1.4"
        stroke="#b45309" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function CoinPill({ amount = 0 }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 bg-surface-elevated border border-line-subtle
                 px-3 py-1.5 rounded-full shadow-card"
      aria-label={`${amount} coins`}
    >
      <CoinIcon />
      <span className="text-label font-bold text-coin-600 tabular">{amount}</span>
    </div>
  )
}

export { CoinIcon }
