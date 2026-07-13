const VARIANTS = {
  default: 'card',
  elevated: 'card-elevated',
  flat: 'card-flat',
}

export default function Card({ variant = 'default', className = '', children, ...props }) {
  const base = VARIANTS[variant] || VARIANTS.default
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  )
}
