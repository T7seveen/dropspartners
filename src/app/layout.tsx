import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Drops Partners', template: '%s | Drops Partners' },
  description: 'Партнёрская платформа для монетизации трафика и роста бизнеса. CPA, RevShare, дропшиппинг.',
  keywords: 'партнёрская программа, CPA, RevShare, арбитраж трафика, дропшиппинг, заработок',
  openGraph: {
    title: 'Drops Partners — Монетизируй трафик',
    description: 'Экосистема для арбитражников, блогеров и владельцев трафика.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="antialiased min-h-screen bg-[#0A0A0F] text-[#F0F4FF]">
        {children}
      </body>
    </html>
  )
}
