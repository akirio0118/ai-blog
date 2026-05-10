import Link from 'next/link'
import { Sparkles, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white text-sm">AI活用マガジン</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              ChatGPT・Claude・GeminiなどのAIツールを<br />
              誰でも使いこなせるようにわかりやすく解説。
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">メニュー</h3>
              <ul className="space-y-2 text-xs">
                <li><Link href="/" className="hover:text-white transition-colors">記事一覧</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">このサイトについて</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">AIツール</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    ChatGPT <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    Claude <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                    Gemini <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <p>© 2026 AI活用マガジン</p>
          <p className="text-slate-500">当サイトはアフィリエイト広告を掲載しています。</p>
        </div>
      </div>
    </footer>
  )
}
