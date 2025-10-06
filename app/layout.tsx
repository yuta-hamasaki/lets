import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'
import { HeaderWrapper } from '@/components/header-wrapper'
import { Footer } from '@/components/footer'

export const metadata: Metadata = {
  title: 'Sample',
  description: 'チームでの効率的なプロジェクト管理を実現するサブスクリプション型SaaSサービス'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col antialiased">
        <Providers>
          <HeaderWrapper />
          <main className="flex-grow relative pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
