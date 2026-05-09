import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
          AI活用マガジン
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-blue-600">記事一覧</Link>
          <Link href="/about" className="hover:text-blue-600">このサイトについて</Link>
        </nav>
      </div>
    </header>
  )
}
