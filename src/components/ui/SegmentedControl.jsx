export default function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex bg-soil-100 rounded-lg p-1 overflow-x-auto scrollbar-hide ${className}`} role="tablist">
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
            className={`flex-1 min-w-max px-3 py-2 rounded-md text-xs font-medium capitalize
              transition-all duration-150 focus-visible:ring-2 focus-visible:ring-sprout-400 ${
              active
                ? 'bg-white text-soil-800 shadow-sm'
                : 'text-soil-400 hover:text-soil-600'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
