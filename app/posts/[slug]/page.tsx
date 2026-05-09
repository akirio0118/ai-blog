import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
      <time className="text-sm text-gray-400 block mb-8">{post.date}</time>

      {/* アドセンス枠（記事上） */}
      <div className="bg-gray-100 rounded-lg h-20 flex items-center justify-center text-gray-400 text-sm mb-8">
        広告スペース
      </div>

      <article
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* アドセンス枠（記事下） */}
      <div className="bg-gray-100 rounded-lg h-20 flex items-center justify-center text-gray-400 text-sm mt-10">
        広告スペース
      </div>
    </div>
  )
}
