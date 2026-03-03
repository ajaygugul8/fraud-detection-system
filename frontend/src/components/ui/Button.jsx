import { cn } from '../../lib/cn'

const variants = {
  primary:
    'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 focus-visible:outline-emerald-400',
  secondary:
    'bg-white/5 text-zinc-100 hover:bg-white/10 focus-visible:outline-white/20',
  ghost:
    'bg-transparent text-zinc-200 hover:bg-white/5 focus-visible:outline-white/20',
  danger:
    'bg-rose-500/10 text-rose-200 hover:bg-rose-500/15 focus-visible:outline-rose-400/30',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
}

export function Button({
  as: Comp = 'button',
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant] ?? variants.secondary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

