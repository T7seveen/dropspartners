import type { ReactNode } from 'react'

// Advertiser section uses DashboardShell with role="advertiser" in each page
export default function AdvertiserLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
