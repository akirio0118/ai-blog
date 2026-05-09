import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/posts/${post.slug}`}>
        <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 leading-snug mb-2">
          {post.title}
        </h2>
      </Link>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.description}</p>
      <div className="flex items-center justify-between">
        <time className="text-xs text-gray-400">{post.date}</time>
        <Link href={`/posts/${post.slug}`} className="text-sm text-blue-600 hover:underline font-medium">
          続きを読む →
        </Link>
      </div>
    </article>
  )
}
