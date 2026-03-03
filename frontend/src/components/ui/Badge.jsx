import { cn } from '../../lib/cn'

const variants = {
  neutral: 'border-white/10 bg-white/5 text-zinc-200',
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-200',
  danger: 'border-rose-500/20 bg-rose-500/10 text-rose-200',
  info: 'border-sky-500/20 bg-sky-500/10 text-sky-200',
}

export function Badge({ variant = 'neutral', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        variants[variant] ?? variants.neutral,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

