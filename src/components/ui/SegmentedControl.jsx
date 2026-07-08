export default function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex bg-cream-200 rounded-2xl p-1 overflow-x-auto scrollbar-hide ${className}`} role="tablist">
      {options.map((option) => {
        const id = typeof option === 'string' ? option : option.id
        const label = typeof option === 'string' ? option : option.label
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`flex-1 min-w-max px-3 py-2 rounded-xl text-label capitalize transition-all duration-150 ${
              active
                ? 'bg-surface-elevated text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink-secondary'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
