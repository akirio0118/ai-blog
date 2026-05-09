import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: {
    default: 'AI活用マガジン | ChatGPT・Claude・AIツール徹底ガイド',
    template: '%s | AI活用マガジン',
  },
  description: 'ChatGPT、Claude、Geminiなど最新AIツールの使い方・比較・活用術を徹底解説。',
  keywords: ['ChatGPT', 'Claude', 'AI', 'AIツール', '使い方', '比較', '活用術'],
  openGraph: {
    siteName: 'AI活用マガジン',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${noto.className} bg-gray-50 text-gray-800`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
