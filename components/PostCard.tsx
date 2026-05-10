import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

// カバー画像風グラデーション & 絵文字の設定（slugベース）
const covers = [
  { gradient: 'from-blue-400 to-indigo-500', emoji: '🤖', bg: 'bg-blue-50' },
  { gradient: 'from-violet-400 to-purple-500', emoji: '🧠', bg: 'bg-violet-50' },
  { gradient: 'from-cyan-400 to-sky-500', emoji: '🔍', bg: 'bg-cyan-50' },
  { gradient: 'from-emerald-400 to-teal-500', emoji: '✍️', bg: 'bg-emerald-50' },
  { gradient: 'from-orange-400 to-amber-500', emoji: '💡', bg: 'bg-orange-50' },
  { gradient: 'from-rose-400 to-pink-500', emoji: '⚡', bg: 'bg-rose-50' },
]

// タグに応じた絵文字マッピング
const tagEmoji: Record<string, string> = {
  'ChatGPT': '🤖',
  'Claude': '🧠',
  'Gemini': '✨',
  'Perplexity': '🔍',
  'AI検索': '🔍',
  'プロンプト': '✍️',
  'Google AI': '✨',
  'AI': '💡',
}

function getCover(slug: string) {
  const index = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % covers.length
  return covers[index]
}

function getEmoji(tags: string[]) {
  for (const tag of tags) {
    if (tagEmoji[tag]) return tagEmoji[tag]
  }
  return '💬'
}

export default function PostCard({ post }: { post: PostMeta }) {
  const cover = getCover(post.slug)
  const emoji = getEmoji(post.tags)

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-0.5">
      {/* Cover image area */}
      <Link href={`/posts/${post.slug}`}>
        <div className={`relative h-36 bg-gradient-to-br ${cover.gradient} flex items-center justify-center overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 text-6xl select-none">{emoji}</div>
            <div className="absolute bottom-2 right-6 text-4xl select-none rotate-12">{emoji}</div>
          </div>
          {/* Center icon */}
          <div className="relative text-6xl drop-shadow-sm group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </div>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={`text-xs ${cover.bg} text-gray-600 px-2.5 py-0.5 rounded-full font-medium`}>
              {tag}
            </span>
          ))}
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 leading-snug mb-2 transition-colors">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{post.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <time>{post.date}</time>
          </div>
          <Link
            href={`/posts/${post.slug}`}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 group/link"
          >
            続きを読む
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  )
}
