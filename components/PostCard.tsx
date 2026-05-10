import Link from 'next/link'
import { ArrowRight, Calendar, Bot, Search, Zap, BookOpen, Cpu } from 'lucide-react'
import type { PostMeta } from '@/lib/posts'

const tagIconMap: Record<string, React.ReactNode> = {
  'ChatGPT': <Bot className="w-4 h-4" />,
  'Claude': <Cpu className="w-4 h-4" />,
  'Gemini': <Zap className="w-4 h-4" />,
  'Perplexity': <Search className="w-4 h-4" />,
  'AI検索': <Search className="w-4 h-4" />,
  'プロンプト': <BookOpen className="w-4 h-4" />,
}

const cardAccents = [
  'from-blue-500 to-indigo-500',
  'from-violet-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-rose-500 to-pink-500',
]

function getAccent(slug: string) {
  const index = slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % cardAccents.length
  return cardAccents[index]
}

function getTopicIcon(tags: string[]) {
  for (const tag of tags) {
    if (tagIconMap[tag]) return tagIconMap[tag]
  }
  return <Bot className="w-4 h-4" />
}

export default function PostCard({ post }: { post: PostMeta }) {
  const accent = getAccent(post.slug)
  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-1">
      <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white flex-shrink-0 ml-2`}>
            {getTopicIcon(post.tags)}
          </div>
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
