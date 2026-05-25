import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan'
  className?: string
}

const variants = {
  default: 'bg-[#1A2744] text-[#C8DCFF] border border-[#2979FF]/20',
  blue:    'bg-blue-950/60 text-blue-300 border border-blue-500/30',
  green:   'bg-green-950/60 text-green-300 border border-green-500/30',
  amber:   'bg-amber-950/60 text-amber-300 border border-amber-500/30',
  red:     'bg-red-950/60 text-red-300 border border-red-500/30',
  purple:  'bg-purple-950/60 text-purple-300 border border-purple-500/30',
  cyan:    'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
