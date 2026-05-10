import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Calendar, ArrowLeft, Tag } from 'lucide-react'

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
      {/* Breadcrumb */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        記事一覧に戻る
      </Link>

      {/* Tags */}
      <div className="flex items-center flex-wrap gap-2 mb-4">
        <Tag className="w-3.5 h-3.5 text-gray-400" />
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full font-medium">
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <time>{post.date}</time>
        </div>
      </div>

      {/* Ad space */}
      <div className="bg-gray-100 rounded-2xl h-20 flex items-center justify-center text-gray-400 text-sm mb-8 border border-gray-200/80">
        広告スペース
      </div>

      {/* Article Body */}
      <article
        className="prose prose-gray prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-3 prose-a:text-blue-600 prose-strong:text-gray-900 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Ad space bottom */}
      <div className="bg-gray-100 rounded-2xl h-20 flex items-center justify-center text-gray-400 text-sm mt-12 border border-gray-200/80">
        広告スペース
      </div>

      {/* Back link */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          記事一覧に戻る
        </Link>
      </div>
    </div>
  )
}
