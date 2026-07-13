export default function ProgressRing({ value = 0, size = 56, label = '', sublabel = '' }) {
  const safeValue = Math.max(0, Math.min(100, value))
  const stroke = 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeValue / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(232, 217, 197, 0.5)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#7bc462"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-sm font-bold text-soil-800 tabular leading-none">
          {label || `${Math.round(safeValue)}%`}
        </span>
        {sublabel && (
          <span className="text-[10px] font-medium text-soil-400 mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  )
}
