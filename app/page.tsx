import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import { Sparkles, Bot, Zap, Search } from 'lucide-react'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent" />

        {/* Floating icons */}
        <div className="absolute top-8 right-16 w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-blue-500/20">
          <Bot className="w-6 h-6 text-blue-400" />
        </div>
        <div className="absolute bottom-8 right-32 w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-purple-500/20">
          <Zap className="w-5 h-5 text-purple-400" />
        </div>
        <div className="absolute top-12 left-20 w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-cyan-500/20">
          <Search className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-medium text-blue-300">AIツール活用ガイド 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            AI活用マガジン
          </h1>
          <p className="text-blue-200/80 text-lg max-w-2xl mx-auto leading-relaxed">
            ChatGPT・Claude・Geminiなど最新AIツールの<br className="hidden md:block" />
            使い方・比較・活用術をわかりやすく解説
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{posts.length}</div>
              <div className="text-xs text-blue-300/70 mt-0.5">記事</div>
            </div>
            <div className="w-px bg-blue-500/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">無料</div>
              <div className="text-xs text-blue-300/70 mt-0.5">全記事公開</div>
            </div>
            <div className="w-px bg-blue-500/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2026</div>
              <div className="text-xs text-blue-300/70 mt-0.5">最新情報</div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Ad space */}
        <div className="bg-gray-100 rounded-2xl h-20 flex items-center justify-center text-gray-400 text-sm mb-10 border border-gray-200/80">
          広告スペース
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">最新記事</h2>
          <span className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">{posts.length}件</span>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-20">記事を準備中です...</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
