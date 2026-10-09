import { Link } from 'react-router-dom'

const buttonStyles = {
  primary: 'bg-amber-400 text-zinc-950 hover:bg-amber-300',
  secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700',
  danger: 'bg-red-500/90 text-white hover:bg-red-500',
  ghost: 'text-zinc-300 hover:bg-zinc-800 hover:text-white',
}

const buttonClass = (variant = 'primary', className = '') =>
  `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[variant]} ${className}`

export function Button({ variant, className, loading, disabled, children, ...props }) {
  return (
    <button className={buttonClass(variant, className)} disabled={loading || disabled} {...props}>
      {loading && <Spinner small />}
      {children}
    </button>
  )
}

export function LinkButton({ variant, className, children, ...props }) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      {children}
    </Link>
  )
}

export const inputClass =
  'w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400'

export function Field({ label, hint, as: Tag = 'input', className = '', ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-300">{label}</span>
      <Tag className={`${inputClass} ${className}`} {...props} />
      {hint && <span className="mt-1 block text-xs text-zinc-500">{hint}</span>}
    </label>
  )
}

export function Alert({ type = 'error', children }) {
  if (!children) return null
  const styles =
    type === 'error'
      ? 'border-red-500/40 bg-red-500/10 text-red-200'
      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  )
}

export function Spinner({ small }) {
  const size = small ? 'h-4 w-4 border-2' : 'h-8 w-8 border-[3px]'
  return (
    <span
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-current border-t-transparent ${size}`}
    />
  )
}

export function Loading() {
  return (
    <div className="flex justify-center py-20 text-amber-400">
      <Spinner />
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function Card({ className = '', children }) {
  return <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 ${className}`}>{children}</div>
}

export function EmptyState({ title, children }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
      <p className="font-semibold text-zinc-200">{title}</p>
      {children && <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">{children}</p>}
    </div>
  )
}

export function Stars({ value }) {
  if (typeof value !== 'number') return <span className="text-xs text-zinc-500">Not rated</span>
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400">
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
      </svg>
      {value.toFixed(1)}
      <span className="sr-only">out of 5</span>
    </span>
  )
}
