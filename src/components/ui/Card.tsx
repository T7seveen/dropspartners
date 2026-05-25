import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  glass?: boolean
}

export function Card({ children, className, glass }: CardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-[#1A2744] p-5',
      glass ? 'glass' : 'bg-[#0D1B2E]',
      className
    )}>
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  trend?: number
  accent?: boolean
  className?: string
}

export function StatCard({ label, value, sub, icon, trend, accent, className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-2xl border p-5 flex flex-col gap-2',
      accent
        ? 'bg-[#2979FF]/10 border-[#2979FF]/40'
        : 'bg-[#0D1B2E] border-[#1A2744]',
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-[#8FA8C8] text-sm">{label}</span>
        {icon && <span className="text-[#2979FF] opacity-80">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-[#F0F4FF]">{value}</div>
      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span className={cn('text-xs font-medium', trend >= 0 ? 'text-green-400' : 'text-red-400')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className="text-xs text-[#8FA8C8]">{sub}</span>}
      </div>
    </div>
  )
}
