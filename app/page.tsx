import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import { PenLine, Users, Lightbulb } from 'lucide-react'

export default function Home() {
  const posts = getAllPosts()

  return (
    <div>
      {/* Hero Section — warm & human */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 py-14">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left: text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-3.5 py-1.5 mb-5 shadow-sm">
                <span className="text-base">👋</span>
                <span className="text-xs font-medium text-orange-700">AIを、もっと身近に</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-snug">
                AI活用マガジン
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                ChatGPT・Claude・Geminiなど話題のAIツールを<br />
                <span className="font-semibold text-orange-600">初心者でもわかるように</span>やさしく解説。<br />
                仕事・学習・日常にAIを取り入れてみよう。
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 text-sm text-gray-600">
                  <PenLine className="w-4 h-4 text-orange-400" />
                  <span><span className="font-bold text-gray-900">{posts.length}</span>本の記事</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>初心者〜中級者向け</span>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 shadow-sm border border-gray-100 text-sm text-gray-600">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  <span>すぐ使えるヒント満載</span>
                </div>
              </div>
            </div>

            {/* Right: illustration card */}
            <div className="flex-shrink-0 hidden md:block">
              <div className="w-52 h-52 bg-white rounded-3xl shadow-lg border border-orange-100 flex flex-col items-center justify-center gap-3 p-6">
                <div className="text-5xl">🤖</div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-800">AIツール比較・解説</div>
                  <div className="text-xs text-gray-400 mt-0.5">2026年最新版</div>
                </div>
                <div className="flex gap-1.5 mt-1">
                  <span className="text-lg">🧠</span>
                  <span className="text-lg">✍️</span>
                  <span className="text-lg">🔍</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Ad space */}
        <div className="bg-gray-100 rounded-2xl h-20 flex items-center justify-center text-gray-400 text-sm mb-10 border border-gray-200">
          広告スペース
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900">最新記事</h2>
          <span className="text-xs bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-medium">{posts.length}件</span>
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
