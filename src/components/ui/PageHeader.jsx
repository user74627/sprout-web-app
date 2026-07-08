export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="min-w-0">
        <h1 className="text-page-title truncate">{title}</h1>
        {subtitle && <p className="text-page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 ml-3">{action}</div>}
    </div>
  )
}
