const VARIANTS = {
  primary:   { md: 'btn-primary',   sm: 'btn-primary-sm' },
  secondary: { md: 'btn-secondary', sm: 'btn-secondary-sm' },
  ghost:     { md: 'btn-ghost',     sm: 'btn-ghost' },
  danger:    { md: 'btn-danger',    sm: 'btn-danger' },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  ...props
}) {
  const base = (VARIANTS[variant] || VARIANTS.primary)[size] || VARIANTS.primary.md

  return (
    <button type="button" className={`${base} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}
